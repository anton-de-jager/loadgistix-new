import { Guid } from "guid-typescript";

export class DateBilling {
    id: number;
    dayNumber: string;

    constructor(
        id: number,
        dayNumber: string
    ) {
        this.id = id;
        this.dayNumber = dayNumber;
    }
}