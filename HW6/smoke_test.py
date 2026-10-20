"""Run against the real Compose stack. Requires only Python standard library."""
import json
import sys
import urllib.request
import urllib.error

base = (sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8080').rstrip('/')

def request(method, path, data=None):
    body = json.dumps(data).encode() if data is not None else None
    req = urllib.request.Request(base + '/api/' + path, data=body, method=method,
                                 headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=15) as res:
        return res.status, json.load(res)

status, health = request('GET', 'health')
assert status == 200 and health['database'] == 'connected'
with urllib.request.urlopen(base + '/', timeout=15) as res:
    assert 'UniMate' in res.read().decode()
task_id = None
try:
    status, task = request('POST', 'tasks', {'title':'HW6 smoke test 測試', 'course':'Docker'})
    assert status == 201
    task_id = task['id']
    assert any(t['id'] == task_id for t in request('GET', 'tasks')[1])
    assert request('PATCH', f'tasks/{task_id}', {'done':True})[1]['done'] is True
    try:
        request('POST', 'tasks', {'title':'   '})
        raise AssertionError('Blank title should fail')
    except urllib.error.HTTPError as error:
        assert error.code == 400
    request('DELETE', f'tasks/{task_id}')
    assert all(t['id'] != task_id for t in request('GET', 'tasks')[1])
    task_id = None
    print('PASS: web, database health, create, list, update, validation, delete')
finally:
    if task_id is not None:
        request('DELETE', f'tasks/{task_id}')
