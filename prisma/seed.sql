-- Seed admin user
-- Email    : admin@gdsi.my.id
-- Password : Porto@Azhar (plain text — auth.js juga sudah disesuaikan)
-- Jalankan di Supabase SQL Editor

INSERT INTO "User" (id, email, password, name)
VALUES (
  gen_random_uuid()::text,
  'admin@gdsi.my.id',
  'Porto@Azhar',
  'Admin'
)
ON CONFLICT (email) DO UPDATE SET password = 'Porto@Azhar';
