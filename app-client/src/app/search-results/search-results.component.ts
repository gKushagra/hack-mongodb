import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
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

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {
    this.results = [];
    this.statesList = [];
    this.resultsCount = 0;
    this.urlParams = { zip: null, name: null };
    this.collegeScorecardSearchForm = new FormGroup({
      zip: new FormControl(null, [Validators.maxLength(5), Validators.required]),
      name: new FormControl(null)
    });
    this.currentlyExpandedResult = null;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.urlParams.zip = params['zip'];
      this.urlParams.name = params['name'];
      console.log(this.urlParams);
      this.collegeScorecardSearchForm.patchValue(this.urlParams);
      this.apiService.getCollegeScorecardSearch(this.urlParams)
        .then((data: CSC_School[]) => {
          console.log(data);
          (data !== null && data.length > 0) ? this.results = data : null;
          this.resultsCount = data.length;
        });
    });

    this.apiService.getStates()
      .then(data => this.statesList = data);
  }

  collegeScorecardSearch(): void {
    console.log(this.collegeScorecardSearchForm.value);
    this.apiService.getCollegeScorecardSearch(this.collegeScorecardSearchForm.value)
      .then((data: CSC_School[]) => {
        console.log(data);
        (data !== null && data.length > 0) ? this.results = data : null;
        this.resultsCount = data.length;
      });
  }

  expandResult(i: number): void {
    this.currentlyExpandedResult = this.results[i].school.name;
  }

  collapseResult(i: number): void {
    this.currentlyExpandedResult = null;
  }

}
