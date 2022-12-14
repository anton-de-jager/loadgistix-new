import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { ApiService } from 'app/modules/admin/services/api.service';
import { driver } from 'app/modules/admin/models/driver.model';
import { licenceType } from 'app/modules/admin/models/licenceType.model';
import { Guid } from 'guid-typescript';
import { first } from 'rxjs';
import { DialogDriverComponent } from 'app/modules/admin/dialogs/dialog-driver/dialog-driver.component';
import { VariableService } from 'app/shared/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { HttpEventType } from '@angular/common/http';
import { DialogPaypalComponent } from '../../dialogs/dialog-paypal/dialog-paypal.component';
//import {promises as fs} from 'fs';

@Component({
    selector: 'drivers',
    templateUrl: './drivers.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DriversComponent implements OnInit {
    timestamp: number = 0;
    loading: boolean;
    form: FormGroup;
    licenceTypeList: licenceType[] = [];
    driverList: driver[] = [];

    displayedColumns: string[];
    dataSource: MatTableDataSource<driver>;
    @ViewChild(MatPaginator, { static: false }) paginatorDriver: MatPaginator;
    @ViewChild(MatSort, { static: false }) sortDriver: MatSort;

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
        this.displayedColumns = ['cud', 'firstName', 'lastName', 'licenceTypeDescription'];
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params.action == 'return') {
                console.log('now');
            }
        });

        if (this.quantity !== 0) {
            this.getLicenceTypes().then(getLicenceTypesResult => {
                this.licenceTypeList = getLicenceTypesResult;
                this.getDrivers().then(getDriverResult => {
                    this.variableService.setPageSelected('Drivers');
                    this.driverList = getDriverResult;
                    this.dataSource = new MatTableDataSource(this.driverList);
                    this.fuseSplashScreenService.hide(); this.loading = false;
                });
            });
        } else {
            this.fuseSplashScreenService.hide(); this.loading = false;
        }
    }

    showPaypal() {
        this.fuseSplashScreenService.hide();
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { page: 'drivers' };

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

    getLicenceTypes(): Promise<licenceType[]> {
        var promise = new Promise<licenceType[]>((resolve) => {
            try {
                this.apiService.get('licenceTypes').subscribe({
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
        if (this.quantity !== 0 || row !== null) {
            this.form = this._formBuilder.group({
                id: [row == null ? Guid.create().toString() : row.id],
                userId: [row == null ? localStorage.getItem('userId') : row.userId],
                firstName: [row == null ? null : row.firstName, Validators.required],
                lastName: [row == null ? null : row.lastName, Validators.required],
                phone: [row == null ? null : row.phone, Validators.required],
                email: [row == null ? null : row.email, Validators.required],
                password: [null],
                idNumber: [row == null ? null : row.idNumber, Validators.required],
                dateOfBirth: [row == null ? null : row.dateOfBirth, Validators.required],
                licenceTypeId: [row == null ? null : row.licenceTypeId, Validators.required],
                licenceExpiryDate: [row == null ? null : row.licenceExpiryDate, Validators.required],
                avatar: [row == null ? null : row.avatar],
                avatarChanged: [false],
                fileToUpload: [null],
                statusId: [row == null ? Guid.parse('50000F55-C3B0-4D92-BCFD-3203F5FD35B8').toString() : row.statusId]
            });

            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: row,
                form: this.form,
                licenceTypeList: this.licenceTypeList,
                title: row == null ? 'Insert' : 'Update'
            }

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "800px";

            const dialogRef = this.dialog.open(DialogDriverComponent,
                dialogConfig);

            dialogRef.afterClosed().subscribe(result => {
                if (result !== false) {
                    this.fuseSplashScreenService.show(); this.loading = true;
                    if (row == null) {
                        this.apiService.post('drivers', null, result).subscribe({
                            next: (apiResult: any) => {
                                if (apiResult.result == true) {
                                    if (apiResult.id != '00000000-0000-0000-0000-000000000000' && result.fileToUpload) {
                                        this.uploadFile(result.fileToUpload, apiResult.id + '.' + result.fileToUpload.name.split('.').pop()).then(x => {
                                            apiResult.data.avatar = '.' + result.fileToUpload.name.split('.').pop();
                                            this.driverList.push(apiResult.data);
                                            this.dataSource = new MatTableDataSource(this.driverList);
                                            this.fuseSplashScreenService.hide(); this.loading = false;
                                            this.timestamp = new Date().getTime();
                                        });
                                    } else {
                                        this.driverList.push(apiResult.data);
                                        this.dataSource = new MatTableDataSource(this.driverList);
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
                        this.apiService.put('drivers', result).subscribe({
                            next: (apiResult: any) => {
                                if (apiResult.result == true) {
                                    if (apiResult.id != '00000000-0000-0000-0000-000000000000' && result.fileToUpload) {
                                        this.uploadFile(result.fileToUpload, apiResult.id + '.' + result.fileToUpload.name.split('.').pop()).then(x => {
                                            apiResult.data.avatar = '.' + result.fileToUpload.name.split('.').pop();
                                            let objIndex = this.driverList.findIndex(x => x.id === row.id);
                                            this.driverList[objIndex] = apiResult.data;
                                            this.dataSource = new MatTableDataSource(this.driverList);
                                            this.fuseSplashScreenService.hide(); this.loading = false;
                                            this.timestamp = new Date().getTime();
                                        });
                                    } else {
                                        let objIndex = this.driverList.findIndex(x => x.id === row.id);
                                        this.driverList[objIndex] = apiResult.data;
                                        this.dataSource = new MatTableDataSource(this.driverList);
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
            title: 'Delete Driver',
            message: 'Are you sure you want to remove this Driver',
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
                this.apiService.delete('drivers', id).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            this.driverList.splice(this.driverList.findIndex(item => item.id === apiResult.id), 1);
                            this.dataSource = new MatTableDataSource(this.driverList);
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

    uploadFile(fileToUpload, filename): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                const formData = new FormData();
                formData.append('file', fileToUpload);
                this.apiService.upload('drivers', formData, filename).subscribe(event => {
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
