import { Guid } from "guid-typescript";
import { loadCategory } from "./loadCategory.model";

export class loadType {
    constructor(
        id: Guid,
        loadCategoryId: Guid,
        loadCategoryDescription: string,
        description: string,
        liquid: boolean,
        loadCategory: loadCategory
    ) {
        this.id = id;
        this.loadCategoryId = loadCategoryId;
        this.loadCategoryDescription = loadCategoryDescription;
        this.description = description;
        this.liquid = liquid;
        this.loadCategory = loadCategory;
    }
    public id: Guid;
    public loadCategoryId: Guid;
    public description: string;
    public loadCategoryDescription: string;
    public liquid: boolean;
    public loadCategory: loadCategory;
}