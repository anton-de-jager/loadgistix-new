import { Guid } from "guid-typescript";

export class Sow {
    id: Guid;
    clientId: Guid;
    prospectId: Guid;
    documentNumberClient: string;
    documentNumberProspect: string;
    role: string;
    hourlyRateClient: number;
    hourlyRateProspect: number;
    location: string;
    dateStart: Date;
    dateEnd: Date;
    dateContractClient: Date;
    dateContractProspect: Date;

    constructor(
        id: Guid,
        clientId: Guid,
        prospectId: Guid,
        documentNumberClient: string,
        documentNumberProspect: string,
        role: string,
        hourlyRateClient: number,
        hourlyRateProspect: number,
        location: string,
        dateStart: Date,
        dateEnd: Date,
        dateContractClient: Date,
        dateContractProspect: Date
    ) {
        this.id = id;
        this.clientId = clientId;
        this.prospectId = prospectId;
        this.documentNumberClient = documentNumberClient;
        this.documentNumberProspect = documentNumberProspect;
        this.role = role;
        this.hourlyRateClient = hourlyRateClient;
        this.hourlyRateProspect = hourlyRateProspect;
        this.location = location;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.dateContractClient = dateContractClient;
        this.dateContractProspect = dateContractProspect;
    }
}