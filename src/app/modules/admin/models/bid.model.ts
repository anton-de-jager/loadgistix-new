import { Guid } from "guid-typescript";
import { load } from "./load.model";
import { status } from "./status.model";

export class bid {
    constructor(
        id: Guid,
        userId: Guid,
        userCompany: string,
        userDescription: string,
        loadId: Guid,
        loadDescription: string,
        loadUserId: Guid,
        loadLoadTypeId: Guid,
        loadLoadTypeDescription: string,
        loadNote: string,
        loadPrice: number,
        loadOriginatingAddressLabel: string,
        loadOriginatingAddressLat: number,
		loadOriginatingAddressLon: number,
		loadDestinationAddressLabel: string,
		loadDestinationAddressLat: number,
		loadDestinationAddressLon: number,
        loadItemCount: number,
		loadWeight: number,
		loadLength: number,
		loadWidth: number,
		loadHeight: number,
		loadTotalValue: number,
		loadDateOut: Date,
		loadDateIn: Date,
		loadDateBidEnd: Date,
		loadAvatar: string,
        loadStatusId: Guid,
        loadStatusDescription: string,
        vehicleId: Guid,
        vehicleDescription: string,
        driverId: Guid,
        driverDescription: string,
        price: number,
        dateOut: Date,
        dateIn: Date,
        statusId: Guid,
        statusDescription: string,
        reviewLoad: number,
        reviewLoadCount: number,
        reviewDriver: number,
        reviewDriverCount: number,
        userIdAccepted: Guid,
        userIdLoaded: Guid,
        userIdLoadedConfirmed: Guid,
        userIdDelivered: Guid,
        userIdDeliveredConfirmed: Guid,

        status: status,
        load: load
    ) {
        this.id = id;
        this.userId = userId;
        this.userCompany = userCompany;
        this.userDescription = userDescription;
        this.loadId = loadId;
        this.loadDescription = loadDescription;
        this.loadStatusId = loadStatusId;
        this.loadStatusDescription = loadStatusDescription;
        this.vehicleId = vehicleId;
        this.vehicleDescription = vehicleDescription;
        this.driverId = driverId;
        this.driverDescription = driverDescription;
        this.price = price;
        this.dateOut = dateOut;
        this.dateIn = dateIn;
        this.loadUserId = loadUserId;
        this.loadLoadTypeId = loadLoadTypeId;
        this.loadLoadTypeDescription = loadLoadTypeDescription;
        this.loadNote = loadNote;
        this.loadPrice = loadPrice;
        this.loadOriginatingAddressLabel = loadOriginatingAddressLabel;
        this.loadOriginatingAddressLat = loadOriginatingAddressLat;
		this.loadOriginatingAddressLon = loadOriginatingAddressLon;
		this.loadDestinationAddressLabel = loadDestinationAddressLabel;
		this.loadDestinationAddressLat = loadDestinationAddressLat;
		this.loadDestinationAddressLon = loadDestinationAddressLon;
        this.loadItemCount = loadItemCount;
		this.loadWeight = loadWeight;
		this.loadLength = loadLength;
		this.loadWidth = loadWidth;
		this.loadHeight = loadHeight;
		this.loadTotalValue = loadTotalValue;
		this.loadDateOut = loadDateOut;
		this.loadDateIn = loadDateIn;
		this.loadDateBidEnd = loadDateBidEnd;
		this.loadAvatar = loadAvatar;
        this.statusId = statusId;
        this.statusDescription = statusDescription
        this.reviewLoad = reviewLoad;
        this.reviewLoadCount = reviewLoadCount;
        this.reviewDriver = reviewDriver;
        this.reviewDriverCount = reviewDriverCount;
        this.userIdAccepted = userIdAccepted;
        this.userIdLoaded = userIdLoaded;
        this.userIdLoadedConfirmed = userIdLoadedConfirmed;
        this.userIdDelivered = userIdDelivered;
        this.userIdDeliveredConfirmed = userIdDeliveredConfirmed;

        this.status = status;
        this.load = load;
    }
    public id: Guid;
    public userId: Guid;
    public userCompany: string;
    public userDescription: string;
    public loadId: Guid;
    public loadDescription: string;
    public loadUserId: Guid;
    public loadLoadTypeId: Guid;
    public loadLoadTypeDescription: string;
    public loadNote: string;
    public loadPrice: number;
    public loadOriginatingAddressLabel: string;
    public loadOriginatingAddressLat: number;
    public loadOriginatingAddressLon: number;
    public loadDestinationAddressLabel: string;
    public loadDestinationAddressLat: number;
    public loadDestinationAddressLon: number;
    public loadItemCount: number;
    public loadWeight: number;
    public loadLength: number;
    public loadWidth: number;
    public loadHeight: number;
    public loadTotalValue: number;
    public loadDateOut: Date;
    public loadDateIn: Date;
    public loadDateBidEnd: Date;
    public loadAvatar: string
    public loadStatusId: Guid;
    public loadStatusDescription: string;
    public vehicleId: Guid;
    public vehicleDescription: string;
    public driverId: Guid;
    public driverDescription: string;
    public price: number;
    public dateOut: Date;
    public dateIn: Date;
    public statusId: Guid;
    public statusDescription: string;
    public reviewLoad: number;
    public reviewLoadCount: number;
    public reviewDriver: number;
    public reviewDriverCount: number;
    public userIdAccepted: Guid;
    public userIdLoaded: Guid;
    public userIdLoadedConfirmed: Guid;
    public userIdDelivered: Guid;
    public userIdDeliveredConfirmed: Guid;

    public status: status;
    public load: load;
}