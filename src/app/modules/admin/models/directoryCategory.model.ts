import { Guid } from "guid-typescript";

export class directoryCategory {
    constructor(
        id: Guid,
        description: string,
        directoryCount: number
    ) {
        this.id = id;
        this.description = description;
        this.directoryCount = directoryCount;
    }
    public id: Guid;
    public description: string;
    public directoryCount: number;
}