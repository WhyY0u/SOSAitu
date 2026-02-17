import apiClient from "@/data/datasources/api/apiClient";

export interface Region {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  region: Region;
}

export class ApiLocationRepository {
  async getRegions(): Promise<Region[]> {
    return (await apiClient.get("/location/regions")).data;
  }

  async getCities(regionId: number): Promise<City[]> {
    return (await apiClient.get(`/location/regions/${regionId}/cities`)).data;
  }

  async getAllCities(): Promise<City[]> {
    return (await apiClient.get("/location/cities")).data;
  }
}

