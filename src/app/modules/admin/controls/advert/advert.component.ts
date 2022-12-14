import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { VariableService } from 'app/shared/variable.service';
import { interval, Subscription } from 'rxjs';
import { advert } from '../../models/advert.model';
import { ApiService } from '../../services/api.service';
import { environment } from 'environments/environment';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

@Component({
    selector: 'advert',
    templateUrl: './advert.component.html',
    styleUrls: ['./advert.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class AdvertComponent implements OnInit {
    timestamp: number = 0;
    imagesFolder = environment.api + 'Images/';
    loading: boolean = true;
    advertItems: advert[] = [];
    subscription: Subscription;

    constructor(
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        public variableService: VariableService,
        private authService: AuthService,
        private _router: Router) {
        this.timestamp = new Date().getTime();
    }

    ngOnInit() {
        this.getAdverts().then(getAdvertsResult => {
            this.advertItems = getAdvertsResult;
        })
        const source = interval(600000);
        this.subscription = source.subscribe(val => {
            this.authService.check().subscribe(authenticated => {
                if (authenticated) {
                    this.getAdverts().then(getAdvertsResult => {
                        this.advertItems = getAdvertsResult;
                        this.timestamp = new Date().getTime();
                    });
                }
            })
        });
    }

    getAdverts(): Promise<advert[]> {
        var promise = new Promise<advert[]>((resolve) => {
            try {
                this.apiService.post('adverts', 'available', null).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            resolve(apiResult.data);
                        } else {
                            if (apiResult.message == 'Expired') {
                                this._router.navigate(['/sign-out']);
                            } else {
                                this._snackBar.open('Error: ' + apiResult.message, null, { duration: 2000 });
                                //this.fuseSplashScreenService.hide(); this.loading = false;
                            }
                        }
                    },
                    error: (error) => {
                        console.log(error);
                        this._snackBar.open('Error: ' + error, null, { duration: 2000 });
                        //this.fuseSplashScreenService.hide(); this.loading = false;
                    },
                    complete: () => {
                        //console.log('Done');
                    }
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    navigateExternal(event:Event, url) {
        event.preventDefault();
        if (Capacitor.isNativePlatform) {
            Browser.open({ url });
        }else{
            window.open(url, '_blank');
        }
    }
}
