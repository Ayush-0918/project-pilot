-- Migration: add_user_deleted_at
-- Adds a nullable 'deletedAt' timestamp to the User table to support
-- soft-deletion with a 30-day recovery window.

ALTER TABLE "User" ADD COLUMN "deletedAt" TIMESTAMP(3);