-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "participantName" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "completionDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);
