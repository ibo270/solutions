Quick start:

1) Create venv and install deps
   python -m venv venv
   # Windows: venv\Scripts\Activate.ps1 ; Linux/mac: source venv/bin/activate
   pip install -r requirements.txt

2) Create .env (copy from .env.example)
   cp .env.example .env

3) Migrate & create superuser
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser

4) Load demo data (optional)
   python manage.py loaddata fixtures_demo.json

5) Run
   python manage.py runserver

Endpoints:
- POST /api/auth/register
- POST /api/auth/token
- GET  /api/flights/search?origin=&destination=&company__code=&departure_at__date=YYYY-MM-DD
- GET  /api/flights/<id>
- POST /api/tickets {"flight_id": <id>}
- GET  /api/tickets/my
- POST /api/tickets/<id>/cancel
- GET  /api/content/banners
- GET  /api/content/offers
