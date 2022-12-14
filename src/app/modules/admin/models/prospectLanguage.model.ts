import { Guid } from "guid-typescript";

export class ProspectLanguage {
    id: Guid;
    prospectId: Guid;
    description: string;
    
    constructor(id: Guid, prospectId: Guid, description: string){
        this.id = id;
        this.prospectId = prospectId;
        this.description = description;        
    }
}