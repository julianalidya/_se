import unittest
from jcurl import build_request, decode_chunked, parse_response


class JCurlTests(unittest.TestCase):
    def test_build_get(self):
        req = build_request("GET", "/hello?q=1", "example.com", [], b"")
        self.assertTrue(req.startswith(b"GET /hello?q=1 HTTP/1.1\r\n"))
        self.assertIn(b"Host: example.com\r\n", req)

    def test_decode_chunked(self):
        raw = b"4\r\nWiki\r\n5\r\npedia\r\n0\r\n\r\n"
        self.assertEqual(decode_chunked(raw), b"Wikipedia")

    def test_parse_content_length_response(self):
        raw = b"HTTP/1.1 200 OK\r\nContent-Length: 5\r\n\r\nhello"
        status, headers, body = parse_response(raw)
        self.assertEqual(status, "HTTP/1.1 200 OK")
        self.assertEqual(body, b"hello")

    def test_parse_chunked_response(self):
        raw = b"HTTP/1.1 200 OK\r\nTransfer-Encoding: chunked\r\n\r\n5\r\nhello\r\n0\r\n\r\n"
        _, _, body = parse_response(raw)
        self.assertEqual(body, b"hello")


if __name__ == "__main__":
    unittest.main()
