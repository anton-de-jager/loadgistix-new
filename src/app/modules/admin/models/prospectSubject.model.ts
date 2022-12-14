import { Guid } from "guid-typescript";

export class ProspectSubject {
    id: Guid;
    prospectId: Guid;
    description: string;
    level: string;
    result: string;
    
    constructor(id: Guid, prospectId: Guid, description: string, level: string, result: string){
        this.id = id;
        this.prospectId = prospectId;
        this.description = description;
        this.level = level;
        this.result = result;        
    }
}