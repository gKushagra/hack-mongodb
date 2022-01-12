import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { College, CSC_Program, CSC_School } from './models';

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

  getCollegeScorecardSearch({ zip, name }): any {
    let url = this.endpoint + 'collegecard';
    if (zip)
      url += `/${zip}`;
    if (name)
      url += `/${name}`;

    return this.httpClient.get<CSC_School[]>(url).toPromise();
  }
}
