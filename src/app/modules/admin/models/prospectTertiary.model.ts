import { Guid } from "guid-typescript";

export class ProspectTertiary {
    id: Guid;
    prospectId: Guid;
    description: string;
    course: string;
    yearCompleted: number;
    
    constructor(id: Guid, prospectId: Guid, description: string, course: string, yearCompleted: number){
        this.id = id;
        this.prospectId = prospectId;
        this.description = description;
        this.course = course;
        this.yearCompleted = yearCompleted;        
    }
}