import { Guid } from "guid-typescript";
import { load } from "./load.model";
import { status } from "./status.model";
import { advert } from "./advert.model";
import { bid } from "./bid.model";
import { directory } from "./directory.model";
import { driver } from "./driver.model";
//import { message } from "./message.model";
import { reviewDriver } from "./reviewDriver.model";
import { reviewLoad } from "./reviewLoad.model";
//import { userPermission } from "./userPermission.model";
import { vehicle } from "./vehicle.model";

export class user {
    constructor(
        id: Guid,
        company: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        phone: string,
        tokenExpiry: Date | null,
        accessToken: string,
        statusId: Guid,
        avatar: string,
        reset: string | null,
        status: status,
        advert: advert[],
        bid: bid[],
        directory: directory[],
        driver: driver[],
        loadUser: load[],
        loadUserIdAcceptedNavigation: load[],
        loadUserIdDeliveredConfirmedNavigation: load[],
        loadUserIdDeliveredNavigation: load[],
        loadUserIdLoadedConfirmedNavigation: load[],
        loadUserIdLoadedNavigation: load[],
        //messageUserIdFromNavigation: message[],
        //messageUserIdToNavigation: message[],
        reviewDriver: reviewDriver[],
        reviewLoad: reviewLoad[],
        //userPermission: userPermission[],
        vehicle: vehicle[],
        userType: string
    ) {
        this.id = id;
        this.company = company;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.tokenExpiry = tokenExpiry;
        this.accessToken = accessToken;
        this.statusId = statusId;
        this.avatar = avatar;
        this.reset = reset;
        this.status = status;
        this.advert = advert;
        this.bid = bid;
        this.directory = directory;
        this.driver = driver;
        this.loadUser = loadUser;
        this.loadUserIdAcceptedNavigation = loadUserIdAcceptedNavigation;
        this.loadUserIdDeliveredConfirmedNavigation = loadUserIdDeliveredConfirmedNavigation;
        this.loadUserIdDeliveredNavigation = loadUserIdDeliveredNavigation;
        this.loadUserIdLoadedConfirmedNavigation = loadUserIdLoadedConfirmedNavigation;
        this.loadUserIdLoadedNavigation = loadUserIdLoadedNavigation;
        //this.messageUserIdFromNavigation = messageUserIdFromNavigation;
        //this.messageUserIdToNavigation = messageUserIdToNavigation;
        this.reviewDriver = reviewDriver;
        this.reviewLoad = reviewLoad;
        //this.userPermission = userPermission;
        this.vehicle = vehicle;
        this.userType = userType;
    }
    public id: Guid;
    public company: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public phone: string;
    public tokenExpiry: Date | null;
    public accessToken: string;
    public statusId: Guid;
    public avatar: string;
    public reset: string | null;
    public status: status;
    public advert: advert[];
    public bid: bid[];
    public directory: directory[];
    public driver: driver[];
    public loadUser: load[];
    public loadUserIdAcceptedNavigation: load[];
    public loadUserIdDeliveredConfirmedNavigation: load[];
    public loadUserIdDeliveredNavigation: load[];
    public loadUserIdLoadedConfirmedNavigation: load[];
    public loadUserIdLoadedNavigation: load[];
    //public messageUserIdFromNavigation: message[];
    //public messageUserIdToNavigation: message[];
    public reviewDriver: reviewDriver[];
    public reviewLoad: reviewLoad[];
    //public userPermission: userPermission[];
    public vehicle: vehicle[];
    public userType: string;
}