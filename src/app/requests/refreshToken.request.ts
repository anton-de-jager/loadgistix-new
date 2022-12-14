import { User } from "app/models/user.model";
import { Guid } from "guid-typescript";

export interface RefreshTokenRequest {
    userId: Guid;
    refreshToken: string;
    user: User;
}