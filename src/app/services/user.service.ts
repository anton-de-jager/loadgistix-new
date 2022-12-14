import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { LoginRequest } from 'app/requests/login.request';
import { SignupRequest } from 'app/requests/signup.request';
import { TokenResponse } from 'app/responses/token.response';
import { UserResponse } from 'app/responses/user.response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<TokenResponse> {
    return this.httpClient.post<TokenResponse>(`${environment.api}api/users/login`, loginRequest);
  }

  signup(SignupRequest: SignupRequest) {
    return this.httpClient.post(`${environment.api}api/users/signup`, SignupRequest, { responseType: 'text'}); // response type specified, because the API response here is just a plain text (email address) not JSON
  }

  refreshToken(session: TokenResponse) {
    let refreshTokenRequest: any = {
      UserId: session.user.id,
      RefreshToken: session.refreshToken
    };
    return this.httpClient.post<TokenResponse>(`${environment.api}api/users/refresh_token`, refreshTokenRequest);
  }

  logout() {
    return this.httpClient.post(`${environment.api}api/users/signup`, null);
  }

  getUserInfo(): Observable<UserResponse> {
    return this.httpClient.get<UserResponse>(`${environment.api}api/users/info`);
  }

}