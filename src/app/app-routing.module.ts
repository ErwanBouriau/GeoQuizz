import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { QuizzPlacesComponent } from './components/quizz-places/quizz-places.component';
import { QuizzCountriesComponent } from './components/quizz-countries/quizz-countries.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'quizz',
    loadChildren: () => import('./quizz/quizz.module').then( m => m.QuizzPageModule)
  },
  {
    path: 'quizz',
    children: [
      {
        path: 'places',
        component: QuizzPlacesComponent
      },
      {
        path: 'countries',
        component: QuizzCountriesComponent
      },
    ]
  },
  {
    path: 'geoguesser',
    loadChildren: () => import('./geoguesser/geoguesser.module').then( m => m.GeoguesserPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
