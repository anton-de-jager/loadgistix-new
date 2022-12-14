import { Guid } from "guid-typescript";

export class reviewLoad {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(
        id: Guid, 
        userId: Guid, 
        loadId: Guid, 
        ratingPunctuality: number, 
        ratingLoadDescription: number, 
        ratingCare: number, 
        ratingPayment: number, 
        ratingAttitude: number,
        note: string,
        timestamp: Date
    ) {
        this.id = id;
        this.userId = userId;
        this.loadId = loadId;
        this.ratingPunctuality = ratingPunctuality;
        this.ratingLoadDescription = ratingLoadDescription;
        this.ratingCare = ratingCare;
        this.ratingPayment = ratingPayment;
        this.ratingAttitude = ratingAttitude;
        this.note = note;
        this.timestamp = timestamp;

    }

    public id: Guid;
    public userId: Guid; 
    public loadId: Guid; 
    public ratingPunctuality: number; 
    public ratingLoadDescription: number; 
    public ratingCare: number; 
    public ratingPayment: number; 
    public ratingAttitude: number;
    public note: string;
    public timestamp: Date;
}
