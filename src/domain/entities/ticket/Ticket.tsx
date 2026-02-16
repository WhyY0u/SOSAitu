import type { User } from "../user/User";

export const TicketStatus = {
    Expectation: "Expectation",
    InProgress: "InProgress",
    Completed: "Completed",
} as const;

export type TicketStatus = typeof TicketStatus[keyof typeof TicketStatus];


export type Ticket = {
    readonly id: number;
    readonly userId: number;           // user_id
    readonly createdTime: string;      // created_time
    readonly name: string;
    readonly description: string;
    readonly tags: string[];
    readonly ai_comments: string;       // ai_comments
    readonly status: TicketStatus;     // status
    readonly type: string;             // ticketType теперь просто string
    readonly userCreate: User;
    readonly moderator?: User;
    readonly comment: string;
    readonly satisfactionScore?: number;
    readonly satisfactionComment?: string;
};
