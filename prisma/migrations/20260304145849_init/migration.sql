-- CreateTable
CREATE TABLE "MOM_MeetingType" (
    "MeetingTypeID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "MeetingTypeName" TEXT NOT NULL,
    "Remarks" TEXT,
    "Created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MOM_Staff" (
    "StaffID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "StaffName" TEXT NOT NULL,
    "MobileNo" TEXT,
    "EmailAddress" TEXT,
    "Password" TEXT,
    "Role" TEXT NOT NULL DEFAULT 'STAFF',
    "Remarks" TEXT,
    "Created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MOM_Meetings" (
    "MeetingID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "MeetingTitle" TEXT NOT NULL,
    "MeetingDescription" TEXT,
    "MeetingDate" DATETIME NOT NULL,
    "MeetingTime" TEXT NOT NULL,
    "MeetingTypeID" INTEGER NOT NULL,
    "DocumentPath" TEXT,
    "Remarks" TEXT,
    "IsCancelled" BOOLEAN NOT NULL DEFAULT false,
    "CancellationDateTime" DATETIME,
    "CancellationReason" TEXT,
    "Created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" DATETIME NOT NULL,
    CONSTRAINT "MOM_Meetings_MeetingTypeID_fkey" FOREIGN KEY ("MeetingTypeID") REFERENCES "MOM_MeetingType" ("MeetingTypeID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MOM_MeetingMember" (
    "MeetingMemberID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "MeetingID" INTEGER NOT NULL,
    "StaffID" INTEGER NOT NULL,
    "IsPresent" BOOLEAN NOT NULL DEFAULT false,
    "Remarks" TEXT,
    "Created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" DATETIME NOT NULL,
    CONSTRAINT "MOM_MeetingMember_MeetingID_fkey" FOREIGN KEY ("MeetingID") REFERENCES "MOM_Meetings" ("MeetingID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MOM_MeetingMember_StaffID_fkey" FOREIGN KEY ("StaffID") REFERENCES "MOM_Staff" ("StaffID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MOM_MeetingDocument" (
    "MeetingDocumentID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "MeetingID" INTEGER NOT NULL,
    "DocumentName" TEXT NOT NULL,
    "DocumentPath" TEXT,
    "Sequence" INTEGER,
    "Remarks" TEXT,
    "Created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Modified" DATETIME NOT NULL,
    CONSTRAINT "MOM_MeetingDocument_MeetingID_fkey" FOREIGN KEY ("MeetingID") REFERENCES "MOM_Meetings" ("MeetingID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MOM_Staff_EmailAddress_key" ON "MOM_Staff"("EmailAddress");
