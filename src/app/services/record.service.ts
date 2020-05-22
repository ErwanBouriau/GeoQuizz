import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private allRecords: any[] = [];

  constructor(private http: HttpClient, private storage: StorageService) { }

  public getRecordById(id: string): Observable<any> {
    return this.http.get('https://data.opendatasoft.com/api/v2/catalog/datasets/world-heritage-list%40public-us/records/' + id);
  }
  
  public getRecords(rows: number = 100): Observable<any> {
    return this.http.get('https://data.opendatasoft.com/api/v2/catalog/datasets/world-heritage-list%40public-us/records?rows=' + rows);
  }

  public getRecordsByCountry(country: string): Observable<any> {
    return this.http.get('https://data.opendatasoft.com/api/v2/catalog/datasets/world-heritage-list%40public-us/records?refine=states%3A' + country + '&rows=100');
  }

  public getCountries(): Observable<any> {
    return this.http.get('https://data.opendatasoft.com/api/v2/catalog/datasets/world-heritage-list%40public-us/facets?facet=states');
  }

  public getImage(id: string) {
    const headers = new HttpHeaders().set("Origin", "*");
      this.http.get('https://cors-anywhere.herokuapp.com/https://whc.unesco.org/en/list/124/gallery/&maxrows=1', {headers}).subscribe(
        data => console.log('success', data),
        error => {
          console.log('oops', error.error.text);
        var el = document.createElement( 'html' );
    el.innerHTML = error.error.text;
    let imgs = el.getElementsByClassName('icaption-img');
    for (let k = 0; k < imgs.length; k++) {
        console.log(imgs[k].getAttribute('data-src'));
    }
  }
      );
  }



  public getAllRecords(): void {
    for (let i = 0; i <= 11; i++) {
      this.http.get('https://data.opendatasoft.com/api/v2/catalog/datasets/world-heritage-list@public-us/records?start='+ i*100 + '&rows=100').subscribe((result:any) => {
        this.allRecords = this.allRecords.concat(result.records);
        this.storage.store('records', this.allRecords);
      });
    }
  }

  public getAllCountries(): void {
    this.http.get('https://data.opendatasoft.com/api/v2/catalog/datasets/world-heritage-list%40public-us/facets?facet=states').subscribe((result:any) => {
      this.storage.store('countries', result.facets[0].facets);
    })
  }

  
}
