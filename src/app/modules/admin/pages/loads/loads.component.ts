import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { ApiService } from 'app/modules/admin/services/api.service';
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
import { DialogBidListComponent } from '../../dialogs/dialog-bid-list/dialog-bid-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { notification } from '../../models/notification.model';
import { status } from '../../models/status.model';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DialogReviewComponent } from '../../dialogs/dialog-review/dialog-review.component';
import { loadCategory } from '../../models/loadCategory.model';
import { loadType } from '../../models/loadType.model';
import { HttpEventType } from '@angular/common/http';
import { User } from 'app/core/user/user.types';
import { DialogPaypalComponent } from '../../dialogs/dialog-paypal/dialog-paypal.component';

const MAX_SIZE: number = 1048576;

@Component({
    selector: 'loads',
    templateUrl: './loads.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LoadsComponent implements OnInit {
    timestamp: number = 0;
    loading: boolean = true;
    rangeItems: any[] = [
        { description: '10km', value: 10 },
        { description: '50km', value: 50 },
        { description: '100km', value: 100 },
        { description: '500km', value: 500 },
        { description: 'ALL', value: 100000 }
    ]
    range: number = 50;
    user: User;

    form: FormGroup;
    displayedColumns: string[];
    dataSource: MatTableDataSource<load>;
    @ViewChild(MatPaginator, { static: false }) paginatorLoad: MatPaginator;
    @ViewChild(MatSort, { static: false }) sortLoad: MatSort;

    notificationList: notification[] = [];

    theFile: any = null;
    messages: string[] = [];

    loadList: load[] = [];
    vehicleList: vehicle[] = [];
    driverList: driver[] = [];
    loadCategoryList: loadCategory[] = [];
    loadTypeList: loadType[] = [];

    userId = localStorage.getItem('userId');

    deleteForm: FormGroup;

    quantity: number = Number(localStorage.getItem('loadsQuantity'));

    constructor(
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        public variableService: VariableService,
        private _router: Router,
        private fuseSplashScreenService: FuseSplashScreenService,
        private fuseConfirmationService: FuseConfirmationService,
        private route: ActivatedRoute
    ) {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.fuseSplashScreenService.show(); this.loading = true;
        this.displayedColumns = this.getDisplayedColumns();//this.displayedColumns = ['cud', 'description', 'originatingAddressLabel', 'destinationAddressLabel', 'dateOut', 'weight', 'statusDescription', 'bidCount'];
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params.action == 'return') {
                console.log('now');
            }
        });

        this.getLoadCategories().then((getLoadCategoriesResult: loadCategory[]) => {
            this.loadCategoryList = getLoadCategoriesResult;
            this.getLoadTypes().then((getLoadTypesResult: loadType[]) => {
                this.loadTypeList = getLoadTypesResult;
                this.getVehicles().then((getVehiclesResult: vehicle[]) => {
                    this.vehicleList = getVehiclesResult;
                    this.getDrivers().then((getDriversResult: driver[]) => {
                        this.variableService.setPageSelected('Loads');
                        this.driverList = getDriversResult;
                    });
                });
            });
        });
        this.getNotifications().then(getNotificationsResult => {
            this.notificationList = getNotificationsResult;
            this.getLoads().then(getLoadsResult => {
                this.loadList = getLoadsResult;
                //console.log('userId', this.userId);
                //console.log('loadList', this.loadList);
                this.dataSource = new MatTableDataSource(this.loadList);
                this.fuseSplashScreenService.hide(); this.loading = false;
            });
        });
    }

    showPaypal() {
        this.fuseSplashScreenService.hide();
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { page: 'loads' };

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
        return window.innerWidth > 1000 ? ['cud', 'bidCount', 'description', 'originatingAddressLabel', 'destinationAddressLabel', 'dateOut', 'weight', 'statusDescription'] : ['cud', 'bidCount', 'description', 'destinationAddressLabel', 'dateOut', 'statusDescription'];
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
                this.apiService.get('loads').subscribe({
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

    initUpsert(row) {
        if (this.dataSource.data.length < this.quantity || this.quantity === -1 || row !== null) {
            this.form = this._formBuilder.group({
                id: [row == null ? Guid.create().toString() : row.id],
                userId: [row == null ? localStorage.getItem('userId') : row.userId],
                loadCategoryId: [row == null ? null : row.loadCategoryId],
                loadTypeId: [row == null ? null : row.loadTypeId, Validators.required],
                description: [row == null ? null : row.description, Validators.required],
                note: [row == null ? null : row.note, Validators.required],
                price: [row == null ? null : row.price, Validators.required],
                originatingAddressLabel: [row == null ? null : row.originatingAddressLabel, Validators.required],
                originatingAddressLat: [row == null ? null : row.originatingAddressLat, Validators.required],
                originatingAddressLon: [row == null ? null : row.originatingAddressLon, Validators.required],
                destinationAddressLabel: [row == null ? null : row.destinationAddressLabel, Validators.required],
                destinationAddressLat: [row == null ? null : row.destinationAddressLat, Validators.required],
                destinationAddressLon: [row == null ? null : row.destinationAddressLon, Validators.required],
                itemCount: [row == null ? null : row.itemCount, Validators.required],
                weight: [row == null ? null : row.weight, Validators.required],
                length: [row == null ? null : row.length, Validators.required],
                width: [row == null ? null : row.width, Validators.required],
                height: [row == null ? null : row.height, Validators.required],
                volume: [row == null ? null : row.volume, Validators.required],
                totalValue: [row == null ? null : row.totalValue, Validators.required],
                dateOut: [row == null ? null : row.dateOut, Validators.required],
                dateIn: [row == null ? null : row.dateIn, Validators.required],
                dateBidEnd: [row == null ? null : row.dateBidEnd, Validators.required],
                notificationId: [row == null ? null : row.notificationId, Validators.required],
                notificationDescription: [row == null ? null : row.notificationDescription],
                avatar: [row == null ? null : row.avatar],
                avatarChanged: [false],
                fileToUpload: [null],
                statusId: [row == null ? Guid.parse('7FD7D57C-C4FD-4A7C-A0C7-B4FBADFB0112').toString() : row.statusId],
                statusDescription: [row == null ? null : row.statusDescription]
            });

            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: row,
                form: this.form,
                notificationList: this.notificationList,
                loadCategoryList: this.loadCategoryList,
                loadTypeList: this.loadTypeList,
                originatingAddressLabel: row == null ? null : row.originatingAddressLabel,
                originatingAddressLat: row == null ? null : row.originatingAddressLat,
                originatingAddressLon: row == null ? null : row.originatingAddressLon,
                destinationAddressLabel: row == null ? null : row.destinationAddressLabel,
                destinationAddressLat: row == null ? null : row.destinationAddressLat,
                destinationAddressLon: row == null ? null : row.destinationAddressLon,
                title: row == null ? 'Insert' : 'Update'
            }

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "800px";

            const dialogRef = this.dialog.open(DialogLoadComponent,
                dialogConfig);

            dialogRef.afterClosed().subscribe(result => {
                if (result !== false) {
                    this.fuseSplashScreenService.show(); this.loading = true;
                    if (row == null) {
                        this.apiService.post('loads', null, result).subscribe({
                            next: (apiResult: any) => {
                                if (apiResult.result == true) {
                                    if (apiResult.id != '00000000-0000-0000-0000-000000000000' && result.fileToUpload) {
                                        this.uploadFile(result.fileToUpload, apiResult.id + '.' + result.fileToUpload.name.split('.').pop()).then(x => {
                                            apiResult.data.avatar = '.' + result.fileToUpload.name.split('.').pop();
                                            this.loadList.push(apiResult.data);
                                            this.dataSource = new MatTableDataSource(this.loadList);
                                            this.fuseSplashScreenService.hide(); this.loading = false;
                                            this.timestamp = new Date().getTime();
                                        });
                                    } else {
                                        this.loadList.push(apiResult.data);
                                        this.dataSource = new MatTableDataSource(this.loadList);
                                        this.fuseSplashScreenService.hide(); this.loading = false;
                                    }
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
                    } else {
                        this.apiService.put('loads', result).subscribe({
                            next: (apiResult: any) => {
                                if (apiResult.result == true) {
                                    if (apiResult.id != '00000000-0000-0000-0000-000000000000' && result.fileToUpload) {
                                        this.uploadFile(result.fileToUpload, apiResult.id + '.' + result.fileToUpload.name.split('.').pop()).then(x => {
                                            apiResult.data.avatar = '.' + result.fileToUpload.name.split('.').pop();
                                            let objIndex = this.loadList.findIndex(x => x.id === row.id);
                                            this.loadList[objIndex] = apiResult.data;
                                            this.dataSource = new MatTableDataSource(this.loadList);
                                            this.fuseSplashScreenService.hide(); this.loading = false;
                                            this.timestamp = new Date().getTime();
                                        });
                                    } else {
                                        let objIndex = this.loadList.findIndex(x => x.id === row.id);
                                        this.loadList[objIndex] = apiResult.data;
                                        this.dataSource = new MatTableDataSource(this.loadList);
                                        this.fuseSplashScreenService.hide(); this.loading = false;
                                    }
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
                    }
                }
            });
        } else {
            this.showPaypal();
        }
    }
    initDelete(id) {
        this.deleteForm = this._formBuilder.group({
            title: 'Delete Load',
            message: 'Are you sure you want to remove this Load',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn'
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Remove',
                    color: 'warn'
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancel'
                })
            }),
            dismissible: true
        });

        const dialogRef = this.fuseConfirmationService.open(this.deleteForm.value);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.fuseSplashScreenService.show(); this.loading = true;
                this.apiService.delete('loads', id).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            this.loadList.splice(this.loadList.findIndex(item => item.id === apiResult.id), 1);
                            this.dataSource = new MatTableDataSource(this.loadList);
                            this.fuseSplashScreenService.hide(); this.loading = false;
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
            }
        });
    }

    initRating(row, reviewType, status) {
        this.form = this._formBuilder.group({
            id: [Guid.create()],
            loadId: [row.id],
            userId: [row.userId],
            ratingPunctuality: [0],
            ratingVehicleDescription: [0],
            ratingLoadDescription: [0],
            ratingCare: [0],
            ratingCondition: [0],
            ratingPayment: [0],
            ratingAttitude: [0],
            note: ['']
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.form,
            reviewType: reviewType,
            title: 'Add'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogReviewComponent,
            dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                this.fuseSplashScreenService.show(); this.loading = true;
                this.apiService.post('reviewDrivers', null, { loadId: row.id, ratingPunctuality: result.ratingPunctuality, ratingVehicleDescription: result.ratingVehicleDescription, ratingCare: result.ratingCare, ratingCondition: result.ratingCondition, ratingAttitude: result.ratingAttitude, note: result.note }).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            this.apiService.post('loads', 'status', { id: row.id, description: status, userIdAccepted: row.userIdAccepted, userIdLoaded: row.userIdLoaded, userIdLoadedConfirmed: row.userIdLoadedConfirmed, userIdDelivered: row.userIdDelivered, userIdDeliveredConfirmed: row.userIdDeliveredConfirmed }).subscribe({
                                next: (apiResult: any) => {
                                    if (apiResult.result == true) {
                                        this.getLoads().then(getLoadsResult => {
                                            this.dataSource = new MatTableDataSource(getLoadsResult);
                                            this.fuseSplashScreenService.hide(); this.loading = false;
                                        });
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
            }
        });
    }

    viewBids(row) {
        this.form = this._formBuilder.group({
            id: [row == null ? Guid.create().toString() : row.id],
            userId: [row == null ? localStorage.getItem('userId') : row.userId],
            loadCategoryId: [row == null ? null : row.loadCategoryId],
            loadTypeId: [row == null ? null : row.loadTypeId, Validators.required],
            description: [row == null ? null : row.description, Validators.required],
            note: [row == null ? null : row.note, Validators.required],
            price: [row == null ? null : row.price, Validators.required],
            originatingAddressLabel: [row == null ? null : row.originatingAddressLabel, Validators.required],
            originatingAddressLat: [row == null ? null : row.originatingAddressLat, Validators.required],
            originatingAddressLon: [row == null ? null : row.originatingAddressLon, Validators.required],
            destinationAddressLabel: [row == null ? null : row.destinationAddressLabel, Validators.required],
            destinationAddressLat: [row == null ? null : row.destinationAddressLat, Validators.required],
            destinationAddressLon: [row == null ? null : row.destinationAddressLon, Validators.required],
            itemCount: [row == null ? null : row.itemCount, Validators.required],
            weight: [row == null ? null : row.weight, Validators.required],
            length: [row == null ? null : row.length, Validators.required],
            width: [row == null ? null : row.width, Validators.required],
            height: [row == null ? null : row.height, Validators.required],
            totalValue: [row == null ? null : row.totalValue, Validators.required],
            dateOut: [row == null ? null : row.dateOut, Validators.required],
            dateIn: [row == null ? null : row.dateIn, Validators.required],
            dateBidEnd: [row == null ? null : row.dateBidEnd, Validators.required],
            notificationId: [row == null ? null : row.notificationId, Validators.required],
            avatar: [row == null ? null : row.avatar],
            avatarChanged: [false],
            statusId: [row == null ? Guid.parse('7FD7D57C-C4FD-4A7C-A0C7-B4FBADFB0112') : row.statusId]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            loadId: row.id,
            item: row,
            form: this.form,
            notificationList: this.notificationList,
            loadList: this.loadList,
            vehicleList: this.vehicleList,
            driverList: this.driverList,
            originatingAddressLabel: row == null ? null : row.originatingAddressLabel,
            originatingAddressLat: row == null ? null : row.originatingAddressLat,
            originatingAddressLon: row == null ? null : row.originatingAddressLon,
            destinationAddressLabel: row == null ? null : row.destinationAddressLabel,
            destinationAddressLat: row == null ? null : row.destinationAddressLat,
            destinationAddressLon: row == null ? null : row.destinationAddressLon,
            title: 'View'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogBidListComponent,
            dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            //if (result !== false) {
            this.fuseSplashScreenService.show(); this.loading = true;
            this.getLoads().then(getLoadResult => {
                this.dataSource = new MatTableDataSource(getLoadResult);
                this.fuseSplashScreenService.hide(); this.loading = false;
            });
            //}
        });
    }

    updateStatus(row, status) {
        if (status === 'Delivered' || status === 'Completed') {
            this.initRating(row, 'Driver', status);
        } else {
            this.fuseSplashScreenService.show(); this.loading = true;
            this.apiService.post('loads', 'status', { id: row.id, description: status, userIdAccepted: row.userIdAccepted, userIdLoaded: row.userIdLoaded, userIdLoadedConfirmed: row.userIdLoadedConfirmed, userIdDelivered: row.userIdDelivered, userIdDeliveredConfirmed: row.userIdDeliveredConfirmed }).subscribe({
                next: (apiResult: any) => {
                    if (apiResult.result == true) {
                        this.getLoads().then(getLoadsResult => {
                            this.dataSource = new MatTableDataSource(getLoadsResult);
                            this.fuseSplashScreenService.hide(); this.loading = false;
                        });
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
        }
    }

    uploadFile(fileToUpload, filename): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                const formData = new FormData();
                formData.append('file', fileToUpload);
                this.apiService.upload('loads', formData, filename).subscribe(event => {
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

    getBidCount(id: Guid) {
        return this.loadList.find(x => x.id == id) ? this.loadList.find(x => x.id == id).bid.filter(y => y.status.description === 'Open').length : 0;
    }

    getAddressSubstring(str: string, char: string) {
        let arr = str.split(char);
        return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
    }
}
