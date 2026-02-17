export const UserRoles = {
  Owner: "ROLE_OWNER",
  Supervisor: "ROLE_SUPERVISOR",
  RegionAdministrator: "ROLE_REGION_ADMINISTRATOR",
  CityAdministrator: "ROLE_CITY_ADMINISTRATOR",
  Support: "ROLE_SUPPORT",
  User: "ROLE_USER",
} as const;

export type UserRole = typeof UserRoles[keyof typeof UserRoles];

export type User = {
  readonly id: number;
  readonly fullName: string | null;
  readonly telegramId: string;
  readonly chatID: string;
  readonly banned: boolean;
  readonly role: UserRole;
};
