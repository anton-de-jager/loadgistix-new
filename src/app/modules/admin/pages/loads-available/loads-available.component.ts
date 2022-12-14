import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { ApiService } from 'app/modules/admin/services/api.service';
import { keyValue } from 'app/modules/admin/models/keyValue.model';
import { load } from 'app/modules/admin/models/load.model';
import { Guid } from 'guid-typescript';
import { first } from 'rxjs';
import { DialogLoadComponent } from 'app/modules/admin/dialogs/dialog-load/dialog-load.component';
// import { UploadService } from 'app/shared/upload.service';
// import { upload } from 'app/modules/admin/models/upload';
import * as L from 'leaflet';
import { vehicle } from 'app/modules/admin/models/vehicle.model';
import { driver } from '../../models/driver.model';
import { VariableService } from 'app/shared/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { notification } from '../../models/notification.model';
import { loadType } from '../../models/loadType.model';
import { loadCategory } from '../../models/loadCategory.model';
import { DialogPaypalComponent } from '../../dialogs/dialog-paypal/dialog-paypal.component';

const MAX_SIZE: number = 1048576;

@Component({
    selector: 'loads-available',
    templateUrl: './loads-available.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LoadsAvailableComponent implements OnInit {
    loading: boolean = true;
    rangeItems: any[] = [
        { description: '10km', value: 10 },
        { description: '50km', value: 50 },
        { description: '100km', value: 100 },
        { description: '500km', value: 500 },
        { description: 'ALL', value: 100000 },
    ]
    range: number = 50;
    weight: number = 50;
    volumeCm: number = 50;
    volumeLt: number = 100;
    tabIndex: number = 0;

    form: FormGroup;
    displayedColumns: string[];
    dataSource: MatTableDataSource<load>;
    @ViewChild(MatPaginator, { static: false }) paginatorLoad: MatPaginator;
    @ViewChild(MatSort, { static: false }) sortLoad: MatSort;

    notificationList: keyValue[] = [];

    theFile: any = null;
    messages: string[] = [];

    loadList: load[] = [];
    vehicleList: vehicle[] = [];
    driverList: driver[] = [];
    loadCategoryList: loadCategory[] = [];
    loadTypeList: loadType[] = [];

    quantity: number = Number(localStorage.getItem('vehiclesQuantity'));

    constructor(
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        public variableService: VariableService,
        private _router: Router,
        private fuseSplashScreenService: FuseSplashScreenService,
        private route: ActivatedRoute
    ) {
        this.fuseSplashScreenService.show(); this.loading = true;
        this.displayedColumns = this.getDisplayedColumns();//['cud', 'description', 'originatingAddressLabel', 'destinationAddressLabel', 'dateOut', 'weight', 'volume', 'statusDescription'];
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params.action == 'return') {
                console.log('now');
            }
        });

        if (this.quantity !== 0) {
            this.getNotifications().then(getNotificationsResult => {
                this.notificationList = getNotificationsResult;
            });
            this.getLoadCategories().then((getLoadCategoriesResult: loadCategory[]) => {
                this.loadCategoryList = getLoadCategoriesResult;
                this.getLoadTypes().then((getLoadTypesResult: loadType[]) => {
                    this.loadTypeList = getLoadTypesResult;
                    this.getVehicles().then((getVehiclesResult: vehicle[]) => {
                        this.vehicleList = getVehiclesResult;
                        this.vehicleList.forEach(vehicleItem => {
                            this.volumeCm = (vehicleItem.maxLoadLength * vehicleItem.maxLoadHeight * vehicleItem.maxLoadWidth) > this.volumeCm ? (vehicleItem.maxLoadLength * vehicleItem.maxLoadHeight * vehicleItem.maxLoadWidth) : this.volumeCm;
                            this.weight = vehicleItem.maxLoadWeight > this.weight ? vehicleItem.maxLoadWeight : this.weight;
                            this.volumeLt = vehicleItem.maxLoadVolume > this.volumeLt ? vehicleItem.maxLoadVolume : this.volumeLt;
                        })
                        this.getDrivers().then((getDriversResult: driver[]) => {
                            this.driverList = getDriversResult;
                            this.getLoads().then((getLoadsResult: load[]) => {
                                this.variableService.setPageSelected('Loads Available');
                                this.loadList = getLoadsResult;
                                this.dataSource = new MatTableDataSource(this.loadList);
                                this.fuseSplashScreenService.hide(); this.loading = false;
                            });
                        });
                    });
                });
            });
        } else {
            this.showPaypal();
        }
    }
    load() {
        this.tabIndex = 0;
        this.fuseSplashScreenService.show(); this.loading = true;
        this.getLoads().then((getLoadsResult: load[]) => {
            this.loadList = getLoadsResult;
            this.dataSource = new MatTableDataSource(this.loadList);
            this.fuseSplashScreenService.hide(); this.loading = false;
        });
    }

    showPaypal() {
        this.fuseSplashScreenService.hide();
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { page: 'loads-available' };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogPaypalComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.displayedColumns = this.getDisplayedColumns();
    }
    getDisplayedColumns() {
        return window.innerWidth > 800 ? ['cud', 'description', 'originatingAddressLabel', 'destinationAddressLabel', 'dateOut', 'weight', 'volumeCm', 'volumeLt', 'statusDescription'] : ['cud', 'description', 'destinationAddressLabel', 'dateOut', 'statusDescription'];
    }

    getLoadCategories(): Promise<loadCategory[]> {
        var promise = new Promise<loadCategory[]>((resolve) => {
            try {
                this.apiService.get('loadCategories').subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            resolve(apiResult.data);
                        } else {
                            if (apiResult.message == 'Expired') {
                                this._router.navigate(['/sign-out']);
                            } else {
                                this._snackBar.open('Error: ' + apiResult.message, null, { duration: 2000 });
                                this.fuseSplashScreenService.hide(); this.loading = false;
                            }
                        }
                    },
                    error: (error) => {
                        console.log(error);
                        this._snackBar.open('Error: ' + error, null, { duration: 2000 });
                        this.fuseSplashScreenService.hide(); this.loading = false;
                    },
                    complete: () => {
                        //console.log('Done');
                    }
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    getLoadTypes(): Promise<loadType[]> {
        var promise = new Promise<loadType[]>((resolve) => {
            try {
                this.apiService.get('loadTypes').subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            resolve(apiResult.data);
                        } else {
                            if (apiResult.message == 'Expired') {
                                this._router.navigate(['/sign-out']);
                            } else {
                                this._snackBar.open('Error: ' + apiResult.message, null, { duration: 2000 });
                                this.fuseSplashScreenService.hide(); this.loading = false;
                            }
                        }
                    },
                    error: (error) => {
                        console.log(error);
                        this._snackBar.open('Error: ' + error, null, { duration: 2000 });
                        this.fuseSplashScreenService.hide(); this.loading = false;
                    },
                    complete: () => {
                        //console.log('Done');
                    }
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    getVehicles(): Promise<vehicle[]> {
        var promise = new Promise<vehicle[]>((resolve) => {
            try {
                this.apiService.get('vehicles').subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            resolve(apiResult.data);
                        } else {
                            if (apiResult.message == 'Expired') {
                                this._router.navigate(['/sign-out']);
                            } else {
                                this._snackBar.open('Error: ' + apiResult.message, null, { duration: 2000 });
                                this.fuseSplashScreenService.hide(); this.loading = false;
                            }
                        }
                    },
                    error: (error) => {
                        console.log(error);
                        this._snackBar.open('Error: ' + error, null, { duration: 2000 });
                        this.fuseSplashScreenService.hide(); this.loading = false;
                    },
                    complete: () => {
                        //console.log('Done');
                    }
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    getDrivers(): Promise<driver[]> {
        var promise = new Promise<driver[]>((resolve) => {
            try {
                this.apiService.get('drivers').subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            resolve(apiResult.data);
                        } else {
                            if (apiResult.message == 'Expired') {
                                this._router.navigate(['/sign-out']);
                            } else {
                                this._snackBar.open('Error: ' + apiResult.message, null, { duration: 2000 });
                                this.fuseSplashScreenService.hide(); this.loading = false;
                            }
                        }
                    },
                    error: (error) => {
                        console.log(error);
                        this._snackBar.open('Error: ' + error, null, { duration: 2000 });
                        this.fuseSplashScreenService.hide(); this.loading = false;
                    },
                    complete: () => {
                        //console.log('Done');
                    }
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    getLoads(): Promise<load[]> {
        var promise = new Promise<load[]>((resolve) => {
            try {
                this.apiService.post('loads', 'available', { distance: this.range, weight: this.weight, volumeCm: this.volumeCm, volumeLt: this.volumeLt }).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            resolve(apiResult.data);
                        } else {
                            if (apiResult.message == 'Expired') {
                                this._router.navigate(['/sign-out']);
                            } else {
                                this._snackBar.open('Error: ' + apiResult.message, null, { duration: 2000 });
                                this.fuseSplashScreenService.hide(); this.loading = false;
                            }
                        }
                    },
                    error: (error) => {
                        console.log(error);
                        this._snackBar.open('Error: ' + error, null, { duration: 2000 });
                        this.fuseSplashScreenService.hide(); this.loading = false;
                    },
                    complete: () => {
                        //console.log('Done');
                    }
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    getNotifications(): Promise<notification[]> {
        var promise = new Promise<notification[]>((resolve) => {
            try {
                this.apiService.get('notifications').subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            resolve(apiResult.data);
                        } else {
                            if (apiResult.message == 'Expired') {
                                this._router.navigate(['/sign-out']);
                            } else {
                                this._snackBar.open('Error: ' + apiResult.message, null, { duration: 2000 });
                                this.fuseSplashScreenService.hide(); this.loading = false;
                            }
                        }
                    },
                    error: (error) => {
                        console.log(error);
                        this._snackBar.open('Error: ' + error, null, { duration: 2000 });
                        this.fuseSplashScreenService.hide(); this.loading = false;
                    },
                    complete: () => {
                        //console.log('Done');
                    }
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    initUpsert(row, readOnly) {
        this.form = this._formBuilder.group({
            id: [row == null ? Guid.create().toString() : row.id],
            userId: [row == null ? localStorage.getItem('userId') : row.userId],
            loadCategoryId: [row == null ? null : row.loadCategoryId],
            loadTypeId: [{ value: row == null ? null : row.loadTypeId, disabled: readOnly == 1 }, Validators.required],
            description: [{ value: row == null ? null : row.description, disabled: readOnly == 1 }, Validators.required],
            note: [{ value: row == null ? null : row.note, disabled: readOnly == 1 }, Validators.required],
            price: [{ value: row == null ? null : row.price, disabled: readOnly == 1 }, Validators.required],
            originatingAddressLabel: [{ value: row == null ? null : row.originatingAddressLabel, disabled: readOnly == 1 }, Validators.required],
            originatingAddressLat: [{ value: row == null ? null : row.originatingAddressLat, disabled: readOnly == 1 }, Validators.required],
            originatingAddressLon: [{ value: row == null ? null : row.originatingAddressLon, disabled: readOnly == 1 }, Validators.required],
            destinationAddressLabel: [{ value: row == null ? null : row.destinationAddressLabel, disabled: readOnly == 1 }, Validators.required],
            destinationAddressLat: [{ value: row == null ? null : row.destinationAddressLat, disabled: readOnly == 1 }, Validators.required],
            destinationAddressLon: [{ value: row == null ? null : row.destinationAddressLon, disabled: readOnly == 1 }, Validators.required],
            itemCount: [{ value: row == null ? null : row.itemCount, disabled: readOnly == 1 }, Validators.required],
            weight: [{ value: row == null ? null : row.weight, disabled: readOnly == 1 }, Validators.required],
            length: [{ value: row == null ? null : row.length, disabled: readOnly == 1 }, Validators.required],
            width: [{ value: row == null ? null : row.width, disabled: readOnly == 1 }, Validators.required],
            height: [{ value: row == null ? null : row.height, disabled: readOnly == 1 }, Validators.required],
            volume: [{ value: row == null ? null : row.volume, disabled: readOnly == 1 }, Validators.required],
            totalValue: [{ value: row == null ? null : row.totalValue, disabled: readOnly == 1 }, Validators.required],
            dateOut: [{ value: row == null ? null : row.dateOut, disabled: readOnly == 1 }, Validators.required],
            dateIn: [{ value: row == null ? null : row.dateIn, disabled: readOnly == 1 }, Validators.required],
            dateBidEnd: [{ value: row == null ? null : row.dateBidEnd, disabled: readOnly == 1 }, Validators.required],
            notificationId: [{ value: row == null ? null : row.notificationId, disabled: readOnly == 1 }, Validators.required],
            notificationDescription: [row == null ? null : row.notificationDescription],
            avatar: [row == null ? null : row.avatar],
            avatarChanged: [false],
            statusId: [row == null ? Guid.parse('7FD7D57C-C4FD-4A7C-A0C7-B4FBADFB0112').toString() : row.statusId],
            statusDescription: [row == null ? null : row.statusDescription],
            review: [row.review],
            reviewCount: [row.reviewCount],
            bidCount: [row.bidCount]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.form,
            notificationList: this.notificationList,
            vehicleList: this.vehicleList,
            driverList: this.driverList,
            loadCategoryList: this.loadCategoryList,
            loadTypeList: this.loadTypeList,
            //statusList: this.statusList,
            originatingAddressLabel: row == null ? null : row.originatingAddressLabel,
            originatingAddressLat: row == null ? null : row.originatingAddressLat,
            originatingAddressLon: row == null ? null : row.originatingAddressLon,
            destinationAddressLabel: row == null ? null : row.destinationAddressLabel,
            destinationAddressLat: row == null ? null : row.destinationAddressLat,
            destinationAddressLon: row == null ? null : row.destinationAddressLon,
            title: readOnly ? 'View' : row == null ? 'Insert' : 'Update',
            readOnly: readOnly
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogLoadComponent,
            dialogConfig);
    }

    getAddressSubstring(str: string, char: string) {
        let arr = str.split(char);
        return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
    }
}
