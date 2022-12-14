import { Guid } from "guid-typescript";

export class ProspectEmploymentDuty {
    id: Guid;
    prospectEmploymentId: Guid;
    description: string;
    
    constructor(id: Guid, prospectEmploymentId: Guid, description: string){
        this.id = id;
        this.prospectEmploymentId = prospectEmploymentId;
        this.description = description;        
    }
}