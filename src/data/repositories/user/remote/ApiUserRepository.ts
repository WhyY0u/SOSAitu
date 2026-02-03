import apiClient from "@/data/datasources/api/apiClient";
import { type User } from "@/domain/entities/user/User";
import type { AddAdministratorRequest, AdminPerformanceDto, Administrator, StatsResponse, UserRepository } from "@/domain/repositories/user/UserRepository";

export default class UserApiRepository implements UserRepository {
  async getAdministrators(): Promise<Administrator[]> {
    return (await apiClient.get("/owner/administator")).data;
  }

  async addAdministrator(request: AddAdministratorRequest): Promise<Administrator> {
    return (await apiClient.post("/owner/addAdministator", request)).data;
  }

  async deleteAdministrator(request: AddAdministratorRequest): Promise<string> {
    return (await apiClient.post("/owner/deleteAdministator", request)).data;
  }

  async getAdminPerformance(): Promise<AdminPerformanceDto[]> {
    return (await apiClient.get('/owner/admin-performance')).data;
  }

 async ownerStats(): Promise<StatsResponse> {
  return (await apiClient.get('/owner/stats')).data;
}
 
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
