-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ARTIST', 'CLIENT');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('REQUEST', 'FRAMING', 'QUOTE_SENT', 'QUOTE_ACCEPTED', 'AWAITING_DEPOSIT', 'CREATION', 'SESSION_DONE', 'COMPLETED', 'ARCHIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PROPOSED', 'CONFIRMED', 'DONE', 'RESCHEDULED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SketchStatus" AS ENUM ('DRAFT', 'REVISION', 'CURRENT', 'VALIDATED');

-- CreateEnum
CREATE TYPE "ReferenceSource" AS ENUM ('CLIENT', 'ARTIST');

-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('MON_AM', 'MON_PM', 'TUE_AM', 'TUE_PM', 'WED_AM', 'WED_PM', 'THU_AM', 'THU_PM', 'FRI_AM', 'FRI_PM', 'SAT_AM', 'SAT_PM', 'SUN_AM', 'SUN_PM');

-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "default_sketch_sharing" BOOLEAN NOT NULL DEFAULT true,
    "aftercare_advice" TEXT,
    "prep_advice" TEXT,
    "bio" TEXT,
    "city" VARCHAR(100),
    "address" VARCHAR(255),
    "portrait" VARCHAR(255),
    "working_slots" "Availability"[] DEFAULT ARRAY[]::"Availability"[],
    "account_id" INTEGER NOT NULL,
    "studio_id" INTEGER,

    CONSTRAINT "artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studio" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "address" VARCHAR(255),

    CONSTRAINT "studio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'REQUEST',
    "body_area" VARCHAR(100) NOT NULL,
    "size" VARCHAR(50),
    "client_budget_min" DECIMAL(8,2),
    "client_budget_max" DECIMAL(8,2),
    "client_note" TEXT NOT NULL,
    "client_availability" "Availability"[] DEFAULT ARRAY[]::"Availability"[],
    "client_flexible_schedule" BOOLEAN NOT NULL DEFAULT false,
    "internal_note" TEXT,
    "sketch_sharing" BOOLEAN,
    "deposit_received_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prospect_first_name" VARCHAR(100) NOT NULL,
    "prospect_last_name" VARCHAR(100) NOT NULL,
    "prospect_email" VARCHAR(255) NOT NULL,
    "invite_token_hash" VARCHAR(255),
    "invite_expires_at" TIMESTAMP(3),
    "artist_id" INTEGER NOT NULL,
    "client_id" INTEGER,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote" (
    "id" SERIAL NOT NULL,
    "total_amount" DECIMAL(8,2) NOT NULL,
    "deposit_amount" DECIMAL(8,2),
    "description" TEXT,
    "status" "QuoteStatus" NOT NULL DEFAULT 'DRAFT',
    "justification" TEXT,
    "valid_until" DATE NOT NULL,
    "responded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "location" VARCHAR(255),
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PROPOSED',
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sketch" (
    "id" SERIAL NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "SketchStatus" NOT NULL DEFAULT 'DRAFT',
    "original_file" VARCHAR(255) NOT NULL,
    "preview" VARCHAR(255),
    "validated_at" TIMESTAMP(3),
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "sketch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference" (
    "id" SERIAL NOT NULL,
    "file" VARCHAR(255) NOT NULL,
    "source" "ReferenceSource" NOT NULL,
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "request_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sketch_comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sketch_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "sketch_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_tag" (
    "project_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "project_tag_pkey" PRIMARY KEY ("project_id","tag_id")
);

-- CreateTable
CREATE TABLE "artist_tag" (
    "artist_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "artist_tag_pkey" PRIMARY KEY ("artist_id","tag_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_email_key" ON "account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "artist_username_key" ON "artist"("username");

-- CreateIndex
CREATE UNIQUE INDEX "artist_account_id_key" ON "artist"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_invite_token_hash_key" ON "project"("invite_token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "sketch_project_id_version_key" ON "sketch"("project_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- AddForeignKey
ALTER TABLE "artist" ADD CONSTRAINT "artist_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist" ADD CONSTRAINT "artist_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "studio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote" ADD CONSTRAINT "quote_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sketch" ADD CONSTRAINT "sketch_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reference" ADD CONSTRAINT "reference_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_comment" ADD CONSTRAINT "request_comment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_comment" ADD CONSTRAINT "request_comment_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sketch_comment" ADD CONSTRAINT "sketch_comment_sketch_id_fkey" FOREIGN KEY ("sketch_id") REFERENCES "sketch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sketch_comment" ADD CONSTRAINT "sketch_comment_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tag" ADD CONSTRAINT "project_tag_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tag" ADD CONSTRAINT "project_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_tag" ADD CONSTRAINT "artist_tag_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_tag" ADD CONSTRAINT "artist_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
