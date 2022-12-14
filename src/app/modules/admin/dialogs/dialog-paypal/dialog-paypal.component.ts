import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { Subject } from 'rxjs';
import { ApiService } from 'app/modules/admin/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { VariableService } from 'app/shared/variable.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';

@Component({
    selector: 'dialog-paypal',
    templateUrl: 'dialog-paypal.component.html'
})
export class DialogPaypalComponent {
    user = JSON.parse(localStorage.getItem('user'));
    page: string;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogPaypalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _snackBar: MatSnackBar,
        private apiService: ApiService,
        private fuseSplashScreenService: FuseSplashScreenService,
        private variableService: VariableService) {
            this.page = data.page;
    }

    ngOnInit(): void {
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
}