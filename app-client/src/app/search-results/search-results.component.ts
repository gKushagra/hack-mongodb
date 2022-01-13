import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FilterService } from '../filter.service';
import { CSC_School, State } from '../models';

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

  constructor(
    private apiService: ApiService,
    public filterService: FilterService,
    private route: ActivatedRoute,
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
}
