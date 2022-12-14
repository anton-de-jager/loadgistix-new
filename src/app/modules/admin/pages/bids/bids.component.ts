import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { ApiService } from 'app/modules/admin/services/api.service';
import { bid } from 'app/modules/admin/models/bid.model';
import { driver } from 'app/modules/admin/models/driver.model';
import { load } from 'app/modules/admin/models/load.model';
import { vehicle } from 'app/modules/admin/models/vehicle.model';
import { status } from 'app/modules/admin/models/status.model';
import { Guid } from 'guid-typescript';
import { first } from 'rxjs';
import { DialogBidComponent } from 'app/modules/admin/dialogs/dialog-bid/dialog-bid.component';
import { StarRatingColor } from '../../controls/star-rating/star-rating.component';
import { VariableService } from 'app/shared/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DialogReviewComponent } from '../../dialogs/dialog-review/dialog-review.component';
import { User } from 'app/core/user/user.types';
import { DialogPaypalComponent } from '../../dialogs/dialog-paypal/dialog-paypal.component';
//import {promises as fs} from 'fs';

@Component({
    selector: 'bids',
    templateUrl: './bids.component.html',
    encapsulation: ViewEncapsulation.None
})
export class BidsComponent implements OnInit {
    loading: boolean = true;
    form: FormGroup;
    loadList: load[] = [];
    vehicleList: vehicle[] = [];
    driverList: driver[] = [];
    bidList: bid[] = [];
    user: User;

    displayedColumns: string[];
    dataSource: MatTableDataSource<bid>;
    @ViewChild(MatPaginator, { static: false }) paginatorBid: MatPaginator;
    @ViewChild(MatSort, { static: false }) sortBid: MatSort;

    starColor: StarRatingColor = StarRatingColor.accent;
    starColorP: StarRatingColor = StarRatingColor.primary;
    starColorW: StarRatingColor = StarRatingColor.warn;

    userId = localStorage.getItem('userId');

    deleteForm: FormGroup;

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
        this.displayedColumns = ['cud', 'loadDescription', 'vehicleDescription', 'driverDescription', 'price', 'statusDescription'];
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if(params.action == 'return'){
                console.log('now');
            }
        });
        
        this.getLoads().then(getLoadsResult => {
            this.loadList = getLoadsResult;
            //('userId', this.userId);
            //console.log('loadList', this.loadList);
            this.getVehicles().then(getVehiclesResult => {
                this.vehicleList = getVehiclesResult;
                this.getDrivers().then(getDriversResult => {
                    this.driverList = getDriversResult;
                    this.getBids().then(getBidResult => {
                        this.variableService.setPageSelected('Bids');
                        this.bidList = getBidResult;
                        this.dataSource = new MatTableDataSource(this.bidList);
                        this.fuseSplashScreenService.hide(); this.loading = false;
                    });
                });
            });
        });
    }

    showPaypal() {
        this.fuseSplashScreenService.hide();
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { page: 'bids' };

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

    getBids(): Promise<bid[]> {
        var promise = new Promise<bid[]>((resolve) => {
            try {
                this.apiService.get('bids').subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            //console.log(apiResult.data);
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

    initUpsert(row, readOnly) {
        this.form = this._formBuilder.group({
            id: [row == null ? Guid.create().toString() : row.id],
            userId: [row == null ? localStorage.getItem('userId') : row.userId],
            loadId: [{ value: row == null ? null : row.loadId, disabled: readOnly == 1 }, Validators.required],
            loadDescription: [row == null ? null : row.loadDescription],
            vehicleId: [{ value: row == null ? null : row.vehicleId, disabled: readOnly == 1 }, Validators.required],
            vehicleDescription: [row == null ? null : row.vehicleDescription],
            driverId: [{ value: row == null ? null : row.driverId, disabled: readOnly == 1 }, Validators.required],
            driverDescription: [row == null ? null : row.driverDescription],
            price: [{ value: row == null ? null : row.price, disabled: readOnly == 1 }, Validators.required],
            dateOut: [{ value: row == null ? null : row.dateOut, disabled: readOnly == 1 }, Validators.required],
            dateIn: [{ value: row == null ? null : row.dateIn, disabled: readOnly == 1 }, Validators.required],
            statusId: [row == null ? Guid.parse('B3B7D04D-64B7-4ED7-BFE1-CF06D2B4A8AB') : row.statusId],
            statusDescription: [row == null ? null : row.statusDescription],
            reviewDriver: [row.reviewDriver],
            reviewDriverCount: [row.reviewDriverCount]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.form,
            loadList: this.loadList,
            vehicleList: this.vehicleList,
            driverList: this.driverList,
            title: readOnly ? 'View' : row == null ? 'Insert' : 'Update',
            readOnly: readOnly
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
                if (row == null) {
                    this.apiService.post('bids', null, result).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                this.getBids().then(getBidResult => {
                                    this.bidList = getBidResult;
                                    this.dataSource = new MatTableDataSource(this.bidList);
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
                    this.apiService.put('bids', result).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                setTimeout(() => {
                                    this.getBids().then(getBidResult => {
                                        this.bidList = getBidResult;
                                        this.dataSource = new MatTableDataSource(this.bidList);
                                        this.fuseSplashScreenService.hide(); this.loading = false;
                                    });
                                }, 100);
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
    }
    initDelete(id) {
        this.deleteForm = this._formBuilder.group({
            title: 'Delete Bid',
            message: 'Are you sure you want to remove this Bid?',
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
                this.apiService.delete('bids', id).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            this.bidList.splice(this.bidList.findIndex(item => item.id === apiResult.id), 1);
                            this.dataSource = new MatTableDataSource(this.bidList);
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

    updateStatus(row, status) {
        if (status === 'Delivered' || status === 'Completed') {
            this.initRating(row, 'Load', status);
        } else {
            this.fuseSplashScreenService.show(); this.loading = true;
            this.apiService.post('loads', 'status', { id: row.loadId, description: status }).subscribe({
                next: (apiResult: any) => {
                    if (apiResult.result == true) {
                        this.getBids().then(getBidsResult => {
                            this.dataSource = new MatTableDataSource(getBidsResult);
                            this.fuseSplashScreenService.hide(); this.loading = false;
                        });
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
                this.apiService.post('reviewLoads', null, { loadId: row.loadId, ratingPunctuality: result.ratingPunctuality, ratingLoadDescription: result.ratingLoadDescription, ratingPayment: result.ratingPayment, ratingCare: result.ratingCare, ratingAttitude: result.ratingAttitude, note: result.note }).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            this.apiService.post('loads', 'status', { id: row.loadId, description: status }).subscribe({
                                next: (apiResult: any) => {
                                    if (apiResult.result == true) {
                                        this.getBids().then(getBidsResult => {
                                            this.dataSource = new MatTableDataSource(getBidsResult);
                                            this.fuseSplashScreenService.hide(); this.loading = false;
                                        });
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

    getAddressSubstring(str: string, char: string) {
        let arr = str.split(char);
        return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
    }

    onRatingChanged(rating) {
    }
}
