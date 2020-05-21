import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /**
   * Stock un élément dans le storage
   * @param key la clé dans le storage
   * @param value la valeur a stocker
   */
  store(key: string, value: any[]): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * récupère un élément du storage
   * @param key 
   */
  getItem(key: string): any {
    return JSON.parse(localStorage.getItem(key));
  }

  /**
   * Supprime toute les valeurs du storage
   */
  clear(): void {
    localStorage.clear();
  }

  /**
   * Supprime la valeur dans le storage
   * @param key la clé de la valeur à supprimer
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Renvoi vrai si le storage est vide
   */
  isEmpty(): boolean {
    return localStorage.length === 0;
  }

  /**
   * Renvoi vrai si la clé existe
   * @param key la clé à vérifier
   */
  exist(key: string): boolean {
    return localStorage.getItem(key) != null;
  }
}
