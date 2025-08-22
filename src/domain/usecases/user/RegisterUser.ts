import type { User } from "@/domain/entities/user/User";
import type { UserRepository } from "@/domain/repositories/user/UserRepository";

export async function registerUser(
  user: User,
  repo: UserRepository
): Promise<void> {
  const existing = await repo.findUserByID(user.id);
  if (existing != null) throw new Error("Пользователь с таким ИИН уже зарегистрирован");
  
  await repo.register(user);
}
