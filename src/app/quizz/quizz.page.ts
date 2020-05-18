import { Component, OnInit } from '@angular/core';
import { RandomService } from '../services/random.service';
import { RecordService } from '../services/record.service';
import { Country } from '../classes/country';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.page.html',
  styleUrls: ['./quizz.page.scss'],
})
export class QuizzPage implements OnInit {
  public manche: number; // représente le nombre de la manche actuelle du quizz
  public questions: any[] = []; // représente les questions du quizz
  public questionCourrante: any = null; // la question courrante du quizz
  public reponses: any[] = []; // les reponses à la question courrante
  public bonneReponses: number; // le nombre de bonnes réponses du joueur dans la partie
  public repondu: boolean = false; // représente le fait que le joueur a répondu à la question ou non
  public correct: boolean; // représente une bonne réponse ou non du joueur à la réponse courrante

  constructor(private _randomService: RandomService, private _recordService: RecordService) { }

  ngOnInit() {
   this.initValues();
  }

  initValues(): void {
    this.manche = 1;
    this.bonneReponses = 0;
    this.repondu = false;
    this._recordService.getRecords().subscribe(result => {
      this.questions = this._randomService.randomRecords(result.records, 10);
      this.questionCourrante = this.questions[0];
      console.log('questions =>', this.questions);
      console.log('questions courrante =>', this.questionCourrante);
      this.generateReponses();
    });
  }

  validate(reponse) {
    console.log(reponse);
    this.repondu = true;
    if (this.questionCourrante.record.fields.states.indexOf(reponse) >= 0) {
      this.bonneReponses++;
      this.correct = true;
    }
    else {
      this.correct = false;
    }
  }

  nextRound(): void {
    this.manche++;
    if (this.manche < 10) {
      this.questionCourrante = this.questions[this.manche - 1];
      this.generateReponses();
      this.repondu = false;
    }
  }

  /**
   * Permet de générer les réponses à la question courrante
   */
  generateReponses(): void {
    //on récupère les pays
    this._recordService.getCountries().subscribe(result => {
      // on prend 3 pays au hasard
      this.reponses = this._randomService.randomCountries(result.facets[0].facets, 3);

      // on ajoute la bonne réponse
      let reponseJuste = new Country();
      reponseJuste.value = this.questionCourrante.record.fields.states[0];
      this.reponses.push(reponseJuste);

      // on mélange le tableau de réponses
      this.melangeTableau(this.reponses);
      console.log('reponse =>', this.reponses);
    })
  }

  /**
   * Permet de mélanger les éléments d'un tableau
   * @param array le tableau à mélanger
   */
  melangeTableau(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

}
