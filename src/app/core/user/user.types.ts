export interface User {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    adverts: number;
    company: string;
    directory: number;
    firstName: string;
    lastName: string;
    loads: number;
    password: string;
    phone: string;
    statusDescription: string;
    statusId: string;
    tokenExpiry: Date;
    userId: string;
    userType: string;
    vehicles: number;
    avatar?: string;
    status?: string;
}
