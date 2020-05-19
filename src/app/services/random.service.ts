import { Injectable } from '@angular/core';
import { Country } from '../classes/country';

@Injectable({
  providedIn: 'root'
})
export class RandomService {

  constructor() { }

  /**
   * Renvoie un pays aléatoire
   * @param countries un tableau de pays
   */
  public randomCountry(countries: Country[]): Country {
    return countries[Math.floor(Math.random() * countries.length)];
  }

  /**
   * Renvoie un tableau de pays aléatoires
   * @param countries un tableau de pays
   * @param size la taille du tableau à renvoyer
   */
  public randomCountries(countries: Country[], size: number = 1): Country[] {
    let result: Country[] = [];

    for (let i = 1; i <= size; i++) {
      const country = countries[Math.floor(Math.random() * countries.length)];
      if (result.indexOf(country) < 0) {
        result.push(country);
      }
      else {
        i--;
      }
    }

    return result;
  }

  /**
   * Renvoie un lieu aléatoire
   * @param records un tableau de lieux
   */
  public randomRecord(records: any[]): any {
    return records[Math.floor(Math.random() * records.length)];
  }

   /**
   * Renvoie un tableau de lieu aléatoires
   * @param records un tableau de lieu
   * @param size la taille du tableau à renvoyer
   */
  public randomRecords(records: any[], size: number = 1): any[] {
    let result: any[] = [];

    for (let i = 1; i <= size; i++) {
      const record = records[Math.floor(Math.random() * records.length)];
      if (result.indexOf(record) < 0) {
        result.push(record);
      }
      else {
        i--;
      }
    }

    return result;
  }
  
}
