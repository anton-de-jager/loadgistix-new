import { Guid } from "guid-typescript";
import { bid } from "./bid.model";

export class load {
    constructor(
        id: Guid,
        userId: Guid,
        userDescription: string,
        loadCategoryId: Guid,
        loadCategoryDescription: string,
        loadTypeId: Guid,
        loadTypeDescription: string,
        loadTypeLiquid: boolean,
        description: string,
        note: string,
        price: number,
        originatingAddressLabel: string,
        originatingAddressLat: number,
        originatingAddressLon: number,
        destinationAddressLabel: string,
        destinationAddressLat: number,
        destinationAddressLon: number,
        itemCount: number,
        weight: number,
        length: number,
        width: number,
        height: number,
        volume: number,
        totalValue: number,
        dateOut: Date,
        dateIn: Date,
        dateBidEnd: Date,
        notificationId: Guid,
        notificationDescription: string,
        avatar: boolean,
        statusId: Guid,
        statusDescription: string,
        review: number,
        reviewCount: number,
        bidCount: number,
        userIdAccepted: Guid,
        userIdLoaded: Guid,
        userIdLoadedConfirmed: Guid,
        userIdDelivered: Guid,
        userIdDeliveredConfirmed: Guid,

        bid: bid[]
    ) {
        this.id = id;
        this.userId = userId;
        this.userDescription = userDescription;
        this.loadCategoryId = loadCategoryId;
        this.loadCategoryDescription = loadCategoryDescription;
        this.loadTypeId = loadTypeId;
        this.loadTypeDescription = loadTypeDescription;
        this.loadTypeLiquid = loadTypeLiquid;
        this.description = description;
        this.note = note;
        this.price = price;
        this.originatingAddressLabel = originatingAddressLabel;
        this.originatingAddressLat = originatingAddressLat;
        this.originatingAddressLon = originatingAddressLon;
        this.destinationAddressLabel = destinationAddressLabel;
        this.destinationAddressLat = destinationAddressLat;
        this.destinationAddressLon = destinationAddressLon;
        this.itemCount = itemCount;
        this.weight = weight;
        this.length = length;
        this.width = width;
        this.height = height;
        this.volume = volume;
        this.totalValue = totalValue;
        this.dateOut = dateOut;
        this.dateIn = dateIn;
        this.dateBidEnd = dateBidEnd;
        this.notificationId = notificationId;
        this.notificationDescription = notificationDescription;
        this.avatar = avatar;
        this.statusId = statusId;
        this.statusDescription = statusDescription;
        this.review = review;
        this.reviewCount = reviewCount;
        this.bidCount = bidCount;
        this.userIdAccepted = userIdAccepted;
        this.userIdLoaded = userIdLoaded;
        this.userIdLoadedConfirmed = userIdLoadedConfirmed;
        this.userIdDelivered = userIdDelivered;
        this.userIdDeliveredConfirmed = userIdDeliveredConfirmed;

        this.bid = bid;
    }
    public id: Guid;
    public userId: Guid;
    public userDescription: string;
    public loadCategoryId: Guid;
    public loadCategoryDescription: string;
    public loadTypeId: Guid;
    public loadTypeDescription: string;
    public loadTypeLiquid: boolean;
    public description: string;
    public note: string;
    public price: number;
    public originatingAddressLabel: string;
    public originatingAddressLat: number;
    public originatingAddressLon: number;
    public destinationAddressLabel: string;
    public destinationAddressLat: number;
    public destinationAddressLon: number;
    public itemCount: number;
    public weight: number;
    public length: number;
    public width: number;
    public height: number;
    public volume: number;
    public totalValue: number;
    public dateOut: Date;
    public dateIn: Date;
    public dateBidEnd: Date;
    public notificationId: Guid;
    public notificationDescription: string;
    public avatar: boolean;
    public statusId: Guid;
    public statusDescription: string;
    public review: number;
    public reviewCount: number;
    public bidCount: number;
    public userIdAccepted: Guid;
    public userIdLoaded: Guid;
    public userIdLoadedConfirmed: Guid;
    public userIdDelivered: Guid;
    public userIdDeliveredConfirmed: Guid;

    public bid: bid[];
}