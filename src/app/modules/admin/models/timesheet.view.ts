import { Guid } from "guid-typescript";

export class TimesheetView {
    id: Guid;
    prospectId: Guid;
    clientId: Guid;
    name: string;
    surname: string;
    idNumber: string;
    phone: string;
    email: string;
    address1: string;
    address2: string;
    addressCity: string;
    addressProvince: string;
    addressCountry: string;
    addressCode: string;
    role: string;
    timesheetDate: Date;
    hoursRegular: number;
    hoursOvertime: number;

    constructor(
        id: Guid,
        prospectId: Guid,
        clientId: Guid,
        name: string,
        surname: string,
        idNumber: string,
        phone: string,
        email: string,
        address1: string,
        address2: string,
        addressCity: string,
        addressProvince: string,
        addressCountry: string,
        addressCode: string,
        role: string,
        timesheetDate: Date,
        hoursRegular: number, 
        hoursOvertime: number
    ) {
        this.id = id;
        this.prospectId = prospectId;
        this.clientId = clientId;
        this.name = name;
        this.surname = surname;
        this.idNumber = idNumber;
        this.phone = phone;
        this.email = email;
        this.address1 = address1;
        this.address2 = address2;
        this.addressCity = addressCity;
        this.addressProvince = addressProvince;
        this.addressCountry = addressCountry;
        this.addressCode = addressCode;
        this.role = role;
        this.timesheetDate = timesheetDate;
        this.hoursRegular = hoursRegular;
        this.hoursOvertime = hoursOvertime;
    }
}