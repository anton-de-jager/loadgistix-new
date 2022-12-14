import { Guid } from "guid-typescript";

export class vehicle {
    constructor(
        id: Guid,
        userId: Guid,
        userDescription: string,
        vehicleCategoryId: Guid,
        vehicleCategoryDescription: string,
        vehicleTypeId: Guid,
        vehicleTypeDescription: string,
        description: string,
        registrationNumber: string,
        maxLoadWeight: number,
        maxLoadHeight: number,
        maxLoadWidth: number,
        maxLoadLength: number,
        maxLoadVolume: number,
        availableCapacity: number,
        availableFrom: Date,
        availableTo: Date,
        originatingAddressLabel: string,
        originatingAddressLat: number,
        originatingAddressLon: number,
        destinationAddressLabel: string,
        destinationAddressLat: number,
        destinationAddressLon: number,
        avatar: boolean,
        statusId: Guid,
        statusDescription: string
    ) {
        this.id = id;
        this.userId = userId;
        this.userDescription = userDescription;
        this.vehicleCategoryId = vehicleCategoryId;
        this.vehicleCategoryDescription = vehicleCategoryDescription;
        this.vehicleTypeId = vehicleTypeId;
        this.vehicleTypeDescription = vehicleTypeDescription;
        this.description = description;
        this.registrationNumber = registrationNumber;
        this.maxLoadWeight = maxLoadWeight;
        this.maxLoadHeight = maxLoadHeight;
        this.maxLoadWidth = maxLoadWidth;
        this.maxLoadLength = maxLoadLength;
        this.maxLoadVolume = maxLoadVolume;
        this.availableCapacity = availableCapacity;
        this.availableFrom = availableFrom;
        this.availableTo = availableTo;
        this.originatingAddressLabel = originatingAddressLabel;
        this.originatingAddressLat = originatingAddressLat;
        this.originatingAddressLon = originatingAddressLon;
        this.destinationAddressLabel = destinationAddressLabel;
        this.destinationAddressLat = destinationAddressLat;
        this.destinationAddressLon = destinationAddressLon;
        this.avatar = avatar;
        this.statusId = statusId;
        this.statusDescription = statusDescription
    }
    public id: Guid;
    public userId: Guid;
    public userDescription: string;
    public vehicleCategoryId: Guid;
    public vehicleCategoryDescription: string;
    public vehicleTypeId: Guid;
    public vehicleTypeDescription: string;
    public description: string;
    public registrationNumber: string;
    public maxLoadWeight: number;
    public maxLoadHeight: number;
    public maxLoadWidth: number;
    public maxLoadLength: number;
    public maxLoadVolume: number;
    public availableCapacity: number;
    public availableFrom: Date;
    public availableTo: Date;
    public originatingAddressLabel: string;
    public originatingAddressLat: number;
    public originatingAddressLon: number;
    public destinationAddressLabel: string;
    public destinationAddressLat: number;
    public destinationAddressLon: number;
    public avatar: boolean;
    public statusId: Guid;
    public statusDescription: string;
}