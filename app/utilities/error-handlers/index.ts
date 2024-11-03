import { NULL_UUID } from "@/utilities/index";
export type EnhancedErrorOptions = {
  errorCode: string;
  message: string;
};
export type EnhancedErrorResponse = {
  hasPermission(): void;
  checkPermission(): void;
};
export type ErrorResponse = {
  status: number;
  statusText: string;
};

export class PermissionDenied extends Error {
  constructor(init: EnhancedErrorOptions) {
    super("The user did not have permission to do that");
    Object.assign(this, init);
  }
}

export class UserDoesNotExist extends Error {
  constructor(init: EnhancedErrorOptions) {
    super("The requested user does not exist.");
    Object.assign(this, init);
  }
}
export class UserRegistrationFailed extends Error {
  constructor(init: EnhancedErrorOptions) {
    super("");
    Object.assign(this, init);
  }
}
export class UserExists extends Error {
  constructor(init: EnhancedErrorOptions) {
    super("");
    Object.assign(this, init);
  }
}

export class LoginConflict extends Error {
  constructor(init: EnhancedErrorOptions) {
    super("");
    Object.assign(this, init);
  }
}

export class NoClientSession extends Error {
  constructor(init: EnhancedErrorOptions) {
    super("");
    Object.assign(this, init);
  }
}
export class InvalidIdParameter extends Error {
  constructor(init: EnhancedErrorOptions) {
    super(`The id given was null: ${NULL_UUID}. Please provide an appropriate uuid.`);
    Object.assign(this, init);
  }
}

export class NoModificationAllowedError extends Response {
  constructor(init: EnhancedErrorOptions) {
    super("");
    Object.assign(this, init);
  }
}
export class TimeoutError extends Response {
  constructor(init: EnhancedErrorOptions) {
    super("");
    Object.assign(this, init);
  }
}

export class QuotaExceededError extends Response {
  constructor(init: EnhancedErrorOptions) {
    super("");
    Object.assign(this, init);
  }
}
export class NotAllowedError extends Response {
  constructor(init: EnhancedErrorOptions) {
    super("");
    Object.assign(this, init);
  }
}

export class RateLimitExceededError extends Response {
  constructor() {
    const body = {
      error: "rate_limit_exceeded",
      message: "You have exceeded the maximum number of requests. Please try again later.",
    };
    super(JSON.stringify(body), { status: 429, statusText: "Too Many Requests" });
    this.headers.append("Retry-After", "");
  }
}
