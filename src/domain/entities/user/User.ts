export const UserRoles = {
  Owner: "Владелец",
  Administrator: "Менеджер",
  User: "Пользватель",
} as const;

export type UserRole = typeof UserRoles[keyof typeof UserRoles];

export type User = {
  readonly id: string;
  readonly fullname: string;
  readonly groupsId: number[];
  readonly role: UserRole;
};
