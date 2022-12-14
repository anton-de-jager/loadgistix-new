import { Guid } from "guid-typescript";
import { vehicleCategory } from "./vehicleCategory.model";

export class vehicleType {
    constructor(
        id: Guid,
        vehicleCategoryId: Guid,
        vehicleCategoryDescription: string,
        description: string,
        liquid: boolean,
        vehicleCategory: vehicleCategory
    ) {
        this.id = id;
        this.vehicleCategoryId = vehicleCategoryId;
        this.vehicleCategoryDescription = vehicleCategoryDescription;
        this.description = description;
        this.liquid = liquid;
        this.vehicleCategory = vehicleCategory;
    }
    public id: Guid;
    public vehicleCategoryId: Guid;
    public vehicleCategoryDescription: string;
    public description: string;
    public liquid: boolean;
    public vehicleCategory: vehicleCategory;
}