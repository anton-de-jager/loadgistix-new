import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { fuseAnimations } from '@fuse/animations';
import { ApiService } from 'app/modules/admin/services/api.service';

@Component({
    selector: 'auth-success',
    templateUrl: './success.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSuccessComponent implements OnInit, OnDestroy {
    countdown: number = 5;
    countdownMapping: any = {
        '=1': '# second',
        'other': '# seconds'
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    native: string = '';
    email: string = '';

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private apiService: ApiService,
        private route: ActivatedRoute
    ) {
        this.native = Capacitor.isNativePlatform() ? 'White' : '';
        this.route.queryParams
            .subscribe(params => {
                this.email = params.activateemail
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.apiService.activate(this.email).subscribe(x => {
            // Redirect after the countdown
            timer(100, 100)
                .pipe(
                    finalize(() => {
                        this._router.navigate(['sign-in']);
                    }),
                    takeWhile(() => this.countdown > 0),
                    takeUntil(this._unsubscribeAll),
                    tap(() => this.countdown--)
                )
                .subscribe();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
