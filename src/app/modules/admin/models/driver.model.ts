import { Guid } from "guid-typescript";

export class driver {
    constructor(
        id: Guid,
        userId: Guid,
        userDescription: string,
        firstName: string,
        lastName: string,
        phone: string,
        email: string,
        password: string,
        idNumber: string,
        dateOfBirth: Date,
        licenceTypeId: Guid,
        licenceTypeDescription: string,
        licenceExpiryDate: Date,
        avatar: boolean,
        statusId: Guid,
        statusDescription: string,
        review: number,
        reviewCount: number
    ) {
        this.id = id;
        this.userId = userId;
        this.userDescription = userDescription;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.password = password;
        this.idNumber = idNumber;
        this.dateOfBirth = dateOfBirth;
        this.licenceTypeId = licenceTypeId;
        this.licenceTypeDescription = licenceTypeDescription;
        this.licenceExpiryDate = licenceExpiryDate;
        this.avatar = avatar;
        this.statusId = statusId;
        this.statusDescription = statusDescription
        this.review = review;
        this.reviewCount = reviewCount;
    }
    public id: Guid;
    public userId: Guid;
    public userDescription: string;
    public firstName: string;
    public lastName: string;
    public phone: string;
    public email: string;
    public password: string;
    public idNumber: string;
    public dateOfBirth: Date;
    public licenceTypeId: Guid;
    public licenceTypeDescription: string;
    public licenceExpiryDate: Date;
    public avatar: boolean;
    public statusId: Guid;
    public statusDescription: string;
    public review: number;
    public reviewCount: number;
}