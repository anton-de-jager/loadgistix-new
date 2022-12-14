import { User } from "app/models/user.model";
import { Guid } from "guid-typescript";

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}