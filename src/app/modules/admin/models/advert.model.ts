import { Guid } from "guid-typescript";
import { advertPackage } from "./advertPackage.model";
import { status } from "./status.model";
import { user } from "./user.model";

export class advert {
    constructor(
        id: Guid,
        userId: Guid,
        dateExpiry: Date,
        advertPackageId: Guid,
        title: string,
        subTitle: string,
        link: string,
        content: string,
        statusId: Guid,
        avatar: string,
        advertPackage: advertPackage,
        status: status,
        user: user,
    ) {
        this.id = id;
        this.userId = userId;
        this.dateExpiry = dateExpiry;
        this.advertPackageId = advertPackageId;
        this.title = title;
        this.subTitle = subTitle;
        this.link = link;
        this.content = content;
        this.statusId = statusId;
        this.avatar = avatar;
        this.advertPackage = advertPackage;
        this.status = status;
        this.user = user;
    }
    public id: Guid;
    public userId: Guid;
    public dateExpiry: Date;
    public advertPackageId: Guid;
    public title: string;
    public subTitle: string;
    public link: string;
    public content: string;
    public statusId: Guid;
    public avatar: string;
    public advertPackage: advertPackage;
    public status: status;
    public user: user;
}