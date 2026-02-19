import type { User } from "@/domain/entities/user/User";

export interface TicketCategoryStat {
  type: string;
  count: number;
}

export interface StatsResponse {
  totalTickets: number;
  monthTickets: number;
  adminsCount: number;
  activeAdmins: number;
  avgResponseHours: number;
  usersCount: number;
  countType: TicketCategoryStat[];
  avgSatisfactionScore: number;
  problemTicketsCount: number;
}


export interface Administrator {
  adminId: number;
  userId: number;
  fullName: string;
  role: string;
  region: string | null;
  city: string | null;
  responsibleTypes: string[];
}

export interface AddAdministratorRequest {
  id: string;
  types: string[];
  regionId?: number;
  cityId?: number;
}


export interface AdminPerformanceDto {
  fullName: string;
  category: string;       // категория администратора
  decided: number;        // решено
  atWork: number;         // в работе
  averageTime: number;    // среднее время ответа
  status: string;         // онлайн / оффлайн
  avgSatisfaction: number; // средняя удовлетворенность (1-5)
}

export type AdminPerformance = AdminPerformanceDto;

export interface Region {
  id: number;
  name: string;
  cities?: City[];
}

export interface City {
  id: number;
  name: string;
  regionId: number;
}

export interface UserRepository {
  getMe(): Promise<User>;
  setName(name: string): Promise<void>;
  getAllGroups(): Promise<string[]>;
  ownerStats(): Promise<StatsResponse>
  getAdminPerformance(): Promise<AdminPerformanceDto[]>;
  getAdministrators(): Promise<Administrator[]>;
  addAdministrator(request: AddAdministratorRequest): Promise<Administrator>;
  deleteAdministrator(request: AddAdministratorRequest): Promise<string>;
  getOwnerAiInsights(): Promise<string>;
  getOwnerMonthlyReport(): Promise<string>;
  getAllUsers(): Promise<User[]>;
  getRegions(): Promise<Region[]>;
  getTicketTypes(): Promise<TicketType[]>;
  addRegionAdministrator(userId: number, regionId: number): Promise<string>;
  addCityAdministrator(userId: number, regionId: number, cityId: number): Promise<string>;
  addSupport(userId: number, regionId: number, cityId: number, types: string[]): Promise<string>;
}

export interface TicketType {
  code: string;
  title: string;
  description: string;
}