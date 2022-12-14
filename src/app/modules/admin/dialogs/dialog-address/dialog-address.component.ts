import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { address } from '../../models/address.model';

const iconRetinaUrl = 'assets/images/leaflet/marker-icon-2x.png';
const iconUrl = 'assets/images/leaflet/location_green.png';
const shadowUrl = 'assets/images/leaflet/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl: 'assets/images/leaflet/location_green.png',
  shadowUrl,
  iconSize: [23, 33],
  iconAnchor: [16, 33],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [33, 33]
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
  selector: 'app-address',
  templateUrl: './dialog-address.component.html',
  styleUrls: ['./dialog-address.component.scss']
})
export class DialogAddressComponent implements OnInit, AfterViewInit {
  private map: L.Map;
  location: address = { lat: 28.1045642, lon: -26.3296247, label: '' };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAddressComponent>) {
    if (data) {
      this.location.lat = data.lat;
      this.location.lon = data.lon;
      this.location.label = data.label;
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.initAutocomplete();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.location.lat, this.location.lon],
      zoom: 14
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    L.marker(new L.LatLng(this.location.lat, this.location.lon), { icon: iconDefault }).addTo(this.map);
  }

  initAutocomplete() {
    const input = document.getElementById("pac-input") as HTMLInputElement;
    var options = {
      componentRestrictions: { country: 'za' }
    };
    const searchBox = new google.maps.places.Autocomplete(input, options);

    searchBox.addListener("place_changed", () => {
      const place = searchBox.getPlace();
      
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        this.location.lat = place.geometry.location.lat();
        this.location.lon = place.geometry.location.lng();
        this.location.label = place.formatted_address;

        L.marker(new L.LatLng(this.location.lat, this.location.lon), { icon: iconDefault }).addTo(this.map);

        setTimeout(() => {
          this.map.fitBounds(L.latLngBounds(new L.LatLng(this.location.lat, this.location.lon), new L.LatLng(this.location.lat, this.location.lon)))
        }, 100);
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
  submit(): void {
    this.dialogRef.close(this.location);
  }
}
