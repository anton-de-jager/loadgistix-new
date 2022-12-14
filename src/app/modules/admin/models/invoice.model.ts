import { Guid } from "guid-typescript";

export class Invoice {
    id: Guid;
    clientId: Guid;
    invoiceNumber: string;
    poNumber: string;
    invoiceDate: Date;
    dueDate: Date;

    constructor(id: Guid, clientId: Guid, invoiceNumber: string, invoiceDate: Date, dueDate: Date, poNumber: string) {
        this.id = id;
        this.clientId = clientId;
        this.invoiceNumber = invoiceNumber;
        this.invoiceDate = invoiceDate;
        this.dueDate = dueDate;
        this.poNumber = poNumber;
    }
}