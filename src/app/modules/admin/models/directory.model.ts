import { Guid } from "guid-typescript";
import { directoryCategory } from "./directoryCategory.model";

export class directory {
    constructor(
        id: Guid,
        userId: Guid,
        directoryCategoryId: Guid,
        directoryCategory: directoryCategory,
        directoryCategoryDescription: string,
        companyName: string,
        description: string,
        email: string,
        phone: string,
        website: string,
        instagram: string,
        facebook: string,
        twitter: string,
        addressLat: number,
        addressLon: number,
        addressLabel: string,
        avatar: string,
        statusId: Guid,
        statusDescription: string
    ) {
        this.id = id;
        this.userId = userId;
        this.directoryCategoryId = directoryCategoryId;
        this.directoryCategory = directoryCategory;
        this.directoryCategoryDescription = directoryCategoryDescription;
        this.companyName = companyName;
        this.description = description;
        this.email = email;
        this.phone = phone;
        this.website = website;
        this.instagram = instagram;
        this.facebook = facebook;
        this.twitter = twitter;
        this.addressLat = addressLat;
        this.addressLon = addressLon;
        this.addressLabel = addressLabel;
        this.avatar = avatar;
        this.statusId = statusId;
        this.statusDescription = statusDescription;
    }
    public id: Guid;
    public userId: Guid;
    public directoryCategoryId: Guid;
    public directoryCategory: directoryCategory;
    public directoryCategoryDescription: string;
    public companyName: string;
    public description: string;
    public email: string;
    public phone: string;
    public website: string;
    public instagram: string;
    public facebook: string;
    public twitter: string;
    public addressLat: number;
    public addressLon: number;
    public addressLabel: string;
    public avatar: string;
    public statusId: Guid;
    public statusDescription: string;
}