import type { NavigateFunction } from "@remix-run/react";
import type { KeyboardEvent, MouseEvent, SyntheticEvent } from "react";

export type RowSelection =
  | SyntheticEvent<HTMLTableSectionElement>
  | KeyboardEvent<HTMLTableSectionElement>
  | MouseEvent<HTMLTableSectionElement>;
export const extractRowId = (target: HTMLTableSectionElement) => {
  const { closest } = target;
  const row = closest.call(target, "tr");
  return row ? row.id : "";
};
export const handleNavigation = (event: RowSelection, callback: CallableFunction) =>
  callback(extractRowId(event.target as HTMLTableSectionElement));

export const assertKeyboardEvent = (event: unknown): event is KeyboardEvent =>
  event !== null && event instanceof KeyboardEvent;

export const assertMouseEvent = (event: unknown): event is MouseEvent => event !== null && event instanceof MouseEvent;

export const mouseClickRowSelection = (event: MouseEvent<HTMLTableSectionElement>, callback: CallableFunction) =>
  handleNavigation(event, callback);

export const keydownRowSelection = (event: KeyboardEvent<HTMLTableSectionElement>, callback: CallableFunction) => {
  const { code } = event;
  switch (code) {
    case "Enter":
    case "NumpadEnter":
      return handleNavigation(event, callback);
    default:
      return null;
  }
};

export const delegateEventHandler = (event: RowSelection, callback: NavigateFunction) => {
  if (assertKeyboardEvent(event)) return keydownRowSelection(event, callback);
  if (assertMouseEvent(event)) return mouseClickRowSelection(event, callback);
  return handleNavigation(event, callback);
};

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

export const rejectWheelInputMutation = ({ target }: SyntheticEvent<HTMLFormElement>) => {
  const { blur, type } = target as HTMLInputElement;
  if (/number/i.test(type)) return blur.call(target);
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
