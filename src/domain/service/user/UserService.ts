import { type User } from "../../entities/user/User";

export function isInGroup(user: User, groupId: number): boolean {
  return user.groupsId.includes(groupId);
}

export function addToGroup(user: User, groupId: number): User {
  if (user.groupsId.includes(groupId)) return user;
  return {
    ...user,
    groupsId: [...user.groupsId, groupId]
  };
}
