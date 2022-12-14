import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { Subject } from 'rxjs';
import { ApiService } from 'app/modules/admin/services/api.service';
import { DialogAddressComponent } from '../dialog-address/dialog-address.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { address } from '../../models/address.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { VariableService } from 'app/shared/variable.service';

@Component({
    selector: 'dialog-vehicle',
    templateUrl: 'dialog-vehicle.component.html'
})
export class DialogVehicleComponent {
    timestamp: number = 0;
    imagesFolder = environment.api + 'Images/';
    form: FormGroup;
    formErrors: any;
    formValid: boolean;
    private _unsubscribeAll: Subject<any>;
    formData: any;
    previewImage: string = null;
    fileToUpload: any;

    vehicleCategoryList: any[] = [];

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogVehicleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _snackBar: MatSnackBar,
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
        this.data.vehicleCategoryList.forEach(vehicleCategoryItem => {
            vehicleCategoryItem.vehicleTypeList = this.data.vehicleTypeList.filter(x => x.vehicleCategoryId == vehicleCategoryItem.id).sort((a, b) => a.description.localeCompare(b.description));
            this.vehicleCategoryList.push(vehicleCategoryItem);
        });

        setTimeout(() => {
            this.vehicleCategoryList = this.vehicleCategoryList.sort((a, b) => a.description.localeCompare(b.description));
            this.vehicleTypeChanged();
        }, 100);
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

    getAddress(control) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { label: 'Loadgistix', lat: 28.1045642, lon: -26.3296247 };
        if (control == 'originatingAddressLabel' && this.form.controls['originatingAddressLabel'].value) {
            dialogConfig.data.label = this.form.controls['originatingAddressLabel'].value;
            dialogConfig.data.lat = this.form.controls['originatingAddressLat'].value;
            dialogConfig.data.lon = this.form.controls['originatingAddressLon'].value;
        }
        if (control == 'destinationAddressLabel' && this.form.controls['destinationAddressLabel'].value) {
            dialogConfig.data.label = this.form.controls['destinationAddressLabel'].value;
            dialogConfig.data.lat = this.form.controls['destinationAddressLat'].value;
            dialogConfig.data.lon = this.form.controls['destinationAddressLon'].value;
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogAddressComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe((result:address) => {
            if (result) {
                console.log(control, result);
                if (control == 'originatingAddressLabel') {
                    this.form.controls['originatingAddressLabel'].setValue(result.label);
                    this.form.controls['originatingAddressLat'].setValue(result.lat);
                    this.form.controls['originatingAddressLon'].setValue(result.lon);
                }
                if (control == 'destinationAddressLabel') {
                    this.form.controls['destinationAddressLabel'].setValue(result.label);
                    this.form.controls['destinationAddressLat'].setValue(result.lat);
                    this.form.controls['destinationAddressLon'].setValue(result.lon);
                }
            }
        });
    }

    vehicleTypeChanged() {
        if (this.getVehicleTypeLiquid()) {
            this.form.controls["maxLoadHeight"].clearValidators();
            this.form.controls["maxLoadWidth"].clearValidators();
            this.form.controls["maxLoadLength"].clearValidators();
            this.form.controls["availableCapacity"].clearValidators();
            this.form.controls["maxLoadVolume"].setValidators([Validators.required]);
        } else {
            this.form.controls["maxLoadHeight"].setValidators([Validators.required]);
            this.form.controls["maxLoadWidth"].setValidators([Validators.required]);
            this.form.controls["maxLoadLength"].setValidators([Validators.required]);
            this.form.controls["availableCapacity"].setValidators([Validators.required]);
            this.form.controls["maxLoadVolume"].clearValidators();
        }
        setTimeout(() => {
            this.form.controls["maxLoadHeight"].updateValueAndValidity();
            this.form.controls["maxLoadWidth"].updateValueAndValidity();
            this.form.controls["maxLoadLength"].updateValueAndValidity();
            this.form.controls["availableCapacity"].updateValueAndValidity();
            this.form.controls["maxLoadVolume"].updateValueAndValidity();
        }, 100);
    }

    getVehicleTypeLiquid(): string {
        return this.form.controls['vehicleTypeId'].value ? this.formData.vehicleTypeList.find(x => x.id === this.form.controls['vehicleTypeId'].value).liquid : false;
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