import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { ApplicationsComponent } from "./applications/applications.component";

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'search', component: SearchResultsComponent },
      { path: 'applications', component: ApplicationsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
