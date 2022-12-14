import { Guid } from "guid-typescript";

export class Timesheet {
    id: Guid;
    prospectId: Guid;
    timesheetDate: Date;

    constructor(id: Guid, prospectId: Guid, timesheetDate: Date) {
        this.id = id;
        this.prospectId = prospectId;
        this.timesheetDate = timesheetDate;
    }
}