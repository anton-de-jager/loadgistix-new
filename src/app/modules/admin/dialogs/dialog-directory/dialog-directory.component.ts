import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { Subject } from 'rxjs';
import { ApiService } from 'app/modules/admin/services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogAddressComponent } from '../dialog-address/dialog-address.component';
import { environment } from 'environments/environment';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { VariableService } from 'app/shared/variable.service';

@Component({
    selector: 'dialog-directory',
    templateUrl: 'dialog-directory.component.html'
})
export class DialogDirectoryComponent {
    timestamp: number = 0;
    imagesFolder = environment.api + 'Images/';
    form: FormGroup;
    formErrors: any;
    formValid: boolean;
    private _unsubscribeAll: Subject<any>;
    formData: any;
    previewImage: string = null;
    fileToUpload: any;
    freeListing: boolean = false;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogDirectoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _snackBar: MatSnackBar,
        private apiService: ApiService,
        private sanitizer: DomSanitizer,
        private variableService: VariableService) {
        this.timestamp = new Date().getTime();
        this.formErrors = data.formErrors;
        this.formData = data;
        this.freeListing = localStorage.getItem('directoryQuantity').toString() == '-1';

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.form = this.data.form;
        this.formValid = false;
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
        var size = (this.fileToUpload.size / (1024 * 1024)).toFixed(2);
        // if (Number(size) > Number(0.25)) {
        //     this._snackBar.open('Error: Maximum FileSize is 200kB', null, { duration: 2000 });
        //     return false;
        // } else {

            //Show image preview
            let reader = new FileReader();
            reader.onload = (event: any) => {
                this.previewImage = event.target.result;
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

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }

    getAddress() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { label: 'Loadgistix', lat: 28.1045642, lon: -26.3296247 };
        if (this.form.controls['addressLabel'].value) {
            dialogConfig.data.label = this.form.controls['addressLabel'].value;
            dialogConfig.data.lat = this.form.controls['addressLat'].value;
            dialogConfig.data.lon = this.form.controls['addressLon'].value;
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogAddressComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.form.controls['addressLabel'].setValue(result.label);
                this.form.controls['addressLat'].setValue(result.lat);
                this.form.controls['addressLon'].setValue(result.lon);
            }
        });
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        this.dialogRef.close(this.form.value);
    }
}