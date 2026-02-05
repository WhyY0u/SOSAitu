export const UserRoles = {
  Owner: "ROLE_OWNER",
  Administrator: "ROLE_ADMINISTATOR",
  User: "ROLE_USER",
} as const;

export type UserRole = typeof UserRoles[keyof typeof UserRoles];

export type User = {
  readonly id: number;
  readonly fullName: string | null;
  readonly telegramId: string;
  readonly chatID: string;
  readonly banned: boolean;
  readonly groups: string[];
  readonly role: UserRole;
};
