-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TypePerson" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusApplication" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RoleComission" AS ENUM ('REVIEWER', 'COORDINATOR');

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person" (
    "id" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "career" TEXT NOT NULL,
    "faculty" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "telephone_number" TEXT NOT NULL,
    "type" "TypePerson" NOT NULL,
    "status" "Status" NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "id_person" TEXT NOT NULL,
    "id_role" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu" (
    "id" TEXT NOT NULL,
    "id_role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submenu" (
    "id" TEXT NOT NULL,
    "id_menu" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "submenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "period" (
    "id" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "available_load" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upload_data" (
    "id" TEXT NOT NULL,
    "id_period" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "student" TEXT NOT NULL,
    "option" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "statusApplication" "StatusApplication" NOT NULL,
    "practicesValidities" TEXT NOT NULL,
    "viculationValidities" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "upload_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_header" (
    "id" TEXT NOT NULL,
    "id_period" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_obtain" TEXT NOT NULL,
    "modality" TEXT NOT NULL,
    "research_line" TEXT NOT NULL,
    "resarch_subline" TEXT NOT NULL,
    "option" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "statusApplication" "StatusApplication" NOT NULL,
    "practicesValidities" TEXT NOT NULL,
    "viculationValidities" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "proposal_header_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_detail" (
    "id" TEXT NOT NULL,
    "id_proposal" TEXT NOT NULL,
    "id_person" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "proposal_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comission_header" (
    "id" TEXT NOT NULL,
    "id_period" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "comission_header_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comission_detail" (
    "id" TEXT NOT NULL,
    "id_comission" TEXT NOT NULL,
    "id_person" TEXT NOT NULL,
    "role_comission" "RoleComission" NOT NULL,
    "status" "Status" NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "comission_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "id_comision_member" TEXT NOT NULL,
    "id_proposal" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "create_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_document_key" ON "person"("document");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_person_fkey" FOREIGN KEY ("id_person") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu" ADD CONSTRAINT "menu_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submenu" ADD CONSTRAINT "submenu_id_menu_fkey" FOREIGN KEY ("id_menu") REFERENCES "menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upload_data" ADD CONSTRAINT "upload_data_id_period_fkey" FOREIGN KEY ("id_period") REFERENCES "period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_header" ADD CONSTRAINT "proposal_header_id_period_fkey" FOREIGN KEY ("id_period") REFERENCES "period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_detail" ADD CONSTRAINT "proposal_detail_id_proposal_fkey" FOREIGN KEY ("id_proposal") REFERENCES "proposal_header"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_detail" ADD CONSTRAINT "proposal_detail_id_person_fkey" FOREIGN KEY ("id_person") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comission_header" ADD CONSTRAINT "comission_header_id_period_fkey" FOREIGN KEY ("id_period") REFERENCES "period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comission_detail" ADD CONSTRAINT "comission_detail_id_comission_fkey" FOREIGN KEY ("id_comission") REFERENCES "comission_header"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comission_detail" ADD CONSTRAINT "comission_detail_id_person_fkey" FOREIGN KEY ("id_person") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_id_comision_member_fkey" FOREIGN KEY ("id_comision_member") REFERENCES "comission_detail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_id_proposal_fkey" FOREIGN KEY ("id_proposal") REFERENCES "proposal_header"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
