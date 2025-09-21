#!/bin/bash
set -euo pipefail

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<'EOSQL'
DO $$
BEGIN
  IF current_setting('is_superuser', true) IS NOT NULL THEN
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'DATABASE_USERNAME') THEN
    EXECUTE format('CREATE ROLE %I LOGIN PASSWORD %L', :'DATABASE_USERNAME', :'DATABASE_PASSWORD');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'DATABASE_NAME') THEN
    EXECUTE format('CREATE DATABASE %I OWNER %I', :'DATABASE_NAME', :'DATABASE_USERNAME');
  END IF;
END $$;
EOSQL
