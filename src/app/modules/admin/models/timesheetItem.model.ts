import { Guid } from "guid-typescript";

export class TimesheetItem {
    id: Guid;
    timesheetId: Guid;
    taskDate: Date;
    description: string;
    hoursRegular: number;
    hoursOvertime: number;

    constructor(id: Guid, timesheetId: Guid, taskDate: Date, description: string, hoursRegular: number, hoursOvertime: number) {
        this.id = id;
        this.timesheetId = timesheetId;
        this.taskDate = taskDate;
        this.description = description;
        this.hoursRegular = hoursRegular;
        this.hoursOvertime = hoursOvertime;
    }
}