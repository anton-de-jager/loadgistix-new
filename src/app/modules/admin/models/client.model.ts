import { Guid } from "guid-typescript";

export class Client {
    id: Guid;
    description: string;
    descriptionShort: string;
    registrationNumber: string;
    vatNumber: string;
    address1: string;
    address2: string;
    addressCity: string;
    addressProvince: string;
    addressCountry: string;
    addressCode: string;
    contact: string;
    contactPhone: string;
    contactEmail: string;
    dateBillingId: number;
    statusId: Guid;

    constructor(
        id: Guid,
        description: string,
        descriptionShort: string,
        registrationNumber: string,
        vatNumber: string,
        address1: string,
        address2: string,
        addressCity: string,
        addressProvince: string,
        addressCountry: string,
        addressCode: string,
        contact: string,
        contactPhone: string,
        contactEmail: string,
        dateBillingId: number,
        statusId: Guid
    ) {
        this.id = id;
        this.description = description;
        this.descriptionShort = descriptionShort;
        this.registrationNumber = registrationNumber;
        this.vatNumber = vatNumber;
        this.address1 = address1;
        this.address2 = address2;
        this.addressCity = addressCity;
        this.addressProvince = addressProvince;
        this.addressCountry = addressCountry;
        this.addressCode = addressCode;
        this.contact = contact;
        this.contactPhone = contactPhone;
        this.contactEmail = contactEmail;
        this.dateBillingId = dateBillingId;
        this.statusId = statusId;
    }
}