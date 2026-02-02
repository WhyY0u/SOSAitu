import type { User } from "@/domain/entities/user/User";

export interface UserRepository {
  getMe(): Promise<User>;
  setNameAndTypes(name: string, groups: string[]): Promise<void>;
  getAllGroups(): Promise<string[]>;
}