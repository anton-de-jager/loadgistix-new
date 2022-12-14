import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { ApiService } from 'app/modules/admin/services/api.service';

@Component({
    selector       : 'settings-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None
})
export class SettingsSecurityComponent implements OnInit
{
    securityForm: FormGroup;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private apiService: ApiService,
        private _changeDetectorRef: ChangeDetectorRef
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.securityForm = this._formBuilder.group({
            currentPassword  : [''],
            newPassword      : [''],
            twoStep          : [true],
            askPasswordChange: [false]
        });
    }

    submit() {
        this.securityForm.disable();
        this.showAlert = false;
        let request = {
            id: localStorage.getItem('userId'),
            passwordCurrent: this.securityForm.value.currentPassword,
            passwordNew: this.securityForm.value.newPassword
        }
        this.apiService.changePassword(request).subscribe({
            next: data => {
                this.securityForm.enable();
                this.alert = {
                    type: 'success',
                    message: 'password Changed Successfully'
                };
                this.showAlert = true;
                this._changeDetectorRef.markForCheck();
            },
            error: err => {
                this.securityForm.enable();

                this.alert = {
                    type: 'error',
                    message: err.error
                };
                this.showAlert = true;
                this._changeDetectorRef.markForCheck();
            }
        });
    }
}
