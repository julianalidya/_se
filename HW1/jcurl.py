#!/usr/bin/env python3
"""jcurl: a small curl-like HTTP/1.1 client built with raw sockets."""
import argparse
import gzip
import socket
import ssl
import sys
from urllib.parse import urlsplit

CRLF = b"\r\n"


def parse_header(value):
    if ":" not in value:
        raise argparse.ArgumentTypeError("header must be in 'Name: value' format")
    name, val = value.split(":", 1)
    return name.strip(), val.strip()


def build_request(method, target, host_header, headers, body):
    lines = [f"{method} {target} HTTP/1.1", f"Host: {host_header}"]
    defaults = {
        "User-Agent": "jcurl/1.0",
        "Accept": "*/*",
        "Accept-Encoding": "gzip",
        "Connection": "close",
    }
    supplied = {k.lower() for k, _ in headers}
    for key, value in defaults.items():
        if key.lower() not in supplied:
            lines.append(f"{key}: {value}")
    for key, value in headers:
        lines.append(f"{key}: {value}")
    if body and "content-length" not in supplied:
        lines.append(f"Content-Length: {len(body)}")
    return ("\r\n".join(lines) + "\r\n\r\n").encode("iso-8859-1") + body


def decode_chunked(data):
    out = bytearray()
    pos = 0
    while True:
        end = data.find(CRLF, pos)
        if end < 0:
            raise ValueError("invalid chunked response: missing chunk size")
        size_text = data[pos:end].split(b";", 1)[0]
        size = int(size_text, 16)
        pos = end + 2
        if size == 0:
            break
        if pos + size > len(data):
            raise ValueError("invalid chunked response: incomplete chunk")
        out.extend(data[pos:pos + size])
        pos += size
        if data[pos:pos + 2] != CRLF:
            raise ValueError("invalid chunked response: missing CRLF")
        pos += 2
    return bytes(out)


def parse_response(raw):
    head, sep, body = raw.partition(b"\r\n\r\n")
    if not sep:
        raise ValueError("invalid HTTP response")
    lines = head.decode("iso-8859-1").split("\r\n")
    status_line = lines[0]
    headers = []
    header_map = {}
    for line in lines[1:]:
        if ":" in line:
            name, value = line.split(":", 1)
            headers.append((name.strip(), value.strip()))
            header_map[name.strip().lower()] = value.strip()
    if "chunked" in header_map.get("transfer-encoding", "").lower():
        body = decode_chunked(body)
    if "gzip" in header_map.get("content-encoding", "").lower():
        body = gzip.decompress(body)
    return status_line, headers, body


def request(url, method="GET", headers=None, data=None, timeout=10, insecure=False, verbose=False):
    headers = headers or []
    parts = urlsplit(url)
    if parts.scheme not in ("http", "https") or not parts.hostname:
        raise ValueError("URL must begin with http:// or https://")

    secure = parts.scheme == "https"
    port = parts.port or (443 if secure else 80)
    target = parts.path or "/"
    if parts.query:
        target += "?" + parts.query
    default_port = 443 if secure else 80
    host_header = parts.hostname if port == default_port else f"{parts.hostname}:{port}"
    body = (data or "").encode("utf-8")
    packet = build_request(method.upper(), target, host_header, headers, body)

    if verbose:
        print(f"* Connecting to {parts.hostname}:{port}", file=sys.stderr)
        for line in packet.split(CRLF):
            if line:
                print("> " + line.decode("iso-8859-1", errors="replace"), file=sys.stderr)

    sock = socket.create_connection((parts.hostname, port), timeout=timeout)
    try:
        if secure:
            context = ssl.create_default_context()
            if insecure:
                context.check_hostname = False
                context.verify_mode = ssl.CERT_NONE
            sock = context.wrap_socket(sock, server_hostname=parts.hostname)
            if verbose:
                print(f"* TLS: {sock.version()}", file=sys.stderr)
        sock.sendall(packet)
        chunks = []
        while True:
            chunk = sock.recv(65536)
            if not chunk:
                break
            chunks.append(chunk)
    finally:
        sock.close()

    status, response_headers, response_body = parse_response(b"".join(chunks))
    if verbose:
        print("< " + status, file=sys.stderr)
        for key, value in response_headers:
            print(f"< {key}: {value}", file=sys.stderr)
    return status, response_headers, response_body


def main():
    parser = argparse.ArgumentParser(description="A tiny curl-like HTTP/1.1 client using raw TCP/TLS sockets")
    parser.add_argument("url", help="HTTP or HTTPS URL")
    parser.add_argument("-X", "--request", dest="method", help="HTTP method")
    parser.add_argument("-H", "--header", action="append", default=[], type=parse_header, help="custom header: 'Name: value'")
    parser.add_argument("-d", "--data", help="request body")
    parser.add_argument("-i", "--include", action="store_true", help="include response status and headers")
    parser.add_argument("-v", "--verbose", action="store_true", help="show request/connection details on stderr")
    parser.add_argument("-k", "--insecure", action="store_true", help="skip TLS certificate verification")
    parser.add_argument("--timeout", type=float, default=10, help="connection timeout in seconds")
    args = parser.parse_args()

    method = args.method or ("POST" if args.data is not None else "GET")
    try:
        status, headers, body = request(args.url, method, args.header, args.data, args.timeout, args.insecure, args.verbose)
        if args.include:
            print(status)
            for key, value in headers:
                print(f"{key}: {value}")
            print()
        sys.stdout.buffer.write(body)
        if body and not body.endswith(b"\n"):
            print()
    except (OSError, ssl.SSLError, ValueError) as exc:
        print(f"jcurl: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
