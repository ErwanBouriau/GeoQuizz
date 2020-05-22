import { Component, OnInit } from '@angular/core';
import { RandomService } from 'src/app/services/random.service';
import { ActivatedRoute } from '@angular/router';
import { Country } from 'src/app/classes/country';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-quizz-duel',
  templateUrl: './quizz-duel.component.html',
  styleUrls: ['./quizz-duel.component.scss'],
})
export class QuizzDuelComponent implements OnInit {
  public manche: number; // représente le nombre de la manche actuelle du quizz
  public tourJoueur: number = 1 | 2; // le numéro du joueur qui joue
  public questions: any[] = []; // représente les questions du quizz
  public questionCourrante: any = null; // la question courrante du quizz
  public reponses: any[] = []; // les reponses à la question courrante
  public scoreJ1: number; // le nombre de bonnes réponses du joueur 1 dans la partie
  public scoreJ2: number; // le nombre de bonnes réponses du joueur 2 dans la partie
  public difficulte: number;

  constructor(private _randomService: RandomService, private _storageService: StorageService, private route: ActivatedRoute) {
    // on récupère les paramètres dans la route 
    route.queryParams.subscribe(params => {
      if (params.difficulty) this.difficulte = params.difficulty;
      else this.difficulte = 4;
    })
   }

  ngOnInit() {
    this.initValues();
  }

   /**
   * Met en place un quiz sur les lieux (deviner le pays ou se trouve le lieu)
   */
  initValues(): void {
    this.manche = 0;
    this.scoreJ1 = 0;
    this.scoreJ2 = 0;
    this.tourJoueur = 1;
    this.questions = this._randomService.randomRecords(this._storageService.getItem('records'), 10);
    this.questionCourrante = this.questions[0];
    console.log('questions =>', this.questions);
    console.log('questions courrante =>', this.questionCourrante);
    this.generateReponses();
  }

  validate(reponse) {
    if (this.tourJoueur === 1) {
      if (this.questionCourrante.record.fields.states.indexOf(reponse) >= 0) {
        this.scoreJ1++;
      }
      this.nextRound(1);
    }
    else {
      if (this.questionCourrante.record.fields.states.indexOf(reponse) >= 0) {
        this.scoreJ2++;
      }
      this.nextRound(2);
    }

  }

  nextRound(joueur: number): void {
    if (joueur === 1) {
      this.tourJoueur = 2;
    }
    else {
      this.manche++;
      if (this.manche < 10) {
        this.questionCourrante = this.questions[this.manche];
        this.generateReponses();
        this.tourJoueur = 1;
      }
    }
  }

  /**
   * Permet de générer les réponses à la question courrante
   */
  generateReponses(): void {
      // on prend des pays au hasard
      this.reponses = this._randomService.randomCountries(this._storageService.getItem('countries'), this.difficulte - 1);

      // on ajoute la bonne réponse
      let reponseJuste = new Country();
      reponseJuste.value = this.questionCourrante.record.fields.states[0];
      this.reponses.push(reponseJuste);

      // on mélange le tableau de réponses
      this._randomService.melangeTableau(this.reponses);
      console.log('reponse =>', this.reponses);
  }

}
