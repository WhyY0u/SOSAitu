import type { User } from "@/domain/entities/user/User";

export interface UserRepository {
  getMe(): Promise<User>;
  findUserByID(id: string) : Promise<User | null>;
  register(user: User): Promise<void>;
}