import { Guid } from "guid-typescript";

export class Status {
    id: Guid;
    table: string;
    description: string;

    constructor(
        id: Guid,
        table: string,
        description: string
    ) {
        this.id = id;
        this.table = table;
        this.description = description;
    }
}