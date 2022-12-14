import { Guid } from "guid-typescript";

export class keyValue {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(id: Guid, description: string
    ) {
        this.id = id;
        this.description = description;

    }

    public id: Guid;
    public description: string;
}
