import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
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
    private router: Router,
    private authService: AuthService,
  ) {
    this.collegeList = [];
    this.statesList = [];
    this.resultsCount = 0;
    this.collegeScorecardSearchForm = new FormGroup({
      keyword: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('token') && !this.authService.auth.isAuthenticated) {
      this.authService.auth.user = {
        id: localStorage.getItem('id'),
        email: localStorage.getItem('email'),
        applications: [],
        favorites: []
      };
      this.authService.auth.isAuthenticated = true;
    }
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
