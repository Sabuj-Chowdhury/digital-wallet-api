export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  SUSPENDED = "SUSPENDED",
}

export interface IUser {
  name: string;
  email?: string;
  phone: string;
  role: Role;
  status: AccountStatus;
  password?: string;
  approved: boolean; // required for agents
  commissionRate?: number;
}
