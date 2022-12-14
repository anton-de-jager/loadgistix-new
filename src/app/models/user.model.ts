import { Guid } from "guid-typescript";
// import { Establishment } from "./establishment.model";
// import { LogPromotion } from "./logPromotion.model";
// import { Review } from "./review.model";

export class User {
    id: Guid;
    name: string;
    surname: string;
    email: string;
    phone: string;
    urlImage: string;
    statusId: Guid;
    // review: Review[];
    // establishment: Establishment[];
    // logPromotion: LogPromotion[];

    constructor(
        id: Guid,
        name: string,
        surname: string,
        email: string,
        phone: string,
        urlImage: string,
        // review: Review[],
        // establishment: Establishment[],
        // logPromotion: LogPromotion[]
    ) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.phone = phone;
        this.urlImage = urlImage;
        // this.review = review;
        // this.establishment = establishment;
        // this.logPromotion = logPromotion;
    }
}