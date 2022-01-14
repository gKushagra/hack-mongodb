import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { NewDialogComponent } from '../applications/new-dialog/new-dialog.component';
import { AuthService } from '../auth.service';
import { FilterService } from '../filter.service';
import { CSC_School, Favorite, State } from '../models';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  public results: CSC_School[];
  public resultsCount: number;
  public statesList: State[];
  private urlParams: any;
  public collegeScorecardSearchForm: FormGroup;
  public currentlyExpandedResult: string;
  public filterResultsForm: FormGroup;
  public isViewingFavorites: boolean;

  constructor(
    private apiService: ApiService,
    public filterService: FilterService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.results = [];
    this.statesList = [];
    this.resultsCount = 0;
    this.urlParams = { keyword: null };
    this.collegeScorecardSearchForm = new FormGroup({
      keyword: new FormControl(null, [Validators.required])
    });
    this.currentlyExpandedResult = null;
    this.filterResultsForm = new FormGroup({
      city: new FormControl(null),
      state: new FormControl('State'),
      major: new FormControl(null)
    });
    this.isViewingFavorites = false;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.urlParams.keyword = params['keyword'];
      console.log(this.urlParams);
      this.collegeScorecardSearchForm.patchValue(this.urlParams);
      this.apiService.getCollegeScorecardSearch(this.urlParams)
        .then((data: CSC_School[]) => {
          console.log(data);
          (data !== null && data.length > 0) ? this.results = data : null;
          this.resultsCount = data.length;
          this.filterService.setCurrentResults(data);
        });
    });
    this.getFavorites();
    console.log('finished');
    this.apiService.getStates()
      .then(data => this.statesList = data);
  }

  public collegeScorecardSearch(): void {
    console.log(this.collegeScorecardSearchForm.value);
    this.apiService.getCollegeScorecardSearch(this.collegeScorecardSearchForm.value)
      .then((data: CSC_School[]) => {
        console.log(data);
        (data !== null && data.length > 0) ? this.results = data : null;
        this.resultsCount = data.length;
        this.filterService.setCurrentResults(data);
      });
  }

  public expandResult(i: number): void {
    this.currentlyExpandedResult = this.results[i].school.name;
  }

  public collapseResult(i: number): void {
    this.currentlyExpandedResult = null;
  }

  public filterResults(): void {
    console.log(this.filterResultsForm.value);
    this.filterService.filterFromResults(this.filterResultsForm.value)
      .then(r => {
        console.log(r);
        this.results = r;
        this.resultsCount = r.length;
      });
  }

  public resetResults(): void {
    this.results = this.filterService.getCurretResults();
    this.resultsCount = this.results.length;
    this.filterService.isFilterApplied = false;
    this.filterResultsForm.patchValue({ city: null, state: 'State', major: null });
  }

  public quickAddApplication(i: number): void {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = { school: this.results[i] };
    this.dialog.open(NewDialogComponent, dialogConfig);
  }

  public alterFavorite(i: number): void {
    this.apiService.addToFavorites({
      id: this.authService.auth.user.id,
      favorite: this.results[i]
    }).then(response => {
      console.log(response);
      // get favorites and patch
      this.getFavorites();
    })
      .catch(error => console.log(error));
  }

  private getFavorites(): void {
    this.apiService.getFavorites({ id: this.authService.auth.user.id })
      .then(favorites => {
        console.log(favorites)
        this.authService.auth.user.favorites = [];
        favorites.forEach(_f => {
          this.authService.auth.user.favorites.push(_f.favorite);
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  public checkFavorite(i: number): boolean {
    return this.authService.auth.user.favorites.filter(r => {
      return r.school.name.toLowerCase() === this.results[i].school.name.toLowerCase()
    }).length > 0 ? true : false;
  }

  public loadFavorites(): void {
    this.results = this.authService.auth.user.favorites.map(f => {
      return { school: f.school, programs: f.programs }
    });
    this.resultsCount = this.results.length;
    console.log(this.results);
    this.isViewingFavorites = true;
  }

  public hideFavorites(): void {
    this.results = this.filterService.getCurretResults();
    this.resultsCount = this.results.length;
    console.log(this.results);
    this.isViewingFavorites = false;
  }
}
