"""Offline Compass launcher. Python 3, standard library only."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser

ROOT = Path(__file__).resolve().parent / 'app'
PORT = 8765
if not (ROOT / 'index.html').exists():
    raise SystemExit('Missing app directory. Extract the whole archive before starting.')
try:
    server = ThreadingHTTPServer(('127.0.0.1', PORT), partial(SimpleHTTPRequestHandler, directory=str(ROOT)))
except OSError:
    raise SystemExit('Port 8765 is already in use. Close the other Compass window/process and retry.')
print(f'Compass is running at http://127.0.0.1:{PORT} — press Ctrl+C to stop.')
webbrowser.open(f'http://127.0.0.1:{PORT}')
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
