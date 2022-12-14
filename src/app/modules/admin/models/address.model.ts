export class address {
    constructor(
        lat: number,
        lon: number,
        label: string,
    ) {
        this.lat = lat;
        this.lon = lon;
        this.label = label;
    }
    public lat: number;
    public lon: number;
    public label: string;
}