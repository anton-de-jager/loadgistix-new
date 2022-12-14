import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { AuthService } from 'app/core/auth/auth.service';
import { Capacitor } from '@capacitor/core';
import { ApiService } from 'app/modules/admin/services/api.service';
import { Browser } from '@capacitor/browser';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;
    fileToUpload: any;
    native: string = '';
    htmlStr: string = '';
    isNative = Capacitor.isNativePlatform();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private _fuseNavigationService: FuseNavigationService,
        private apiService: ApiService
    ) {
        this.native = Capacitor.isNativePlatform() ? 'White' : '';
        console.log(this.native);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: ['']
        });
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn(this.signInForm.value)
            .subscribe(
                () => {

                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);

                },
                (response) => {
                    console.log(response);
                    this.htmlStr += '<p>' + response.error + '</p>';
                    this.htmlStr += '<p>' + response.message + '</p>';
                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Wrong email or password'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }

    updateNavigation(): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                // Get the component -> navigation data -> item
                const navComponent = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>('main');

                // Return if the navigation component does not exist
                if (!navComponent) {
                    return null;
                }

                // A navigation data to replace with
                const newNavigation: FuseNavigationItem[] = [
                    {
                        id: 'supported-components',
                        title: 'Supported components',
                        subtitle: 'Compatible third party components',
                        type: 'group',
                        icon: 'memory',
                        children: [
                            {
                                id: 'supported-components.apex-charts',
                                title: 'ApexCharts',
                                type: 'basic',
                                icon: 'insert_chart',
                                link: '/supported-components/apex-charts'
                            },
                            {
                                id: 'supported-components.full-calendar',
                                title: 'FullCalendar',
                                type: 'basic',
                                icon: 'today',
                                link: '/supported-components/full-calendar'
                            },
                            {
                                id: 'supported-components.google-maps',
                                title: 'Google Maps',
                                type: 'basic',
                                icon: 'map',
                                link: '/supported-components/google-maps'
                            },
                            {
                                id: 'supported-components.ngx-markdown',
                                title: 'ngx-markdown',
                                type: 'basic',
                                icon: 'text_format',
                                link: '/supported-components/ngx-markdown'
                            },
                            {
                                id: 'supported-components.quill-editor',
                                title: 'Quill editor',
                                type: 'basic',
                                icon: 'font_download',
                                link: '/supported-components/quill-editor'
                            },
                            {
                                id: 'supported-components.youtube-player',
                                title: 'Youtube player',
                                type: 'basic',
                                icon: 'play_circle_filled',
                                link: '/supported-components/youtube-player'
                            }
                        ]
                    }
                ];

                // Replace the navigation data
                navComponent.navigation = newNavigation;
                navComponent.refresh();
            } catch (exception) {
                resolve(false);
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
