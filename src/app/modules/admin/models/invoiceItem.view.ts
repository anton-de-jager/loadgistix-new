import { Guid } from "guid-typescript";

export class InvoiceItemView {
    id: Guid;
    invoiceId: Guid;
    timesheetId: Guid;
    description: string;
    totalRegular: number;
    totalOvertime: number;
    hoursRegular: number;
    hoursOvertime: number;
    rateRegular: number;
    rateOvertime: number;

    constructor(
        id: Guid, 
        invoiceId: Guid,
        timesheetId: Guid,
        description: string,
        totalRegular: number,
        totalOvertime: number,
        hoursRegular: number,
        hoursOvertime: number,
        rateRegular: number,
        rateOvertime: number
        ) {
        this.id = id;
        this.invoiceId = invoiceId;
        this.timesheetId = timesheetId;
        this.description = description;
        this.totalRegular = totalRegular;
        this.totalOvertime = totalOvertime;
        this.hoursRegular = hoursRegular;
        this.hoursOvertime = hoursOvertime;
        this.rateRegular = rateRegular;
        this.rateOvertime = rateOvertime;
    }
}