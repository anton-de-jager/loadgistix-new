import { Component, OnInit, AfterViewInit, Inject, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs';
import { load } from '../../models/load.model';
import { directory } from '../../models/directory.model';

const iconRetinaUrl = 'assets/images/leaflet/marker-icon-2x.png';
const iconUrl = 'assets/images/leaflet/location_green.png';
const shadowUrl = 'assets/images/leaflet/marker-shadow.png';
const iconDefault = L.icon({
    iconRetinaUrl,
    iconUrl: 'assets/images/leaflet/location_green.png',
    shadowUrl,
    iconSize: [33, 43],
    iconAnchor: [16, 43],
    shadowAnchor: [12, 53],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [43, 53]
});
const iconFrom = L.icon({
    iconRetinaUrl,
    iconUrl: 'assets/images/leaflet/truck_green.png',
    shadowUrl,
    iconSize: [33, 33],
    iconAnchor: [16, 33],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [33, 33]
});
const iconTo = L.icon({
    iconRetinaUrl,
    iconUrl: 'assets/images/leaflet/location_red.png',
    shadowUrl,
    iconSize: [23, 32],
    iconAnchor: [12, 32],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [32, 32]
});

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, AfterViewInit, OnChanges {
    private map: L.Map;
    @Input() lat: number = -26.3296247;
    @Input() lon: number = 28.1045642;
    @Input() label: string = '';
    @Input() loadsAvailable: load[] = [];
    @Input() directoryList: directory[] = [];

    @Output() select: EventEmitter<any> = new EventEmitter<any>();

    mapReady: boolean = false;

    constructor(
        private _snackBar: MatSnackBar
    ) {

    }

    private initMap(): void {
        if (this.map) {
            this.map.off();
            this.map.remove();
        }

        this.map = L.map('map', {
            center: [this.lat, this.lon],
            zoom: 14
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 3,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        const planOptions: L.Routing.PlanOptions = {
            addWaypoints: false,
            draggableWaypoints: false,
            createMarker: function () { return null; },
            createGeocoderElement: function () { return null; },
            createGeocoder: function () { return null; }
        };

        var minlat = 200, minlon = 200, maxlat = -200, maxlon = -200;
        this.loadsAvailable.forEach(loadItem => {
            let plan = new L.Routing.Plan([new L.LatLng(loadItem.originatingAddressLat, loadItem.originatingAddressLon), new L.LatLng(loadItem.destinationAddressLat, loadItem.destinationAddressLon)], planOptions);

            let control = L.Routing.control({
                router: L.Routing.osrmv1({
                    serviceUrl: `http://router.project-osrm.org/route/v1/`
                }),
                collapsible: false,
                showAlternatives: false,
                fitSelectedRoutes: false,
                show: false,
                routeWhileDragging: false,
                plan
            });
            control.addTo(this.map).getContainer().style.display = "None";

            if (minlat > loadItem.originatingAddressLat) minlat = loadItem.originatingAddressLat;
            if (minlon > loadItem.originatingAddressLon) minlon = loadItem.originatingAddressLon;
            if (maxlat < loadItem.originatingAddressLat) maxlat = loadItem.originatingAddressLat;
            if (maxlon < loadItem.originatingAddressLon) maxlon = loadItem.originatingAddressLon;

            if (minlat > loadItem.destinationAddressLat) minlat = loadItem.destinationAddressLat;
            if (minlon > loadItem.destinationAddressLon) minlon = loadItem.destinationAddressLon;
            if (maxlat < loadItem.destinationAddressLat) maxlat = loadItem.destinationAddressLat;
            if (maxlon < loadItem.destinationAddressLon) maxlon = loadItem.destinationAddressLon;

            L.marker(new L.LatLng(loadItem.originatingAddressLat, loadItem.originatingAddressLon), { icon: iconFrom }).addTo(this.map).on('click', () => {
                this.select.emit(loadItem);
            });
            L.marker(new L.LatLng(loadItem.destinationAddressLat, loadItem.destinationAddressLon), { icon: iconTo }).addTo(this.map).on('click', () => {
                this.select.emit(loadItem);
            });
        });

        this.directoryList.forEach(loadItem => {
            if (minlat > loadItem.addressLat) minlat = loadItem.addressLat;
            if (minlon > loadItem.addressLon) minlon = loadItem.addressLon;
            if (maxlat < loadItem.addressLat) maxlat = loadItem.addressLat;
            if (maxlon < loadItem.addressLon) maxlon = loadItem.addressLon;

            L.marker(new L.LatLng(loadItem.addressLat, loadItem.addressLon), { icon: iconDefault }).addTo(this.map).on('click', () => {
                this.select.emit(loadItem);
            });
        });

        setTimeout(() => {
            this.map.fitBounds(L.latLngBounds(new L.LatLng(minlat, minlon), new L.LatLng(maxlat, maxlon)))
        }, 100);
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.mapReady = true;
    }

    ngOnChanges() {
        if (this.mapReady) {
            this.initMap();
        } else {
            setTimeout(() => {
                this.initMap();
            }, 100);
        }
    }
}