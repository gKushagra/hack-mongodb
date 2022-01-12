import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { College, CSC_School, State } from "../models";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public collegeList: College[];
  public resultsCount: number;
  public statesList: State[];

  public collegeScorecardSearchForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.collegeList = [];
    this.statesList = [];
    this.resultsCount = 0;
    this.collegeScorecardSearchForm = new FormGroup({
      zip: new FormControl(null, [Validators.maxLength(5), Validators.required]),
      name: new FormControl(null)
    });
  }

  ngOnInit(): void {
    // this.apiService.getColleges()
    // .then(data => /*this.collegeList = data*/ console.log(data));
  }

  collegeScorecardSearch(): void {
    console.log(this.collegeScorecardSearchForm.value);
    this.apiService.getCollegeScorecardSearch(this.collegeScorecardSearchForm.value)
      .then((data: CSC_School[]) => {
        console.log(data);
        this.router.navigate(["search"], { queryParams: this.collegeScorecardSearchForm.value });
      });
  }
}
