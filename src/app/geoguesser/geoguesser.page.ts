import { Component, OnInit } from '@angular/core';
import { Map, tileLayer} from "leaflet";
import { RandomService } from '../services/random.service';
import { StorageService } from '../services/storage.service';
import { RecordService } from '../services/record.service';

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
    iconUrl: 'assets/icon/marker-orange.png',

    iconSize:     [30, 50], // size of the icon
    iconAnchor:   [16, 50], // point of the icon which will correspond to marker's location
  });
  zoom: boolean = true;
  loading: boolean = true;
  imageUrl: string = '';

  constructor(private randomService: RandomService, private _recordService: RecordService, private _storageService: StorageService) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.showMap();

    this.randomRecord();

    this.map.on('click', (e)=>{this.onMapClick(e)});
  }

  valider() {
    this.markerRecord = L.marker([this.lat, this.lon]).addTo(this.map);
    this.map.flyTo(L.latLng(this.lat, this.lon), 5);
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
    if(this.score > 3985) this.score = 4000;
    this.btn = false;
    this.afficheScore = true;
    this.zoom = false;
  }

  randomRecord() {
    this.record = this.randomService.randomRecord(this._storageService.getItem('records'));
    this.lat = this.record.record.fields.coordinates.lat;
    this.lon = this.record.record.fields.coordinates.lon;
    this.loadImage(this.record.record.fields.id_number);
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
    var southWest = L.latLng(-88.78704664025176, -251.74770753818228),
    northEast = L.latLng(88.78704664025176, 251.74770753818228),
    bounds = L.latLngBounds(southWest, northEast);
    if (!this.map) this.map = new Map('map').setView([46.714410227897154, 3.459646574278397], 3).setMaxBounds(bounds);
    tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
      noWrap: true,
      minZoom: 2,
      subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(this.map);

    //tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}').addTo(this.map);
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

  imageZoom() {
    this.zoom = !this.zoom;
  }

  loadImage(id: string) {
    // on affiche le loader
    this.loading = true;
    this.zoom = true;
    // on récupère l'image du lieu
    this._recordService.getImage(id).subscribe(
      data => console.log('success', data),
      error => {
        // on récupère la page html dans l'erreur (on attend du json sauf que c'est du html, pas réussi à changer ça)
        let domparser = new DOMParser()​​
        let doc = domparser.parseFromString(error.error.text, 'text/html')
        let imgs = doc.getElementsByClassName('icaption-img');
        this.imageUrl = 'https://whc.unesco.org' + imgs[0].getAttribute('data-src');
        // une fois l'image chargée on enlève le loader
        this.loading = false;
      });
  }

}
