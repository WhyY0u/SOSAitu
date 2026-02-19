import apiClient from "@/data/datasources/api/apiClient";
import { type User } from "@/domain/entities/user/User";
import type { AddAdministratorRequest, AdminPerformanceDto, Administrator, StatsResponse, UserRepository, Region, City } from "@/domain/repositories/user/UserRepository";

export default class UserApiRepository implements UserRepository {
  async getAdministrators(): Promise<Administrator[]> {
    return (await apiClient.get('/owner/administrators')).data;
  }

  async addAdministrator(request: AddAdministratorRequest): Promise<Administrator> {
    return (await apiClient.post("/owner/addAdministator", request)).data;
  }

  async deleteAdministrator(request: { userId: number }): Promise<string> {
    return (await apiClient.post('/owner/administrators/delete', request)).data;
  }

  async getAdminPerformance(): Promise<AdminPerformanceDto[]> {
    return (await apiClient.get('/owner/admin-performance')).data;
  }

 async ownerStats(): Promise<StatsResponse> {
  return (await apiClient.get('/owner/stats')).data;
}

  async setName(name: string): Promise<void> {
    return apiClient.post('/auth/setname', { name });
  }

  async getAllGroups(): Promise<string[]> {
    return (await apiClient.get('/auth/groups')).data;
  }

  async getMe(): Promise<User> {
    return (await apiClient.get('/auth/me')).data
  }

  async getOwnerAiInsights(): Promise<string> {
    return (await apiClient.get('/owner/ai-insights')).data;
  }

  async getOwnerMonthlyReport(): Promise<string> {
    return (await apiClient.get('/owner/monthly-report')).data;
  }

  async getAllUsers(): Promise<User[]> {
    return (await apiClient.get('/owner/users')).data;
  }

  async getRegions(): Promise<Region[]> {
    return (await apiClient.get('/owner/regions')).data;
  }

  async getTicketTypes(): Promise<TicketType[]> {
    return (await apiClient.get('/owner/ticket-types')).data;
  }

  async addRegionAdministrator(userId: number, regionId: number): Promise<string> {
    return (await apiClient.post('/owner/add-region-administrator', { userId, regionId })).data;
  }

  async addCityAdministrator(userId: number, regionId: number, cityId: number): Promise<string> {
    return (await apiClient.post('/owner/add-city-administrator', { userId, regionId, cityId })).data;
  }

  async addSupport(userId: number, regionId: number, cityId: number, types: string[]): Promise<string> {
    return (await apiClient.post('/owner/add-support', { userId, regionId, cityId, types })).data;
  }
}
