import json
import re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import psycopg
from psycopg.rows import dict_row


def connect():
    return psycopg.connect(connect_timeout=5, row_factory=dict_row)


def initialize():
    with connect() as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(120) NOT NULL,
            course VARCHAR(60) NOT NULL DEFAULT '',
            done BOOLEAN NOT NULL DEFAULT FALSE
        )""")


class Handler(BaseHTTPRequestHandler):
    def send_json(self, status, value):
        body = json.dumps(value, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def handle_api(self):
        try:
            path = self.path.split('?')[0]
            method = self.command
            if path == '/api/health' and method == 'GET':
                with connect() as conn:
                    conn.execute('SELECT 1')
                return self.send_json(200, {'status': 'ok', 'database': 'connected'})
            if path == '/api/tasks' and method == 'GET':
                with connect() as conn:
                    rows = conn.execute('SELECT * FROM tasks ORDER BY id DESC').fetchall()
                return self.send_json(200, rows)
            match = re.fullmatch(r'/api/tasks/([1-9][0-9]*)', path)
            if (path == '/api/tasks' and method == 'POST') or (match and method == 'PATCH'):
                length = int(self.headers.get('Content-Length', '0'))
                if not 0 < length <= 4096:
                    return self.send_json(400, {'error': '請提供有效的任務資料'})
                data = json.loads(self.rfile.read(length))
                if not isinstance(data, dict):
                    raise ValueError('Invalid object')
                if method == 'POST':
                    title, course = data.get('title'), data.get('course', '')
                    if not isinstance(title, str) or not 1 <= len(title.strip()) <= 120:
                        return self.send_json(400, {'error': '任務名稱需為 1–120 字'})
                    if not isinstance(course, str) or len(course.strip()) > 60:
                        return self.send_json(400, {'error': '課程名稱最多 60 字'})
                    with connect() as conn:
                        row = conn.execute('INSERT INTO tasks(title,course) VALUES (%s,%s) RETURNING *', (title.strip(), course.strip())).fetchone()
                    return self.send_json(201, row)
                if type(data.get('done')) is not bool:
                    return self.send_json(400, {'error': 'done 必須是布林值'})
                with connect() as conn:
                    row = conn.execute('UPDATE tasks SET done=%s WHERE id=%s RETURNING *', (data['done'], int(match[1]))).fetchone()
                return self.send_json(200 if row else 404, row or {'error': '找不到任務'})
            if match and method == 'DELETE':
                with connect() as conn:
                    row = conn.execute('DELETE FROM tasks WHERE id=%s RETURNING id', (int(match[1]),)).fetchone()
                return self.send_json(200 if row else 404, row or {'error': '找不到任務'})
            self.send_json(404, {'error': '找不到此路徑'})
        except (ValueError, UnicodeDecodeError):
            self.send_json(400, {'error': '資料格式錯誤'})
        except psycopg.Error:
            self.send_json(503, {'error': '資料庫暫時無法連線，請稍後重試'})

    do_GET = handle_api
    do_POST = handle_api
    do_PATCH = handle_api
    do_DELETE = handle_api


if __name__ == '__main__':
    initialize()
    ThreadingHTTPServer(('0.0.0.0', 8000), Handler).serve_forever()
