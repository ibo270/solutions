#!/usr/bin/env bash
set -euo pipefail

echo "[entrypoint] DJANGO_SETTINGS_MODULE=${DJANGO_SETTINGS_MODULE:-config.settings}"
echo "[entrypoint] DATABASE_URL=${DATABASE_URL:-<empty>}"

# Подождать Postgres, если используем его
if [[ "${DATABASE_URL:-}" == postgres* || "${DATABASE_URL:-}" == postgresql* ]]; then
  echo "[entrypoint] Waiting for Postgres..."
  python - <<'PY'
import os,time,sys
try:
    import psycopg2
    from urllib.parse import urlparse
except Exception as e:
    print("psycopg2 not installed? ->", e)
    sys.exit(1)

url = os.environ["DATABASE_URL"]
if url.startswith("postgres://"):
    url = "postgresql://" + url[len("postgres://"):]
p = urlparse(url)
for i in range(60):
    try:
        conn = psycopg2.connect(
            dbname=p.path[1:], user=p.username, password=p.password,
            host=p.hostname, port=p.port or 5432, connect_timeout=2
        )
        conn.close()
        print("[entrypoint] DB is up")
        break
    except Exception as e:
        print("[entrypoint] DB not ready:", e)
        time.sleep(2)
else:
    raise SystemExit("[entrypoint] DB wait timeout")
PY
fi

python manage.py migrate --noinput
python manage.py collectstatic --noinput || true

# Более разговорчивые логи gunicorn
exec gunicorn config.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers ${GUNICORN_WORKERS:-3} \
  --access-logfile - \
  --error-logfile -
