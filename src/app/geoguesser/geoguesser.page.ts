import { Component, OnInit } from '@angular/core';
import { Map, tileLayer} from "leaflet";
import { RandomService } from '../services/random.service';
import { StorageService } from '../services/storage.service';

declare var L: any;

@Component({
  selector: 'app-geoguesser',
  templateUrl: './geoguesser.page.html',
  styleUrls: ['./geoguesser.page.scss'],
})
export class GeoguesserPage implements OnInit {
  map: Map;
  record: any;
  lat: any;
  lon: any;
  btn: boolean = false;
  afficheScore: boolean = false;
  score: number = 4000;
  scoreTotal: number = 0;
  distance: number;
  round: number = 1;
  marker: any;
  markerRecord: any;
  ligne: any;
  icon: any = L.icon({
    iconUrl: 'assets/icon/leaf-green.png',
    shadowUrl: 'assets/icon/leaf-shadow.png',

    iconSize:     [30, 75], // size of the icon
    shadowSize:   [40, 54], // size of the shadow
    iconAnchor:   [20, 75], // point of the icon which will correspond to marker's location
    shadowAnchor: [8, 60],  // the same for the shadow
  });

  constructor(private randomService: RandomService, private _storageService: StorageService) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.showMap();

    this.randomRecord();

    this.map.on('click', (e)=>{this.onMapClick(e)});
  }

  valider() {
    this.markerRecord = L.marker([this.lat, this.lon]).addTo(this.map);
    var pointUser = new L.LatLng(this.marker.getLatLng().lat, this.marker.getLatLng().lng);
    var pointReponse = new L.LatLng(this.lat, this.lon);
    var pointList = [pointUser, pointReponse];

    this.ligne = new L.Polyline(pointList, {
        color: 'red',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
    });
    this.ligne.addTo(this.map);
    this.distance = this.calculateDistance(this.marker.getLatLng().lat, this.marker.getLatLng().lng, this.lat, this.lon);
    this.score -= this.distance;
    this.distance = Math.round(this.distance);
    this.score = Math.round(this.score);
    if(this.score < 0) this.score = 0;
    this.btn = false;
    this.afficheScore = true;
  }

  randomRecord() {
    this.record = this.randomService.randomRecord(this._storageService.getItem('records'));
    this.lat = this.record.record.fields.coordinates.lat;
    this.lon = this.record.record.fields.coordinates.lon;
  }

  onMapClick(e) {
    if(!this.afficheScore) {
      this.btn = true;
      if(this.marker != null) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker([e.latlng.lat, e.latlng.lng], {icon: this.icon}).addTo(this.map);
    }
  }

  showMap() {
    this.map = new Map('map').setView([46.878309, 3.273513], 5);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  }

  suivant() {
    this.round += 1;
    this.afficheScore = false;
    this.scoreTotal += this.score;
    this.score = 4000;
    this.map.removeLayer(this.marker);
    this.map.removeLayer(this.markerRecord);
    this.map.removeLayer(this.ligne);
    this.randomRecord();
  }

  rejouer() {
    window.location.reload();
  }

  calculateDistance(lat1:number, long1:number, lat2:number, long2:number){
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    return dis;
  }
}
