import { UserRoles, type User } from "@/domain/entities/user/User";
import type { UserRepository } from "@/domain/repositories/user/UserRepository";

export default class InMemoryUserApiRepository implements UserRepository {

  private fakeUser: User = {
    id: "1992381",
    fullname: "Иванов Иван",
    groupsId: [1, 2],
    role: UserRoles.Administrator
  };
  async getMe(): Promise<User> {
    return this.fakeUser;
  }
  async register(user: User): Promise<void> {
    console.log("Фейковая регистрация:", user);
  }

  async findUserByID(id: string): Promise<User | null> {
    if (id === this.fakeUser.id) return this.fakeUser;
    return null;
  }
}