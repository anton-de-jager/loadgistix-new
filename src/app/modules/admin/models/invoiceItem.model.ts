import { Guid } from "guid-typescript";

export class InvoiceItem {
    id: Guid;
    invoiceId: Guid;
    timesheetId: Guid;
    
    constructor(id: Guid, invoiceId: Guid, timesheetId){
        this.id = id;
        this.invoiceId = invoiceId;
        this.timesheetId = timesheetId;        
    }
}