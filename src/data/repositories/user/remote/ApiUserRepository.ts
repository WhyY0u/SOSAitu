import apiClient from "@/data/datasources/api/apiClient";
import { UserRoles, type User } from "@/domain/entities/user/User";
import type { UserRepository } from "@/domain/repositories/user/UserRepository";

export default class UserApiRepository implements UserRepository {
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
    apiClient.post('/auth/init', )
 }

  async findUserByID(id: string): Promise<User | null> {
    return null;
  }
}
