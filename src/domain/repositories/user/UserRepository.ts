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
  id: number;
  user: User;
  responsible: string[];
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
}


export interface UserRepository {
  getMe(): Promise<User>;
  setNameAndTypes(name: string, groups: string[]): Promise<void>;
  getAllGroups(): Promise<string[]>;
  ownerStats(): Promise<StatsResponse>
  getAdminPerformance(): Promise<AdminPerformanceDto[]>;
  getAdministrators(): Promise<Administrator[]>;
  addAdministrator(request: AddAdministratorRequest): Promise<Administrator>;
  deleteAdministrator(request: AddAdministratorRequest): Promise<string>;
  getOwnerAiInsights(): Promise<string>;
}