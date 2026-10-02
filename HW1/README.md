# jcurl — Modern Software Engineering HW1

**Student:** 林小蓮  
**Student ID:** 111210552  
**Department/Class:** 資工四  

A small `curl`-like HTTP/1.1 command-line client implemented in Python using **raw TCP sockets and TLS**. It intentionally avoids high-level HTTP client libraries such as `requests`, `httpx`, and `urllib.request` so the networking steps remain visible.

## Features

- HTTP and HTTPS
- Raw TCP via `socket`
- TLS via Python `ssl`
- GET/POST/custom HTTP methods
- Custom request headers (`-H`)
- Request body (`-d`)
- Response headers (`-i`)
- Verbose mode (`-v`)
- Chunked transfer decoding
- Gzip response decoding
- TLS certificate verification by default; optional `-k`
- Unit tests with no external dependencies

## Architecture

```text
URL
 ↓
Parse scheme / host / port / path
 ↓
DNS + TCP connection
 ↓
TLS handshake (HTTPS only)
 ↓
Build HTTP/1.1 request bytes
 ↓
Send request / receive byte stream
 ↓
Parse status + headers + body
 ↓
Decode chunked/gzip when required
 ↓
Print response
```

## Requirements

Python 3.9+; no third-party packages are required.

## Usage

```bash
python jcurl.py https://example.com
```

Include status and headers:

```bash
python jcurl.py -i https://example.com
```

Verbose request:

```bash
python jcurl.py -v https://example.com
```

POST data:

```bash
python jcurl.py -X POST -H "Content-Type: application/json" -d '{"name":"Juli"}' https://httpbin.org/post
```

The method automatically becomes POST when `-d` is used unless `-X` is specified.

## Tests

```bash
python -m unittest -v
```

## What I learned

The project shows that an HTTP client is built on several smaller steps: resolving a host, opening a TCP connection, negotiating TLS for HTTPS, formatting an HTTP request with CRLF boundaries, reading a byte stream, and interpreting response framing such as chunked transfer encoding. Implementing these pieces directly makes the behavior normally hidden by high-level HTTP libraries easier to understand.

## Limitations

This is an educational HTTP/1.1 client, not a replacement for production `curl`. It does not currently implement redirects, HTTP/2 or HTTP/3, proxy support, authentication helpers, cookies, multipart uploads, or every possible transfer/content encoding.

## Documentation

A GitHub Pages-ready project page is included in `docs/index.html`.
