import apiClient from "@/data/datasources/api/apiClient";
import { type User } from "@/domain/entities/user/User";
import type { UserRepository } from "@/domain/repositories/user/UserRepository";

export default class UserApiRepository implements UserRepository {
 
  async setNameAndTypes(name: string, groups: string[]): Promise<void> {
    return apiClient.post('/auth/setname', { name, groups });
  }

  async getAllGroups(): Promise<string[]> {
    return (await apiClient.get('/auth/groups')).data;
  }

  async getMe(): Promise<User> {
    return (await apiClient.get('/auth/me')).data
  }
}
