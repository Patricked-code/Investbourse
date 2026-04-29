export type UserRole = "USER" | "ADMIN" | "SUPERADMIN";
export type UserStatus = "PENDING_VERIFICATION" | "ACTIVE" | "DISABLED";

export type ContactRequestStatus = "NEW" | "QUALIFIED" | "IN_PROGRESS" | "CLOSED";

export type User = {
  id: string;
  fullName: string;
  organization?: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt?: string;
};

export type ContactRequest = {
  id: string;
  fullName: string;
  organization: string;
  email: string;
  requestType: string;
  message: string;
  status: ContactRequestStatus;
  assignedToUserId?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export type SeoPage = {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  schemaType: string;
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  keywords: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type AuditLog = {
  id: string;
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type ApiSuccess<T> = {
  ok: true;
  data: T;
  message?: string;
};

export type ApiFailure = {
  ok: false;
  error: string;
  details?: unknown;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
