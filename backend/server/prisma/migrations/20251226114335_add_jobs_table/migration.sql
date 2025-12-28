-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "salary_min" INTEGER,
    "salary_max" INTEGER,
    "salary_currency" TEXT NOT NULL DEFAULT 'PKR',
    "description" TEXT NOT NULL,
    "requirements" JSONB NOT NULL,
    "application_steps" JSONB NOT NULL,
    "skills" JSONB NOT NULL,
    "benefits" JSONB NOT NULL,
    "posted_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicants" INTEGER NOT NULL DEFAULT 0,
    "remote" BOOLEAN NOT NULL DEFAULT false,
    "industry" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "jobs_location_idx" ON "jobs"("location");

-- CreateIndex
CREATE INDEX "jobs_type_idx" ON "jobs"("type");

-- CreateIndex
CREATE INDEX "jobs_industry_idx" ON "jobs"("industry");

-- CreateIndex
CREATE INDEX "jobs_experience_idx" ON "jobs"("experience");

-- CreateIndex
CREATE INDEX "jobs_remote_idx" ON "jobs"("remote");
