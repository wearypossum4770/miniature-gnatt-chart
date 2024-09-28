-- CreateTable
CREATE TABLE "BoardTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "boardId" TEXT NOT NULL,
    CONSTRAINT "BoardTask_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "ProjectBoard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
