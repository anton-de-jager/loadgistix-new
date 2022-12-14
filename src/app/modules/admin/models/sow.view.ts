import { Guid } from "guid-typescript";

export class SowView {
    id: Guid;
    clientId: Guid;
    descriptionClient: string;
    descriptionShortClient: string;
    registrationNumberClient: string;
    vatNumberClient: string;
    address1Client: string;
    address2Client: string;
    addressCityClient: string;
    addressProvinceClient: string;
    addressCountryClient: string;
    addressCodeClient: string;
    contactClient: string;
    contactPhoneClient: string;
    contactEmailClient: string;
    dateBillingId: number;
    dayNumber: string;
    prospectId: Guid;
    nameProspect: string;
    surnameProspect: string;
    idNumberProspect: string;
    phoneProspect: string;
    emailProspect: string;
    address1Prospect: string;
    address2Prospect: string;
    addressCityProspect: string;
    addressProvinceProspect: string;
    addressCountryProspect: string;
    addressCodeProspect: string;
    equityProspect: string;
    nationalityProspect: string;
    transportProspect: string;
    availabilityProspect: string;
    educationSchoolProspect: string;
    educationHighestGradeProspect: string;
    educationYearCompletedProspect: number;
    roleProspect: string;
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
        descriptionClient: string,
        descriptionShortClient: string,
        registrationNumberClient: string,
        vatNumberClient: string,
        address1Client: string,
        address2Client: string,
        addressCityClient: string,
        addressProvinceClient: string,
        addressCountryClient: string,
        addressCodeClient: string,
        contactClient: string,
        contactPhoneClient: string,
        contactEmailClient: string,
        dateBillingId: number,
        dayNumber: string,
        prospectId: Guid,
        nameProspect: string,
        surnameProspect: string,
        idNumberProspect: string,
        phoneProspect: string,
        emailProspect: string,
        address1Prospect: string,
        address2Prospect: string,
        addressCityProspect: string,
        addressProvinceProspect: string,
        addressCountryProspect: string,
        addressCodeProspect: string,
        equityProspect: string,
        nationalityProspect: string,
        transportProspect: string,
        availabilityProspect: string,
        educationSchoolProspect: string,
        educationHighestGradeProspect: string,
        educationYearCompletedProspect: number,
        roleProspect: string,
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
        this.descriptionClient = descriptionClient;
        this.descriptionShortClient = descriptionShortClient;
        this.registrationNumberClient = registrationNumberClient;
        this.vatNumberClient = vatNumberClient;
        this.address1Client = address1Client;
        this.address2Client = address2Client;
        this.addressCityClient = addressCityClient;
        this.addressProvinceClient = addressProvinceClient;
        this.addressCountryClient = addressCountryClient;
        this.addressCodeClient = addressCodeClient;
        this.contactClient = contactClient;
        this.contactPhoneClient = contactPhoneClient;
        this.contactEmailClient = contactEmailClient;
        this.dateBillingId = dateBillingId;
        this.dayNumber = dayNumber;
        this.prospectId = prospectId;
        this.nameProspect = nameProspect;
        this.surnameProspect = surnameProspect;
        this.idNumberProspect = idNumberProspect;
        this.phoneProspect = phoneProspect;
        this.emailProspect = emailProspect;
        this.address1Prospect = address1Prospect;
        this.address2Prospect = address2Prospect;
        this.addressCityProspect = addressCityProspect;
        this.addressProvinceProspect = addressProvinceProspect;
        this.addressCountryProspect = addressCountryProspect;
        this.addressCodeProspect = addressCodeProspect;
        this.equityProspect = equityProspect;
        this.nationalityProspect = nationalityProspect;
        this.transportProspect = transportProspect;
        this.availabilityProspect = availabilityProspect;
        this.educationSchoolProspect = educationSchoolProspect;
        this.educationHighestGradeProspect = educationHighestGradeProspect;
        this.educationYearCompletedProspect = educationYearCompletedProspect;
        this.roleProspect = roleProspect;
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