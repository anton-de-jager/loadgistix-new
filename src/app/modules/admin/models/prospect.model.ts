import { Guid } from "guid-typescript";

import { ProspectEmployment } from "./prospectEmployment.model";
import { ProspectLanguage } from "./prospectLanguage.model";
import { ProspectSubject } from "./prospectSubject.model";
import { ProspectTertiary } from "./prospectTertiary.model";

export class Prospect {
    id: Guid;
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
    equity: string;
    nationality: string;
    transport: string;
    availability: string;
    educationSchool: string;
    educationHighestGrade: string;
    educationYearCompleted: number;
    role: string;
    employmentItems: ProspectEmployment[];
    languageItems: ProspectLanguage[];
    subjectItems: ProspectSubject[];
    tertiaryItems: ProspectTertiary[];

    constructor(
        id: Guid,
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
        equity: string,
        nationality: string,
        transport: string,
        availability: string,
        educationSchool: string,
        educationHighestGrade: string,
        educationYearCompleted: number,
        role: string,
        employmentItems: ProspectEmployment[],
        languageItems: ProspectLanguage[],
        subjectItems: ProspectSubject[],
        tertiaryItems: ProspectTertiary[]
    ) {
        this.id = id;
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
        this.equity = equity;
        this.nationality = nationality;
        this.transport = transport;
        this.availability = availability;
        this.educationSchool = educationSchool;
        this.educationHighestGrade = educationHighestGrade;
        this.educationYearCompleted = educationYearCompleted;
        this.role = role;
        this.employmentItems = employmentItems;
        this.languageItems = languageItems;
        this.subjectItems = subjectItems;
        this.tertiaryItems = tertiaryItems;
    }
}