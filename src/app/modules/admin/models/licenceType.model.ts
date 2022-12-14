import { Guid } from "guid-typescript";

export class licenceType {
    constructor(
        id: Guid,
        code: string,
        description: string
    ) {
        this.id = id;
        this.code = code;
        this.description = description
    }
    public id: Guid;
    public code: string;
    public description: string;
}