import { Guid } from "guid-typescript";
import { advertPackage } from "./advertPackage.model";
import { status } from "./status.model";
import { user } from "./user.model";

export class dashboard {
    constructor(
        category: string,
        id: Guid,
        description: string,
        date: Date,
        value: number,
    ) {
        this.category = category;
        this.id = id;
        this.description = description;
        this.date = date;
        this.value = value;
    }
    public category: string;
    public id: Guid;
    public description: string;
    public date: Date;
    public value: number;
}