import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { ApiService } from 'app/modules/admin/services/api.service';
import { vehicle } from 'app/modules/admin/models/vehicle.model';
import { Guid } from 'guid-typescript';
import { first } from 'rxjs';
import { DialogVehicleComponent } from 'app/modules/admin/dialogs/dialog-vehicle/dialog-vehicle.component';
import { VariableService } from 'app/shared/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { vehicleCategory } from '../../models/vehicleCategory.model';
import { vehicleType } from '../../models/vehicleType.model';
import { status } from '../../models/status.model';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { HttpEventType } from '@angular/common/http';
import { DialogPaypalComponent } from '../../dialogs/dialog-paypal/dialog-paypal.component';

const MAX_SIZE: number = 1048576;

@Component({
    selector: 'vehicles',
    templateUrl: './vehicles.component.html',
    encapsulation: ViewEncapsulation.None
})
export class VehiclesComponent implements OnInit {
    timestamp: number = 0;
    loading: boolean = true;
    form: FormGroup;
    vehicleList: vehicle[] = [];
    statusList: status[] = [];

    displayedColumns: string[];
    dataSource: MatTableDataSource<vehicle>;
    @ViewChild(MatPaginator, { static: false }) paginatorVehicle: MatPaginator;
    @ViewChild(MatSort, { static: false }) sortVehicle: MatSort;

    vehicleCategoryList: vehicleCategory[] = [];
    vehicleTypeList: vehicleType[] = [];

    theFile: any = null;
    messages: string[] = [];

    deleteForm: FormGroup;

    quantity: number = Number(localStorage.getItem('vehiclesQuantity'));

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
        this.fuseSplashScreenService.show(); this.loading = true;
        this.displayedColumns = ['cud', 'vehicleTypeDescription', 'availableFrom', 'availableTo'];
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params.action == 'return') {
                console.log('now');
            }
        });

        this.getStatusses().then(getStatussesResult => {
            this.statusList = getStatussesResult;
            this.getVehicleCategories().then(getVehicleCategoriesResult => {
                this.vehicleCategoryList = getVehicleCategoriesResult;
                this.getVehicleTypes().then(getVehicleTypesResult => {
                    this.vehicleTypeList = getVehicleTypesResult;
                    this.getVehicles().then(getVehicleResult => {
                        this.variableService.setPageSelected('Vehicles');
                        this.vehicleList = getVehicleResult;
                        this.dataSource = new MatTableDataSource(this.vehicleList);
                        this.fuseSplashScreenService.hide(); this.loading = false;
                        console.log(this.dataSource);
                    });
                });
            });
        });
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

    getVehicleCategories(): Promise<vehicleCategory[]> {
        var promise = new Promise<vehicleCategory[]>((resolve) => {
            try {
                this.apiService.get('vehicleCategories').subscribe({
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

    getVehicleTypes(): Promise<vehicleType[]> {
        var promise = new Promise<vehicleType[]>((resolve) => {
            try {
                this.apiService.get('vehicleTypes').subscribe({
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

    getStatusses(): Promise<status[]> {
        var promise = new Promise<status[]>((resolve) => {
            try {
                this.apiService.get('status').subscribe({
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

    showPaypal() {
        this.fuseSplashScreenService.hide();
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { page: 'vehicles' };

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

    initUpsert(row) {
        if (this.dataSource.data.length < this.quantity || this.quantity === -1 || row !== null) {
            this.form = this._formBuilder.group({
                id: [row == null ? Guid.create().toString() : row.id],
                userId: [row == null ? localStorage.getItem('userId') : row.userId],
                vehicleCategoryId: [row == null ? null : row.vehicleCategoryId],
                vehicleTypeId: [row == null ? null : row.vehicleTypeId, Validators.required],
                vehicleTypeDescription: [row == null ? null : row.vehicleTypeDescription],
                description: [row == null ? null : row.description, Validators.required],
                registrationNumber: [row == null ? null : row.registrationNumber, Validators.required],
                maxLoadWeight: [row == null ? null : row.maxLoadWeight, Validators.required],
                maxLoadHeight: [row == null ? null : row.maxLoadHeight, Validators.required],
                maxLoadWidth: [row == null ? null : row.maxLoadWidth, Validators.required],
                maxLoadLength: [row == null ? null : row.maxLoadLength, Validators.required],
                maxLoadVolume: [row == null ? null : row.maxLoadVolume, Validators.required],
                availableCapacity: [row == null ? null : row.availableCapacity, Validators.required],
                availableFrom: [row == null ? null : row.availableFrom],
                availableTo: [row == null ? null : row.availableTo],
                originatingAddressLabel: [row == null ? null : row.originatingAddressLabel, Validators.required],
                originatingAddressLat: [row == null ? null : row.originatingAddressLat, Validators.required],
                originatingAddressLon: [row == null ? null : row.originatingAddressLon, Validators.required],
                destinationAddressLabel: [row == null ? null : row.destinationAddressLabel],
                destinationAddressLat: [row == null ? null : row.destinationAddressLat],
                destinationAddressLon: [row == null ? null : row.destinationAddressLon],
                avatar: [row == null ? null : row.avatar],
                avatarChanged: [false],
                fileToUpload: [null],
                statusId: [row == null ? Guid.parse('982FCF45-4BE2-4DE8-8BCD-8E0A564206B2').toString() : row.statusId],
                statusDescription: [row == null ? null : row.statusDescription]
            });

            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: row,
                form: this.form,
                vehicleCategoryList: this.vehicleCategoryList,
                vehicleTypeList: this.vehicleTypeList,
                statusList: this.statusList,
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

            const dialogRef = this.dialog.open(DialogVehicleComponent,
                dialogConfig);


            dialogRef.afterClosed().subscribe(result => {
                if (result !== false) {
                    this.fuseSplashScreenService.show(); this.loading = true;
                    if (row == null) {
                        this.apiService.post('vehicles', null, result).subscribe({
                            next: (apiResult: any) => {
                                if (apiResult.result == true) {
                                    if (apiResult.id != '00000000-0000-0000-0000-000000000000' && result.fileToUpload) {
                                        this.uploadFile(result.fileToUpload, apiResult.id + '.' + result.fileToUpload.name.split('.').pop()).then(x => {
                                            apiResult.data.avatar = '.' + result.fileToUpload.name.split('.').pop();
                                            this.vehicleList.push(apiResult.data);
                                            this.dataSource = new MatTableDataSource(this.vehicleList);
                                            this.fuseSplashScreenService.hide(); this.loading = false;
                                            this.timestamp = new Date().getTime();
                                        });
                                    } else {
                                        this.vehicleList.push(apiResult.data);
                                        this.dataSource = new MatTableDataSource(this.vehicleList);
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
                        this.apiService.put('vehicles', result).subscribe({
                            next: (apiResult: any) => {
                                if (apiResult.result == true) {
                                    if (apiResult.id != '00000000-0000-0000-0000-000000000000' && result.fileToUpload) {
                                        this.uploadFile(result.fileToUpload, apiResult.id + '.' + result.fileToUpload.name.split('.').pop()).then(x => {
                                            apiResult.data.avatar = '.' + result.fileToUpload.name.split('.').pop();
                                            let objIndex = this.vehicleList.findIndex(x => x.id === row.id);
                                            this.vehicleList[objIndex] = apiResult.data;
                                            this.dataSource = new MatTableDataSource(this.vehicleList);
                                            this.fuseSplashScreenService.hide(); this.loading = false;
                                            this.timestamp = new Date().getTime();
                                        });
                                    } else {
                                        let objIndex = this.vehicleList.findIndex(x => x.id === row.id);
                                        this.vehicleList[objIndex] = apiResult.data;
                                        this.dataSource = new MatTableDataSource(this.vehicleList);
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
            title: 'Delete Vehicle',
            message: 'Are you sure you want to remove this Vehicle',
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

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                {
                    this.fuseSplashScreenService.show(); this.loading = true;
                    this.apiService.delete('vehicles', id).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                this.vehicleList.splice(this.vehicleList.findIndex(item => item.id === apiResult.id), 1);
                                this.dataSource = new MatTableDataSource(this.vehicleList);
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
        });
    }

    uploadFile(fileToUpload, filename): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                const formData = new FormData();
                formData.append('file', fileToUpload);
                this.apiService.upload('vehicles', formData, filename).subscribe(event => {
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

    getAddressSubstring(str: string, char: string) {
        let arr = str.split(char);
        return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
    }
}
