import { Guid } from "guid-typescript";

export class status {
    constructor(
        id: Guid,
        table: string,
        description: string
    ) {
        this.id = id;
        this.table = table;
        this.description = description
    }
    public id: Guid;
    public table: string;
    public description: string;
}