import { Guid } from "guid-typescript";

export class ClientView {
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
    dayNumber: string;
    statusId: Guid;
    statusDescription: string;

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
        dayNumber: string,
        statusId: Guid,
        statusDescription: string
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
        this.dayNumber = dayNumber;
        this.statusId = statusId;
        this.statusDescription = statusDescription;
    }
}