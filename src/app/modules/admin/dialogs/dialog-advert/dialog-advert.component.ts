import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { Subject } from 'rxjs';
import { ApiService } from 'app/modules/admin/services/api.service';
import { DialogAddressComponent } from '../dialog-address/dialog-address.component';
import { DialogCameraComponent } from '../dialog-camera/dialog-camera.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import compress from 'compress-base64';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { environment } from 'environments/environment';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Guid } from 'guid-typescript';
import { VariableService } from 'app/shared/variable.service';

@Component({
    selector: 'dialog-advert',
    templateUrl: 'dialog-advert.component.html'
})
export class DialogAdvertComponent {
    timestamp: number = 0;
    imagesFolder = environment.api + 'Images/';
    loading: boolean = true;
    form: FormGroup;
    formErrors: any;
    formValid: boolean;
    private _unsubscribeAll: Subject<any>;
    formData: any;
    previewImage: string = null;
    fileToUpload: any;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogAdvertComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _snackBar: MatSnackBar,
        private fuseSplashScreenService: FuseSplashScreenService,
        private apiService: ApiService,
        private variableService: VariableService) {
        this.timestamp = new Date().getTime();
        this.formErrors = data.formErrors;
        this.formData = data;

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.form = this.data.form;
        this.formValid = false;
        this.loading = false;
        //this.previewImage = this.form.controls['avatar'].value;
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
            this.form.controls['fileToUpload'].setValue(this.fileToUpload);
        }, (err) => {
            console.log(err);
        });
    }
    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
        this.form.controls['fileToUpload'].setValue(this.fileToUpload);
        let reader = new FileReader();
        reader.onload = (event: any) => {
            this.previewImage = event.target.result;
        };
        reader.readAsDataURL(this.fileToUpload);
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

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        setTimeout(() => {
            this.dialogRef.close(this.form.value);
        }, 100);
    }
}