export enum ProjectStatus {
  NoStatus = "none",
  Draft = "draft",
  InProgress = "in_progress",
  Stuck = "stuck",
  Done = "done",
  Complete = "complete",
  NotStarted = "not_started",
  Cancelled = "cancelled",
}
export enum TaskPriority {
  Low = "low",
  High = "high",
  Medium = "medium",
  Critical = "critical",
}
// 7454710131
export type ProjectBoard = {
  id: string;
  key: number;
};
export type Project = {
  id: string;
  progress: number;
  title: string;
  boards?: ProjectBoard[];
  dateArchived?: null | Date | string | number;
  dateDeleted?: null | Date | string | number;
  priority?: TaskPriority;
  dateStarting?: Date | string | number;
  dateEnding?: Date | string | number;
  dateDue?: Date | string | number;
  documentOwner: number;
  status: ProjectStatus | string;
  documentId: number;
};

export const handleProjectStatus = ({ status }: Project) => {
  switch (status) {
    case "complete":
      return ProjectStatus.Complete;
    case "draft":
      return ProjectStatus.Draft;
    case "in_progress":
      return ProjectStatus.InProgress;
    case "not_started":
      return ProjectStatus.NotStarted;
    default:
      return ProjectStatus.NoStatus;
  }
};
export const canAccess = async () => {};
export const humanizeProjectStatus = (status: string) => {
  switch (status) {
    case "complete":
      return "Complete";
    case "on_hold":
      return "On Hold";
    case "draft":
      return "Draft";
    case "in_progress":
      return "In Progress";
    case "stuck":
      return "Stuck";
    case "done":
      return "Done";
    case "not_started":
      return "Not Started";
    case "cancelled":
      return "Cancelled";
    default:
      return "None";
  }
};

const statusCache = [
  ...new Set(["none", "complete", "on_hold", "draft", "in_progress", "stuck", "done", "not_started", "cancelled"]),
];
export const randomStatus = () => statusCache.at(Math.floor(Math.random() * statusCache.length)) ?? "";

export const transformFormData = (form: FormData) => Object.fromEntries(form.entries());

export const queryFormData = <T, K extends keyof T = keyof T>(target: T, key: K) => target[key];

export const queryForm = <T extends string>(formData: FormData, key: string): T | string => {
  const prop = formData.get(key);
  return typeof prop === "string" ? (prop as T) : "";
};
export const extractFormData = <T extends object>(form: FormData, keys: string[]): Record<string, string | T> =>
  keys.reduce((obj, key) => {
    const prop = form.get(key);
    return typeof prop === "string" ? Object.assign(obj, { [key]: key }) : obj;
  }, {});

export const handleErrors = () => {};

const isUnicodeSupported = (): boolean => false;
export const info = isUnicodeSupported() ? "ℹ" : "i";
export const success = isUnicodeSupported() ? "✔" : "√";
export const warning = isUnicodeSupported() ? "⚠" : "‼";
export const error = isUnicodeSupported() ? "✖️" : "×";
