import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { Subject } from 'rxjs';
import { ApiService } from 'app/modules/admin/services/api.service';
import { DialogAddressComponent } from '../dialog-address/dialog-address.component';
import { DialogCameraComponent } from '../dialog-camera/dialog-camera.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { load } from '../../models/load.model';
import { Guid } from 'guid-typescript';
import { DialogBidComponent } from '../dialog-bid/dialog-bid.component';
import { vehicle } from '../../models/vehicle.model';
import { driver } from '../../models/driver.model';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';

@Component({
    selector: 'dialog-load-details',
    templateUrl: 'dialog-load-details.component.html'
})
export class DialogLoadDetailsComponent {
    previewImage: string = null;
    readOnly: boolean = false;
    bidRow: load;
    vehicleList: vehicle[] = [];
    driverList: driver[] = [];
    loading: boolean = false;
    formBid: FormGroup;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogLoadDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        private fuseSplashScreenService: FuseSplashScreenService) {
        this.bidRow = data.item;
        this.readOnly = data.readOnly == 1 ? true : false;
        this.vehicleList = data.vehicleList;
        this.driverList = data.driverList;
    }

    ngOnInit(): void {
        
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    initBid() {
        this.formBid = this._formBuilder.group({
            id: [this.bidRow == null ? Guid.create() : this.bidRow.id],
            userId: [this.bidRow == null ? localStorage.getItem('userId') : this.bidRow.userId],
            loadId: [this.bidRow == null ? null : this.bidRow.id, Validators.required],
            vehicleId: [null, Validators.required],
            driverId: [null, Validators.required],
            price: [this.bidRow == null ? null : this.bidRow.price, Validators.required],
            dateOut: [this.bidRow == null ? null : this.bidRow.dateOut, Validators.required],
            dateIn: [this.bidRow == null ? null : this.bidRow.dateIn, Validators.required],
            statusId: [this.bidRow == null ? Guid.parse('B3B7D04D-64B7-4ED7-BFE1-CF06D2B4A8AB') : this.bidRow.statusId]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: this.bidRow,
            form: this.formBid,
            loadList: [this.bidRow],//this.loadList,
            vehicleList: this.vehicleList,
            driverList: this.driverList,
            title: 'Place a'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogBidComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                this.fuseSplashScreenService.show(); this.loading = true;
                this.apiService.post('bids', null, result).subscribe(r => {
                    this.dialogRef.close(true);
                }, error => {
                    console.log(error);
                    this._snackBar.open('Error: ' + error, null, { duration: 2000 });
                    this.fuseSplashScreenService.hide(); this.loading = false;
                });
            }
        });
    }
}