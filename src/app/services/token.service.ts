import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenResponse } from 'app/responses/token.response';
import { UserService } from 'app/services/user.service';
import { Guid } from 'guid-typescript';
import { VariableService } from 'app/shared/variable.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private userService: UserService,
    public variableService: VariableService
    ) { }

  saveSession(tokenResponse: TokenResponse) {

    window.localStorage.setItem('AT', tokenResponse.accessToken);
    window.localStorage.setItem('RT', tokenResponse.refreshToken);
    if (tokenResponse.user) {
      window.localStorage.setItem('user', JSON.stringify(tokenResponse.user));
      this.variableService.setUser(tokenResponse.user);
    }

  }

  getSession(): TokenResponse | null {
    if (window.localStorage.getItem('AT')) {
      const tokenResponse: TokenResponse = {
        accessToken: window.localStorage.getItem('AT') || '',
        refreshToken: window.localStorage.getItem('RT') || '',
        user: JSON.parse(window.localStorage.getItem('user'))
      };

      this.variableService.setUser(JSON.parse(window.localStorage.getItem('user')));

      return tokenResponse;
    }
    return null;
  }

  logout() {
    window.localStorage.clear();
  }

  isLoggedIn(): boolean {
    let session = this.getSession();
    if (!session) {
      return false;
    }

    // check if token is expired
    const jwtToken = JSON.parse(atob(session.accessToken.split('.')[1]));
    const tokenExpired = Date.now() > (jwtToken.exp * 1000);

    return !tokenExpired;

  }

  refreshToken(session: TokenResponse): Observable<TokenResponse> {

    return this.userService.refreshToken(session);
  }
  
}