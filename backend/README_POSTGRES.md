# InvestAqary Backend Setup

## Stack

- Laravel 12
- PostgreSQL
- Laravel Sanctum for API auth

## PostgreSQL config

1. Create a PostgreSQL database, for example `investaqary_db`.
2. Copy `.env.example` to `.env`.
3. Fill the PostgreSQL credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=investaqary_db
DB_USERNAME=postgres
DB_PASSWORD=password
```

## Run backend

```bash
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

## API base URL

Frontend expects:

```env
http://localhost:8000/api
```

## Notes

- Main API routes are in `routes/api.php`.
- Models are in `app/Models`.
- Feature tests are in `tests/Feature`.
