import projects from "@/fixtures/project-all.json";
import users from "@/fixtures/users.json";
import { prisma } from "~/db.server";

export const generateUserSeeds = () =>
  Promise.allSettled(
    users.map(
      ({
        firstName,
        id,
        middleName,
        lastName,
        email,
        username,
      }: {
        firstName: string;
        id: string;
        middleName: string | null;
        lastName: string;
        email: string;
        username: string;
      }) =>
        prisma.user.upsert({
          where: { id },
          update: {
            firstName,
            middleName,
            lastName,
            email,
            username,
          },
          create: {
            id,
            firstName,
            middleName,
            lastName,
            email,
            username,
            projects: {
              createMany: {
                data: projects.map(
                  ({ progress, title, dateArchived, dateDeleted, dateStarting, dateEnding, status, documentId }) => ({
                    progress,
                    title,
                    dateArchived,
                    dateDeleted,
                    dateStarting,
                    dateEnding,
                    status,
                    documentId,
                  }),
                ),
              },
            },
          },
        }),
    ),
  );

export const status = [
  { label: "Ready to Start", slug: "start_ready" },
  { label: "Waiting for Review", slug: "review_needed" },
  { label: "Pending Deploy", slug: "pending_deployment" },
  { label: "Done", slug: "done" },
  { label: "Complete", slug: "complete" },
  { label: "Stuck", slug: "stuck" },
  { label: "In Progress", slug: "in_progress" },
  { label: "Missing Info", slug: "info_needed" },
  { label: "Fixed", slug: "fixed" },
  { label: "Ready for Development", slug: "dev_ready" },
  { label: "Duplicate", slug: "dupe" },
  { label: "Known Bug", slug: "known_bug" },
];

export const priority = [
  { label: "Medium", slug: "medium" },
  { label: "Critical", slug: "critical" },
  { label: "High", slug: "high" },
  { label: "Low", slug: "low" },
  { label: "Best Effort", slug: "best_effort" },
  { label: "Missing", slug: "missing" },
];
export const category = [
  { label: "Quality Assurance", slug: "qa" },
  { label: "Feature", slug: "feature" },
  { label: "Bug", slug: "bug" },
  { label: "Test", slug: "test" },
  { label: "Security", slug: "security" },
];

export type AuthenticationMechanism = {
  onAuthFailedRedirectTo: string;
};
export enum AuthenticationMethod {
  UsernamePassword = 0,
  Token = 1,
}
export type BasicAuthentication = AuthenticationMechanism & {
  methods: AuthenticationMethod[];
};
