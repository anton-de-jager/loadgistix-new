import { Guid } from "guid-typescript";

import { ProspectEmploymentDuty } from "./prospectEmploymentDuty.model";
import { ProspectEmploymentTechnology } from "./prospectEmploymentTechnology.model";

export class ProspectEmployment {
    id: Guid;
    prospectId: Guid;
    description: string;
    position: string;
    dateStart: Date;
    dateEnd: Date;
    reasonForLeaving: string;
    dutyItems: ProspectEmploymentDuty[];
    technologyItems: ProspectEmploymentTechnology[];
    
    constructor(id: Guid, prospectId: Guid, description: string, position: string, dateStart: Date, dateEnd: Date, reasonForLeaving: string, dutyItems: ProspectEmploymentDuty[], technologyItems: ProspectEmploymentTechnology[]){
        this.id = id;
        this.prospectId = prospectId;
        this.description = description;
        this.position = position;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.reasonForLeaving = reasonForLeaving;    
        this.dutyItems = dutyItems;  
        this.technologyItems = technologyItems;  
    }
}