import { Guid } from "guid-typescript";

export class ClientNote {
    id: Guid;
    clientId: Guid;
    note: string;
    createdBy: Guid;
    createdOn: Date;
    isMine: boolean;

    constructor(
        id: Guid,
        clientId: Guid,
        note: string,
        createdBy: Guid,
        createdOn: Date,
        isMine: boolean
    ) {
        this.id = id;
        this.clientId = clientId;
        this.note = note;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.isMine = isMine;
    }
}