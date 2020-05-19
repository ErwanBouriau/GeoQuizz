import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/classes/country';
import { RandomService } from 'src/app/services/random.service';
import { RecordService } from 'src/app/services/record.service';
import { ActivatedRoute } from '@angular/router';
import { isDeepStrictEqual } from 'util';

@Component({
  selector: 'app-quizz-countries',
  templateUrl: './quizz-countries.component.html',
  styleUrls: ['./quizz-countries.component.scss'],
})
export class QuizzCountriesComponent implements OnInit {
  public manche: number; // représente le nombre de la manche actuelle du quizz
  public questions: any[] = []; // représente les questions du quizz
  public questionCourrante: any = null; // la question courrante du quizz
  public reponses: any[] = []; // les reponses à la question courrante
  public reponsesCorrectes: any[] = []; // les reponses à la question courrante
  public reponsesJoueur: any[] = []; // les réponses du joueur à la question courante
  public bonneReponses: number; // le nombre de bonnes réponses du joueur dans la partie
  public repondu: boolean = false; // représente le fait que le joueur a répondu à la question ou non
  public correct: boolean; // représente une bonne réponse ou non du joueur à la réponse courrante
  public difficulte: number;

  constructor(private _randomService: RandomService, private _recordService: RecordService, private route: ActivatedRoute) {
    // on récupère les paramètres dans la route 
    route.queryParams.subscribe(params => {
      if (params.difficulty) this.difficulte = params.difficulty;
      else this.difficulte = 5;
    })
   }

  ngOnInit() {}
  
  ionViewWillEnter() {
    this.initValues();
  }

  /**
   * Met en place un quiz sur les lieux (deviner le pays ou se trouve le lieu)
   */
  initValues(): void {
    this.manche = 0;
    this.bonneReponses = 0;
    this.repondu = false;
    this._recordService.getCountries().subscribe(result => {
      this.questions = this._randomService.randomCountries(result.facets[0].facets, 10);
      this.questionCourrante = this.questions[0];
      console.log('questions =>', this.questions);
      console.log('questions courrante =>', this.questionCourrante);
      this.generateReponses();
    });
  }

  validate() {
    this.repondu = true;
    console.log('rep juste =>', this.reponsesCorrectes);
	  console.log('rep joueur =>', this.reponsesJoueur);
	
    const containsAll = (arr1, arr2) => arr2.every(arr2Item => arr1.includes(arr2Item))
    const sameMembers = (arr1, arr2) => containsAll(arr1, arr2) && containsAll(arr2, arr1);
    const valide = sameMembers(this.reponsesCorrectes, this.reponsesJoueur); 
    
    if (valide) {
      this.bonneReponses++;
      this.correct = true;
    }
    else {
      this.correct = false;
    }
  }

  nextRound(): void {
    this.manche++;
    if (this.manche <= 10) {
      this.questionCourrante = this.questions[this.manche];
      this.generateReponses();
      this.repondu = false;
      this.reponsesJoueur = [];
    }
  }

  /**
   * Permet de générer les réponses à la question courrante
   */
  generateReponses(): void {
    //on récupère les records
    this._recordService.getRecords().subscribe(result => {
      let nbReponsesJustes = Math.floor(Math.random() * (this.difficulte - 3)) + 1;

      // on prend des records au hasard
      this.reponses = this._randomService.randomRecords(result.records, this.difficulte - nbReponsesJustes);
      // on ajoute des réponses justes
      this._recordService.getRecordsByCountry(this.questionCourrante.value).subscribe(result => {
      this.reponsesCorrectes = this._randomService.randomRecords(result.records, nbReponsesJustes);
      this.reponses = this.reponses.concat(this.reponsesCorrectes);
      })
      // on mélange le tableau de réponses
      this._randomService.melangeTableau(this.reponses);
      console.log('reponse =>', this.reponses);
    })
  }

  ajoutReponse(event, reponse) {
    const classList = event.target.classList;
    const classes = event.target.className;
    if (classes.includes('clicked')) {
      classList.remove('clicked') 
      this.reponsesJoueur.splice(this.reponsesJoueur.indexOf(reponse), 1);
    } else {
      classList.add('clicked');
      this.reponsesJoueur.push(reponse);
    }
  }
}
