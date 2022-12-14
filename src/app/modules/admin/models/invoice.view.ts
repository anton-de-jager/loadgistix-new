import { Guid } from "guid-typescript";

export class InvoiceView {
    id: Guid;
    invoiceNumber: string;
    invoiceDate: Date;
    dueDate: Date;
    clientId: Guid;
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
    totalRegular: number;
    totalOvertime: number;
    poNumber: string;

    constructor(
        id: Guid,
        invoiceNumber: string,
        invoiceDate: Date,
        dueDate: Date,
        clientId: Guid,
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
        totalRegular: number,
        totalOvertime: number,
        poNumber: string
    ) {
        this.id = id;
        this.invoiceNumber = invoiceNumber;
        this.invoiceDate = invoiceDate;
        this.dueDate = dueDate;
        this.clientId = clientId;
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
        this.totalRegular = totalRegular;
        this.totalOvertime = totalOvertime;
        this.poNumber = poNumber;
    }
}