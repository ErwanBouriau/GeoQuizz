import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(private http: HttpClient) { }

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


  
}
