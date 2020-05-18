import { Component, OnInit } from '@angular/core';
import { RandomService } from 'src/app/services/random.service';
import { RecordService } from 'src/app/services/record.service';
import { ActivatedRoute } from '@angular/router';
import { Country } from 'src/app/classes/country';

@Component({
  selector: 'app-quizz-places',
  templateUrl: './quizz-places.component.html',
  styleUrls: ['./quizz-places.component.scss'],
})
export class QuizzPlacesComponent implements OnInit {
  public manche: number = 1; // représente le nombre de la manche actuelle du quizz
  public questions: any[] = []; // représente les questions du quizz
  public questionCourrante: any = null; // la question courrante du quizz
  public reponses: any[] = []; // les reponses à la question courrante
  public bonneReponses: number; // le nombre de bonnes réponses du joueur dans la partie
  public repondu: boolean = false; // représente le fait que le joueur a répondu à la question ou non
  public correct: boolean; // représente une bonne réponse ou non du joueur à la réponse courrante
  public difficulte: number;

  constructor(private _randomService: RandomService, private _recordService: RecordService, private route: ActivatedRoute) {
    // on récupère les paramètres dans la route 
    route.params.subscribe(params => {
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
    this.manche = 1;
    console.log(this.manche);
    
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
      // on prend des pays au hasard
      this.reponses = this._randomService.randomCountries(result.facets[0].facets, this.difficulte - 1);

      // on ajoute la bonne réponse
      let reponseJuste = new Country();
      reponseJuste.value = this.questionCourrante.record.fields.states[0];
      this.reponses.push(reponseJuste);

      // on mélange le tableau de réponses
      this._randomService.melangeTableau(this.reponses);
      console.log('reponse =>', this.reponses);
    })
  }

}
