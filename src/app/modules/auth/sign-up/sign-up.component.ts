import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { DialogTcComponent } from 'app/modules/admin/dialogs/dialog-tc/dialog-tc.component';
import { ApiService } from 'app/modules/admin/services/api.service';
import { environment } from 'environments/environment';
import { Capacitor } from '@capacitor/core';
import * as CryptoJS from "crypto-js";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { VariableService } from 'app/shared/variable.service';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignUpComponent implements OnInit {
    timestamp: number = 0;
    imagesFolder = environment.api + 'Images/';
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    yearlyBilling: boolean = false;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;
    previewImage: string = null;
    fileToUpload: any;
    native: string = '';
    subscriptions = [
        { type: 'vehicle', count: 0, value: 0 },
        { type: 'vehicle', count: 1, value: 150 },
        { type: 'vehicle', count: 5, value: 590 },
        { type: 'vehicle', count: 10, value: 975 },
        { type: 'vehicle', count: -1, value: 2250 },
        { type: 'load', count: 0, value: 0 },
        { type: 'load', count: 1, value: 0 },
        { type: 'load', count: 5, value: 290 },
        { type: 'load', count: 10, value: 490 },
        { type: 'load', count: -1, value: 1450 },
        { type: 'advert', count: 0, value: 0 },
        { type: 'advert', count: 1, value: 199 },
        { type: 'directory', count: 0, value: 0 },
        { type: 'directory', count: -1, value: 0 },
        { type: 'directory', count: 1, value: 99 }
    ];

    /**
     * Constructor
     */
    constructor(
        private dialog: MatDialog,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private apiService: ApiService,
        private variableService: VariableService
    ) {
        this.timestamp = new Date().getTime();
        this.native = Capacitor.isNativePlatform() ? 'White' : '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signUpForm = this._formBuilder.group({
            company: [null, Validators.required],
            firstName: [null, Validators.required],
            lastName: [null, Validators.required],
            phone: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            password: [null, Validators.required],
            //avatar: [false],
            avatarChanged: [false],
            agreements: [null, Validators.requiredTrue],
            vehicles: [false],
            loads: [false],
            adverts: [false],
            directory: [false],
            cv: [false],
            job: [false],
            vehiclesQuantity: [0],
            loadsQuantity: [1],
            advertsQuantity: [0],
            directoryQuantity: [-1],
            cvQuantity: [0],
            jobQuantity: [0]
        }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void {
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign up
        this._authService.signUp(this.signUpForm.value)
            .subscribe(
                (response) => {
                    if (response.id != '00000000-0000-0000-0000-000000000000') {
                        if (this.fileToUpload) {
                            this.uploadFile(this.fileToUpload, response.id + '.' + this.fileToUpload.name.split('.').pop()).then(x => {
                                this._router.navigateByUrl('/confirmation-required');
                            });
                        } else {
                            this._router.navigateByUrl('/confirmation-required');
                        }
                    } else {
                        // Re-enable the form
                        this.signUpForm.enable();

                        this.alert = {
                            type: 'error',
                            message: response.message
                        };

                        // Show the alert
                        this.showAlert = true;
                    }
                },
                (response) => {

                    // Re-enable the form
                    this.signUpForm.enable();

                    // Reset the form
                    this.signUpNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Something went wrong, please try again.'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }

    tc() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogTcComponent,
            dialogConfig);
    }

    getTotal() {
        return (this.subscriptions.find(x => x.type == 'vehicle' && x.count == this.signUpForm.controls['vehiclesQuantity'].value).value)
            + (this.subscriptions.find(x => x.type == 'load' && x.count == this.signUpForm.controls['loadsQuantity'].value).value)
            + (this.subscriptions.find(x => x.type == 'advert' && x.count == this.signUpForm.controls['advertsQuantity'].value).value)
            + (this.subscriptions.find(x => x.type == 'directory' && x.count == this.signUpForm.controls['directoryQuantity'].value).value);
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
            this.previewImage = `data:image/jpeg;base64,${imageData.base64String}`!;
            const resizedImage = await this.variableService.resizeImage({
                file: this.dataURLtoFile(`data:image/jpeg;base64,${imageData.base64String}`!),
                maxSize: 120
            });
            this.fileToUpload = this.dataURLtoFile(resizedImage);
            this.signUpForm.controls['avatarChanged'].setValue(true);
        }, (err) => {
            console.log(err);
        });
    }
    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
        var size = (this.fileToUpload.size / (1024 * 1024)).toFixed(2);
        // if (Number(size) > Number(0.25)) {
        //     this._snackBar.open('Error: Maximum FileSize is 200kB', null, { duration: 2000 });
        //     return false;
        // } else {

            //Show image preview
            let reader = new FileReader();
            reader.onload = (event: any) => {
                //this.signUpForm.controls['avatar'].setValue(event.target.result);
                this.previewImage = event.target.result;
                this.signUpForm.controls['avatarChanged'].setValue(true);
            };
            reader.readAsDataURL(this.fileToUpload);
        //}
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

    generateSignature = (data, passPhrase = 'ThisIsMyLoadgistixPassphrase1') => {
        // Create parameter string
        let pfOutput = "";
        for (let key in data) {
            console.log(key, data[key]);
            if (data.hasOwnProperty(key)) {
                if (data[key] !== "") {
                    try {
                        pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`
                    } catch (exc) {
                        pfOutput += `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}&`
                    }
                }
            }
        }

        // Remove last ampersand
        let getString = pfOutput.slice(0, -1);
        if (passPhrase !== null) {
            getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
        }

        const hash = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(getString));
        const md5 = hash.toString(CryptoJS.enc.Hex)
        return md5;

        //return CryptoJS.createHash("md5").update(getString).digest("hex");
    };

    subscribeHREF(): string {
        const myData = [];
        // Merchant details
        myData["receiver"] = environment.receiver;
        myData["merchant_id"] = environment.merchant_id;
        myData["merchant_key"] = environment.merchant_key;
        myData["return_url"] = "https://app.loadgistix.com/%23/success?email=" + this.signUpForm.controls['email'].value;
        myData["cancel_url"] = "https://app.loadgistix.com/%23/cancel?email=" + this.signUpForm.controls['email'].value;
        myData["notify_url"] = "https://luvirosapi.com:1880/api/loadgistix/subscription";
        // Buyer details
        myData["name_first"] = this.signUpForm.controls['firstName'].value;
        myData["name_last"] = this.signUpForm.controls['lastName'].value;
        myData["email_address"] = this.signUpForm.controls['email'].value;
        myData["custom_str1"] = this.signUpForm.controls['phone'].value;
        myData["custom_str2"] = this.signUpForm.controls['company'].value;
        myData["custom_str3"] = this.signUpForm.controls['password'].value.replace('#', '%23');
        // Transaction details
        myData["m_payment_id"] = "1234";
        myData["amount"] = 5;//this.getTotal().toString();
        myData["subscription_type"] = "1";
        myData["recurring_amount"] = this.getTotal().toString();
        myData["cycles"] = "0";
        myData["frequency"] = "3";
        myData["item_name"] = "Loadgistix+Subscription";
        myData["email_confirmation"] = "1";
        myData["confirmation_address"] = "payments@loadgistix.com";
        myData["custom_int1"] = this.signUpForm.controls['vehiclesQuantity'].value;
        myData["custom_int2"] = this.signUpForm.controls['loadsQuantity'].value;
        myData["custom_int3"] = this.signUpForm.controls['advertsQuantity'].value;
        myData["custom_int4"] = this.signUpForm.controls['directoryQuantity'].value;

        // Generate signature
        myData["signature"] = this.generateSignature(myData);

        let url = environment.payfastUrl + '?cmd=_paynow';
        url += '&receiver=' + myData["receiver"];
        url += '&merchant_id=' + myData["merchant_id"];
        url += '&merchant_key=' + myData["merchant_key"];
        url += '&return_url=' + myData["return_url"];
        url += '&cancel_url=' + myData["cancel_url"];
        url += '&notify_url=' + myData["notify_url"];
        url += '&name_first=' + myData["name_first"];
        url += '&name_last=' + myData["name_last"];
        url += '&email_address=' + myData["email_address"];
        url += '&custom_str1=' + myData["custom_str1"];
        url += '&custom_str2=' + myData["custom_str2"];
        url += '&custom_str3=' + myData["custom_str3"];
        url += '&custom_int1=' + myData["custom_int1"];
        url += '&custom_int2=' + myData["custom_int2"];
        url += '&custom_int3=' + myData["custom_int3"];
        url += '&custom_int4=' + myData["custom_int4"];
        url += '&m_payment_id=' + myData["m_payment_id"];
        url += '&amount=' + myData["amount"];
        url += '&subscription_type=' + myData["subscription_type"];
        url += '&recurring_amount=' + myData["recurring_amount"];
        url += '&cycles=' + myData["cycles"];
        url += '&frequency=' + myData["frequency"];
        url += '&item_name=' + myData["item_name"];
        url += '&email_confirmation=' + myData["email_confirmation"];
        url += '&confirmation_address=' + myData["confirmation_address"];
        url += '&signature=' + myData["signature"];
        return url;
    }

    subscribe() {
        if (this.signUpForm.invalid) {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        window.location.href = this.subscribeHREF();
    }
}
