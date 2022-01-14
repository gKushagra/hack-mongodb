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

  getApplications({ id }): Promise<any> {
    return this.httpClient.get(this.endpoint + `application/${id}`).toPromise();
  }

  saveApplication({ id, application }): Promise<any> {
    return this.httpClient.post(this.endpoint + 'application', { id, application }).toPromise();
  }

  editApplication({ id, application }): Promise<any> {
    return this.httpClient.put(this.endpoint + 'application', { id, application }).toPromise();
  }

  deleteApplication({ id, applicationId }): Promise<any> {
    return this.httpClient.delete(this.endpoint + `application/${id}/${applicationId}`).toPromise();
  }

  addToFavorites({ id, favorite }): Promise<any> {
    return this.httpClient.post(this.endpoint + 'favorite', { id, favorite }).toPromise();
  }

  getFavorites({ id }): Promise<any> {
    return this.httpClient.get(this.endpoint + `favorite/${id}`).toPromise();
  }

  getSharedApplications({ id }): Promise<any> {
    return this.httpClient.get(this.endpoint + `shared/${id}`).toPromise();
  }

  shareApplication({ id, application, shareTo }): Promise<any> {
    return this.httpClient.post(this.endpoint + 'shared', { id, application, shareTo }).toPromise();
  }

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
