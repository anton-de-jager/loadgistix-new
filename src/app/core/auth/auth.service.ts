import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;
    private baseUrl: string;

    getHeader(): HttpHeaders {
        return localStorage.getItem('accessToken') ? new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
            'id': localStorage.getItem('userId'),
            "Authorization": "Bearer " + localStorage.getItem('accessToken')
        }) : new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
            'Content-Type': 'application/json'
        });
    }

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _router: Router,
        @Inject('BASE_URL') _baseUrl: string
    ) {
        this.baseUrl = environment.api; //_baseUrl
        // localStorage.removeItem('accessToken')
        // localStorage.removeItem('userId');
        // localStorage.removeItem('email');
        // localStorage.removeItem('user');
        // localStorage.removeItem('accessToken');
        // this._authenticated = false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }
    set email(email: string) {
        localStorage.setItem('email', email);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }
    get email(): string {
        return localStorage.getItem('email') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post(this.baseUrl + 'api/token/forgot-password?email=' + email, email, { headers: this.getHeader() });
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(reset: string, password: string): Observable<any> {
        return this._httpClient.post(this.baseUrl + 'api/token/reset-password', { reset: reset, password: password }, { headers: this.getHeader() });
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        // if (this._authenticated) {
        //     return throwError('User is already logged in.');
        // }

        return this._httpClient.post(this.baseUrl + 'api/token', credentials, { headers: this.getHeader() }).pipe(
            switchMap((response: any) => {
                //console.log('response', response);
                localStorage.clear();

                // Store the access token in the local storage
                this.accessToken = response.accessToken;
                this.email = response.user.email;
                localStorage.setItem('accessToken', this.accessToken);
                localStorage.setItem('userId', response.user.id);
                localStorage.setItem('email', credentials.email);
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('vehiclesQuantity', JSON.stringify(response.user.vehicles));
                localStorage.setItem('loadsQuantity', JSON.stringify(response.user.loads));
                localStorage.setItem('advertsQuantity', JSON.stringify(response.user.adverts));
                localStorage.setItem('directoryQuantity', JSON.stringify(response.user.directory));
                localStorage.setItem('orderId', JSON.stringify(response.user.orderId));
                localStorage.setItem('subscriptionId', JSON.stringify(response.user.subscriptionId));
                localStorage.setItem('subscriptionStatus', JSON.stringify(response.user.subscriptionStatus));

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;
                console.log(response.user);

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Renew token
        return this._httpClient.post(this.baseUrl + 'api/token/refresh', {
            accessToken: this.accessToken,
            email: this.email
        }, { headers: this.getHeader() }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {
                if (response.user) {
                    localStorage.clear();
                    // Store the access token in the local storage
                    this.accessToken = response.accessToken;
                    this.email = response.user.email;
                    localStorage.setItem('accessToken', this.accessToken);
                    localStorage.setItem('userId', response.user.id);
                    localStorage.setItem('email', response.user.email);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    localStorage.setItem('vehiclesQuantity', JSON.stringify(response.user.vehicles));
                    localStorage.setItem('loadsQuantity', JSON.stringify(response.user.loads));
                    localStorage.setItem('advertsQuantity', JSON.stringify(response.user.adverts));
                    localStorage.setItem('directoryQuantity', JSON.stringify(response.user.directory));
                    localStorage.setItem('orderId', JSON.stringify(response.user.orderId));
                    localStorage.setItem('subscriptionId', JSON.stringify(response.user.subscriptionId));
                    localStorage.setItem('subscriptionStatus', JSON.stringify(response.user.subscriptionStatus));

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return true
                    return of(true);
                }else{
                    return of(false);
                }
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        this._userService.user = null;

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { company: string; firstName: string; lastName: string; phone: string; email: string; password: string, vehiclesQuantity: number, loadsQuantity: number, advertsQuantity: number, directoryQuantity: number }): Observable<any> {
        user.password = user.password.replace('#', '%23');
        return this._httpClient.post(this.baseUrl + 'api/users', user, { headers: this.getHeader() });
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post(this.baseUrl + 'api/token/unlock-session', credentials, { headers: this.getHeader() });
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('email');
            localStorage.removeItem('userId');
            localStorage.removeItem('user');
            this._router.navigateByUrl('/sign-in');
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
