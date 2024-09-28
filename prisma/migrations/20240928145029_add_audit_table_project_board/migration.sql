/*
  Warnings:

  - Added the required column `updatedAt` to the `BoardTask` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BoardTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "boardId" TEXT NOT NULL,
    CONSTRAINT "BoardTask_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "ProjectBoard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BoardTask" ("boardId", "description", "id", "isDone", "title") SELECT "boardId", "description", "id", "isDone", "title" FROM "BoardTask";
DROP TABLE "BoardTask";
ALTER TABLE "new_BoardTask" RENAME TO "BoardTask";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
