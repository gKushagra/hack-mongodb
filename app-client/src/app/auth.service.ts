import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Authorization, AuthResponse } from './models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth: Authorization;
  api: string;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.auth = {
      isAuthenticated: false,
      user: null
    }
    this.api = environment.apiUrl + 'auth/';
  }

  attemptLogin({ email, password }): Promise<any> {
    return this.httpClient.post<AuthResponse>(this.api + 'login', { email, password })
      .toPromise();
  }

  attemptSignup({ email, password }): Promise<any> {
    return this.httpClient.post<AuthResponse>(this.api + 'signup', { email, password })
      .toPromise();
  }

  requestPasswordResetLink({ email }): Promise<any> {
    return this.httpClient.get<string>(this.api + `reset/${email}`)
      .toPromise();
  }

  attemptResetPassword({ password, token }): Promise<any> {
    return this.httpClient.post<string>(this.api + 'reset', { token, password })
      .toPromise();
  }
}
