import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Icon, icon, latLng, LayerGroup, LeafletEvent, LeafletMouseEvent, Map, MapOptions, Marker, marker, tileLayer} from 'leaflet';
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder';

import * as ELG from 'esri-leaflet-geocoder';
import {AddLibraryDialogComponent} from './add-library-dialog/add-library-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MapService} from '../../Services/map.service';


Icon.Default.mergeOptions({
  shadowUrl: '../assets/marker-shadow.png'
});

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  address: string;
  marker;
  foundMarker;


  @Output() map$: EventEmitter<Map> = new EventEmitter();
  @Output() zoom$: EventEmitter<number> = new EventEmitter();
  @Input() options: MapOptions = {
    layers: [tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 7,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })],
    zoom: 10,
    center: latLng(52.237049, 21.017532),
  };
  public map: Map;
  public zoom: number;

  constructor(private mapService: MapService, public dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.mapService.getAllLibraryLocations().subscribe(response =>
      response.forEach(lib => {
        new Marker([lib.latitude, lib.longitude])
          .addTo(this.map)
          .setIcon(icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/local_library-24px.svg'
          }))
          .bindPopup(lib.displayedAddress);
      }), error => this.toast(error.error));
  }

  onMapReady(map: Map) {
    this.map = map;
    this.map$.emit(map);
    this.zoom = map.getZoom();
    this.zoom$.emit(this.zoom);
    this.map.doubleClickZoom.disable();
    const searchControl = new ELG.Geosearch();

    const results = new LayerGroup().addTo(this.map);

    searchControl
      .on('results', (data) => {
        results.clearLayers();
        for (let i = data.results.length - 1; i >= 0; i--) {
          this.foundMarker = marker(data.results[i].latlng)
            .bindPopup(data.results[i].text);
          results.addLayer(this.foundMarker);
        }
      })
      .addTo(this.map);
  }

  onMapZoomEnd(e: LeafletEvent) {
    this.zoom = e.target.getZoom();
    this.zoom$.emit(this.zoom);
  }

  onMapClick(e: LeafletMouseEvent) {
    new ELG.ReverseGeocode().latlng(e.latlng).run((error, result) => {
      if (error) {
        console.log();
        return;
      }
      if (this.marker && this.map.hasLayer(this.marker)) {
        this.map.removeLayer(this.marker);
      }
      this.marker = new Marker(result.latlng)
        .addTo(this.map)
        .setIcon(icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: 'assets/pin.svg'
        }))
        .bindPopup(result.address.Match_addr)
        .openPopup();
    });
  }

  openAddLibrary(): void {
    const dialogRef = this.dialog.open(AddLibraryDialogComponent, {
      width: '350px',
    });
  }

  toast(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }
}
