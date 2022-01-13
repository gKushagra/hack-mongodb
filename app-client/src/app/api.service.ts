import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CSC_School } from './models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  endpoint: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getColleges(): any {
    this.httpClient.get(this.endpoint + 'colleges').subscribe(data => {
      console.log(data);
    })
  }

  getStates(): any {
    return this.httpClient.get<any>(this.endpoint + 'states').toPromise();
  }

  getCollegeMajors(): any {
    return this.httpClient.get(this.endpoint + 'majors').toPromise();
  }

  getCollegeScorecardSearch({ keyword }): any {
    let url = this.endpoint + `collegecard/${keyword}`;
    return this.httpClient.get<CSC_School[]>(url).toPromise();
  }
}
