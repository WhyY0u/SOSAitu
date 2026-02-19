import apiClient from "@/data/datasources/api/apiClient";
import type { RegionAdminAnalyticsResponse, RegionAdminRepository, CityAdministrator, City, CityStatistics } from "@/domain/repositories/region_admin/RegionAdminRepository";

export default class RegionAdminApiRepository implements RegionAdminRepository {
  async getAnalytics(): Promise<RegionAdminAnalyticsResponse> {
    return (await apiClient.get('/region-admin/analytics')).data;
  }

  async getMonthlyReport(): Promise<string> {
    return (await apiClient.get('/region-admin/monthly-report')).data;
  }

  async getInsights(): Promise<string> {
    return (await apiClient.get('/region-admin/ai-insights')).data;
  }

  async getCitiesStatistics(): Promise<CityStatistics[]> {
    return (await apiClient.get('/region-admin/cities-stats')).data;
  }

  async getCityStatistics(cityId: number): Promise<CityStatistics> {
    return (await apiClient.get(`/region-admin/cities-stats/${cityId}`)).data;
  }

  async getCityAdministrators(): Promise<CityAdministrator[]> {
    return (await apiClient.get('/region-admin/city-administrators')).data;
  }

  async getCities(): Promise<City[]> {
    try {
      const response = await apiClient.get('/region-admin/cities');
      console.log('API /region-admin/cities response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      throw error;
    }
  }

  async addCityAdministrator(userId: number, cityId: number): Promise<void> {
    await apiClient.post('/region-admin/city-administrators', {
      userId,
      cityId
    });
  }

  async deleteCityAdministrator(userId: number): Promise<void> {
    await apiClient.delete(`/region-admin/city-administrators/${userId}`);
  }
}
