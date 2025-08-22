import type { User } from "../user/User";

export const TicketType = {
    WWIIVeteran: "Ветеран ВОВ",
    EqualToWWIVeteran: "Ветеран, приравнённый к ветерану ВОВ",
    CombatVeteran: "Ветеран боевых действий",
    DisabledGroup1Or2: "Инвалид I или II группы",
    FamilyWithDisabledChild: "Семья с ребёнком-инвалидом",
    ChronicIllness: "Гражданин с тяжёлым хроническим заболеванием",
    Pensioner: "Пенсионер по возрасту",
    OrphanUnder29: "Ребёнок-сирота (до 29 лет)",
    Kandas: "Кандас",
    LostHousingDisaster: "Лишённый жилья вследствие бедствия",
    LargeFamily: "Многодетная семья",
    FamilyOfDeceased: "Семья погибшего при исполнении долга",
    SingleParentFamily: "Неполная семья",
} as const;

export type TicketType = typeof TicketType[keyof typeof TicketType];

export const TicketStatus = {
    New: "Новый",
    In_Progress: "В работе",
    Closed: "Закрыт",
} as const;

export type TicketStatus = typeof TicketStatus[keyof typeof TicketStatus];

export type TicketComment = {
    readonly description: string;
    readonly createDate: string;
    readonly createUser: User;
};

export type Ticket = {
    readonly id: string;
    readonly name: string;
    readonly userCreate: User;
    readonly moderator?: User;
    readonly description: string;
    readonly createDate: string;
    readonly ticketType: TicketType;
    readonly ticketStatus: TicketStatus;
    readonly ticketComment: TicketComment[];
};