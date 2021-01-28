import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {icon, latLng, LayerGroup, LeafletEvent, LeafletMouseEvent, Map, MapOptions, Marker, marker, tileLayer} from 'leaflet';
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder';

import * as ELG from 'esri-leaflet-geocoder';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  address: string;
  marker;


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

  constructor() {
  }

  ngOnInit() {
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
          results.addLayer(marker(data.results[i].latlng));
        }
      })
      .addTo(this.map);
  }

  onMapZoomEnd(e: LeafletEvent) {
    this.zoom = e.target.getZoom();
    this.zoom$.emit(this.zoom);
  }

  onMapClick(e: LeafletMouseEvent) {
    // if (sessionStorage.getItem('JWT')) {
    new ELG.ReverseGeocode().latlng(e.latlng).run((error, result) => {
      if (error) {
        console.log();
        return;
      }
      if (this.marker && this.map.hasLayer(this.marker))
        this.map.removeLayer(this.marker);
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
    // }
  }

  search() {
    return;
  }
}
