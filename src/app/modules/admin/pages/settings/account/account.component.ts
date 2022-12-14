import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { User } from 'app/core/user/user.types';
import { ApiService } from 'app/modules/admin/services/api.service';
import { VariableService } from 'app/shared/variable.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SettingsAccountComponent implements OnInit {
    accountForm: FormGroup;
    user: User;
    imagesFolder = environment.api + 'Images/';
    previewImage: string = null;
    fileToUpload: any;
    timestamp = 0;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        private fuseConfirmationService: FuseConfirmationService,
        private variableService: VariableService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.timestamp = new Date().getTime();
        this.user = JSON.parse(localStorage.getItem('user'));
        console.log(this.user);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.accountForm = this._formBuilder.group({
            id: [this.user.id, Validators.required],
            company: [this.user.company, Validators.required],
            firstName: [this.user.firstName, Validators.required],
            lastName: [this.user.lastName, Validators.required],
            phone: [this.user.phone, Validators.required],
            email: [{ value: this.user.email, disabled: true }],
            avatar: [this.user.avatar],
            avatarChanged: [false]
        });
    }

    async takePicture() {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            source: CameraSource.Prompt,
            resultType: CameraResultType.Base64,
            height: 120
        }).then(res => {
            alert(res.base64String);
            this.previewImage = 'data:image/jpeg;base64,' + res.base64String;
        });
    }
    async captureImage() {
        let options = {
            quality: 90,
            allowEditing: false,
            source: CameraSource.Prompt,
            resultType: CameraResultType.Base64,
            height: 120
        }
        Camera.getPhoto(options).then(async (imageData) => {
            this.accountForm.controls['avatar'].setValue(`data:image/jpeg;base64,${imageData.base64String}`!);
            this.previewImage = `data:image/jpeg;base64,${imageData.base64String}`!;
            const resizedImage = await this.variableService.resizeImage({
                file: this.dataURLtoFile(`data:image/jpeg;base64,${imageData.base64String}`!),
                maxSize: 120
            });
            this.fileToUpload = this.dataURLtoFile(resizedImage);
            this.accountForm.controls['avatarChanged'].setValue(true);
            this.changeDetectorRef.detectChanges();
        }, (err) => {
            console.log(err);
        });
    }

    dataURLtoFile(dataurl) {

        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        console.log(new File([u8arr], 'file.' + mime.replace('image/', ''), { type: mime }));

        return new File([u8arr], 'file.' + mime.replace('image/', ''), { type: mime });
    }

    uploadFile(fileToUpload, filename): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                const formData = new FormData();
                formData.append('file', fileToUpload);
                this.apiService.upload('users', formData, filename).subscribe(event => {
                    if (event.type === HttpEventType.Response) {
                        resolve(true);
                    }
                })
            } catch (exception) {
                resolve(false);
            }
        });
        return promise;
    }

    save() {
        this.showAlert = false;
        // Do nothing if the form is invalid
        if (this.accountForm.invalid) {
            return;
        }

        // Disable the form
        this.accountForm.disable();

        this.apiService.updateUser(this.accountForm.value)
            .subscribe(
                (response) => {
                    console.log('response', response);
                    if (response['id'] != '00000000-0000-0000-0000-000000000000') {
                        if (this.fileToUpload) {
                            this.uploadFile(this.fileToUpload, response['id'] + '.' + this.fileToUpload.name.split('.').pop()).then(x => {
                                this.user.avatar = '.' + this.fileToUpload.name.split('.').pop();
                                this.user.company = this.accountForm.value.company;
                                this.user.firstName = this.accountForm.value.firstName;
                                this.user.lastName = this.accountForm.value.lastName;
                                this.user.phone = this.accountForm.value.phone;
                                localStorage.setItem('user', JSON.stringify(this.user));
                                this.timestamp = new Date().getTime();
                                this.accountForm.enable();
                            });
                        } else {
                            this.user.company = this.accountForm.value.company;
                            this.user.firstName = this.accountForm.value.firstName;
                            this.user.lastName = this.accountForm.value.lastName;
                            this.user.phone = this.accountForm.value.phone;
                            localStorage.setItem('user', JSON.stringify(this.user));
                            this.timestamp = new Date().getTime();
                            this.accountForm.enable();
                        }
                        this.alert = {
                            type: 'success',
                            message: 'Profile Saved Successfully'
                        };
                        this.showAlert = true;
                    } else {
                        // Re-enable the form
                        this.accountForm.enable();
                        this.alert = {
                            type: 'success',
                            message: 'Profile Saved Successfully'
                        };
                        this.showAlert = true;
                    }
                },
                (response) => {
                    this.alert = {
                        type: 'error',
                        message: 'Something went wrong, please try again.'
                    };
    
                    // Show the alert
                    this.showAlert = true;
                    // Re-enable the form
                    this.accountForm.enable();
                }
            );
    }
}
