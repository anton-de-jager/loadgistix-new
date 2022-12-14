import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { ApiService } from 'app/modules/admin/services/api.service';
import { directory } from 'app/modules/admin/models/directory.model';
import { VariableService } from 'app/shared/variable.service';
import { Router } from '@angular/router';
import { vehicleType } from '../../models/vehicleType.model';
import { loadType } from '../../models/loadType.model';
import { Guid } from 'guid-typescript';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DialogLoadTypeComponent } from '../../dialogs/dialog-loadType/dialog-loadType.component';
import { vehicleCategory } from '../../models/vehicleCategory.model';
import { loadCategory } from '../../models/loadCategory.model';
import { DialogLoadCategoryComponent } from '../../dialogs/dialog-loadCategory/dialog-loadCategory.component';
import { DialogVehicleCategoryComponent } from '../../dialogs/dialog-vehicleCategory/dialog-vehicleCategory.component';
import { DialogVehicleTypeComponent } from '../../dialogs/dialog-vehicleType/dialog-vehicleType.component';

@Component({
    selector: 'lookups',
    templateUrl: './lookups.component.html',
    styleUrls: ['./lookups.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LookupsComponent implements OnInit {
    loading: boolean = true;

    vehicleCategoryList: vehicleCategory[] = [];
    displayedColumnsVehicleCategories: string[] = ['cud', 'description'];
    dataSourceVehicleCategories: MatTableDataSource<vehicleCategory>;
    formVehicleCategories: FormGroup;
    deleteFormVehicleCategories: FormGroup;
    @ViewChild('paginatorVehicleCategories', { static: false }) paginatorVehicleCategories: MatPaginator;
    @ViewChild('sortVehicleCategories', { static: false }) sortVehicleCategories: MatSort;

    vehicleTypeList: vehicleType[] = [];
    displayedColumnsVehicleTypes: string[] = ['cud', 'vehicleCategoryDescription', 'description', 'liquid'];
    dataSourceVehicleTypes: MatTableDataSource<vehicleType>;
    formVehicleTypes: FormGroup;
    deleteFormVehicleTypes: FormGroup;
    @ViewChild('paginatorVehicleTypes', { static: false }) paginatorVehicleTypes: MatPaginator;
    @ViewChild('sortVehicleTypes', { static: false }) sortVehicleTypes: MatSort;

    loadCategoryList: loadCategory[] = [];
    displayedColumnsLoadCategories: string[] = ['cud', 'description'];
    dataSourceLoadCategories: MatTableDataSource<loadCategory>;
    formLoadCategories: FormGroup;
    deleteFormLoadCategories: FormGroup;
    @ViewChild('paginatorLoadCategories', { static: false }) paginatorLoadCategories: MatPaginator;
    @ViewChild('sortLoadCategories', { static: false }) sortLoadCategories: MatSort;

    loadTypeList: loadType[] = [];
    displayedColumnsLoadTypes: string[] = ['cud', 'loadCategoryDescription', 'description', 'liquid'];
    dataSourceLoadTypes: MatTableDataSource<loadType>;
    formLoadTypes: FormGroup;
    deleteFormLoadTypes: FormGroup;
    @ViewChild('paginatorLoadTypes', { static: false }) paginatorLoadTypes: MatPaginator;
    @ViewChild('sortLoadTypes', { static: false }) sortLoadTypes: MatSort;

    constructor(
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        public variableService: VariableService,
        private _router: Router,
        private fuseSplashScreenService: FuseSplashScreenService,
        private fuseConfirmationService: FuseConfirmationService
    ) {
        this.fuseSplashScreenService.show(); this.loading = true;
        this.dataSourceVehicleCategories = new MatTableDataSource;
        this.dataSourceVehicleTypes = new MatTableDataSource;
        this.dataSourceLoadCategories = new MatTableDataSource;
        this.dataSourceLoadTypes = new MatTableDataSource;
    }

    ngOnInit(): void {
        this.getVehicleCategories().then(getVehicleCategoriesResult => {
            this.vehicleCategoryList = getVehicleCategoriesResult;
            this.dataSourceVehicleCategories.data = this.vehicleCategoryList;
            this.dataSourceVehicleCategories.paginator = this.paginatorVehicleCategories;
            this.dataSourceVehicleCategories.sort = this.sortVehicleCategories;
            this.getVehicleTypes().then(getVehicleTypesResult => {
                this.vehicleTypeList = getVehicleTypesResult;
                this.dataSourceVehicleTypes.data = this.vehicleTypeList;
                this.dataSourceVehicleTypes.paginator = this.paginatorVehicleTypes;
                this.dataSourceVehicleTypes.sortingDataAccessor = (item, property) => {
                    switch (property) {
                        case 'vehicleCategoryDescription': return item.vehicleCategory.description;
                        default: return item[property];
                    }
                };
                this.dataSourceVehicleTypes.sort = this.sortVehicleTypes;
                this.getLoadCategories().then(getLoadCategoriesResult => {
                    this.loadCategoryList = getLoadCategoriesResult;
                    this.dataSourceLoadCategories.data = this.loadCategoryList;
                    this.dataSourceLoadCategories.paginator = this.paginatorLoadCategories;
                    this.dataSourceLoadCategories.sort = this.sortLoadCategories;
                    this.getLoadTypes().then(getLoadTypesResult => {
                        this.loadTypeList = getLoadTypesResult;
                        this.dataSourceLoadTypes.data = this.loadTypeList;
                        this.dataSourceLoadTypes.paginator = this.paginatorLoadTypes;
                        this.dataSourceLoadTypes.sortingDataAccessor = (item, property) => {
                            switch (property) {
                                case 'loadCategoryDescription': return item.loadCategory.description;
                                default: return item[property];
                            }
                        };
                        this.dataSourceLoadTypes.sort = this.sortLoadTypes;
                        this.fuseSplashScreenService.hide(); this.loading = false;
                        this.variableService.setPageSelected('Lookups');
                    });
                });
            });
        });
    }

    getVehicleCategories(): Promise<vehicleCategory[]> {
        var promise = new Promise<vehicleCategory[]>((resolve) => {
            try {
                this.apiService.post('vehicleCategories', 'all', null).subscribe({
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
    initUpsertVehicleCategory(row) {
        this.formVehicleCategories = this._formBuilder.group({
            id: [row == null ? Guid.create().toString() : row.id],
            description: [row == null ? null : row.description, Validators.required]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.formVehicleCategories,
            vehicleCategoryList: this.vehicleCategoryList,
            title: row == null ? 'Insert' : 'Update'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogVehicleCategoryComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                this.fuseSplashScreenService.show(); this.loading = true;
                if (row == null) {
                    this.apiService.post('vehicleCategories', null, result).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                this.getVehicleCategories().then(getVehicleCategoriesResult => {
                                    this.vehicleCategoryList = getVehicleCategoriesResult;
                                    this.dataSourceVehicleCategories = new MatTableDataSource(this.vehicleCategoryList);
                                    setTimeout(() => {
                                        this.dataSourceVehicleCategories.paginator = this.paginatorVehicleCategories;
                                        this.dataSourceVehicleCategories.sort = this.sortVehicleCategories;
                                    }, 100);
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
                    this.apiService.put('vehicleCategories', result).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                this.getVehicleCategories().then(getVehicleCategoriesResult => {
                                    this.vehicleCategoryList = getVehicleCategoriesResult;
                                    this.dataSourceVehicleCategories = new MatTableDataSource(this.vehicleCategoryList);
                                    setTimeout(() => {
                                        this.dataSourceVehicleCategories.paginator = this.paginatorVehicleCategories;
                                        this.dataSourceVehicleCategories.sort = this.sortVehicleCategories;
                                    }, 100);
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
        });
    }
    initDeleteVehicleCategory(id) {
        this.deleteFormVehicleCategories = this._formBuilder.group({
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

        const dialogRef = this.fuseConfirmationService.open(this.deleteFormVehicleCategories.value);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                {
                    this.fuseSplashScreenService.show(); this.loading = true;
                    this.apiService.delete('vehicleCategories', id).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                this.vehicleCategoryList.splice(this.vehicleCategoryList.findIndex(item => item.id === apiResult.id), 1);
                                this.dataSourceVehicleCategories = new MatTableDataSource(this.vehicleCategoryList);
                                setTimeout(() => {
                                    this.dataSourceVehicleCategories.paginator = this.paginatorVehicleCategories;
                                    this.dataSourceVehicleCategories.sort = this.sortVehicleCategories;
                                }, 100);
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
    applyFilterVehicleCategories(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceVehicleCategories.filter = filterValue.trim().toLowerCase();

        if (this.dataSourceVehicleCategories.paginator) {
            this.dataSourceVehicleCategories.paginator.firstPage();
        }
    }

    getVehicleTypes(): Promise<vehicleType[]> {
        var promise = new Promise<vehicleType[]>((resolve) => {
            try {
                this.apiService.post('vehicleTypes', 'all', null).subscribe({
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
    initUpsertVehicleType(row) {
        this.formVehicleTypes = this._formBuilder.group({
            id: [row == null ? Guid.create().toString() : row.id],
            description: [row == null ? null : row.description, Validators.required],
            vehicleCategoryId: [row == null ? null : row.vehicleCategoryId, Validators.required],
            liquid: [row == null ? false : row.liquid]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.formVehicleTypes,
            vehicleCategoryList: this.vehicleCategoryList,
            title: row == null ? 'Insert' : 'Update'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogVehicleTypeComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                this.fuseSplashScreenService.show(); this.loading = true;
                if (row == null) {
                    this.apiService.post('vehicleTypes', null, result).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                this.getVehicleTypes().then(getVehicleTypesResult => {
                                    this.vehicleTypeList = getVehicleTypesResult;
                                    this.dataSourceVehicleTypes = new MatTableDataSource(this.vehicleTypeList);
                                    setTimeout(() => {
                                        this.dataSourceVehicleTypes.paginator = this.paginatorVehicleTypes;
                                        this.dataSourceVehicleTypes.sortingDataAccessor = (item, property) => {
                                            switch (property) {
                                                case 'vehicleCategoryDescription': return item.vehicleCategory.description;
                                                default: return item[property];
                                            }
                                        };
                                        this.dataSourceVehicleTypes.sort = this.sortVehicleTypes;
                                    }, 100);
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
                    this.apiService.put('vehicleTypes', result).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                this.getVehicleTypes().then(getVehicleTypesResult => {
                                    this.vehicleTypeList = getVehicleTypesResult;
                                    this.dataSourceVehicleTypes = new MatTableDataSource(this.vehicleTypeList);
                                    setTimeout(() => {
                                        this.dataSourceVehicleTypes.paginator = this.paginatorVehicleTypes;
                                        this.dataSourceVehicleTypes.sortingDataAccessor = (item, property) => {
                                            switch (property) {
                                                case 'vehicleCategoryDescription': return item.vehicleCategory.description;
                                                default: return item[property];
                                            }
                                        };
                                        this.dataSourceVehicleTypes.sort = this.sortVehicleTypes;
                                    }, 100);
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
        });
    }
    initDeleteVehicleType(id) {
        this.deleteFormVehicleTypes = this._formBuilder.group({
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

        const dialogRef = this.fuseConfirmationService.open(this.deleteFormVehicleTypes.value);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                {
                    this.fuseSplashScreenService.show(); this.loading = true;
                    this.apiService.delete('vehicleTypes', id).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                this.vehicleTypeList.splice(this.vehicleTypeList.findIndex(item => item.id === apiResult.id), 1);
                                this.dataSourceVehicleTypes = new MatTableDataSource(this.vehicleTypeList);
                                setTimeout(() => {
                                    this.dataSourceVehicleTypes.paginator = this.paginatorVehicleTypes;
                                    this.dataSourceVehicleTypes.sortingDataAccessor = (item, property) => {
                                        switch (property) {
                                            case 'vehicleCategoryDescription': return item.vehicleCategory.description;
                                            default: return item[property];
                                        }
                                    };
                                    this.dataSourceVehicleTypes.sort = this.sortVehicleTypes;
                                }, 100);
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
    applyFilterVehicleTypes(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceVehicleTypes.filter = filterValue.trim().toLowerCase();

        if (this.dataSourceVehicleTypes.paginator) {
            this.dataSourceVehicleTypes.paginator.firstPage();
        }
    }

    getLoadCategories(): Promise<loadCategory[]> {
        var promise = new Promise<loadCategory[]>((resolve) => {
            try {
                this.apiService.post('loadCategories', 'all', null).subscribe({
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
    initUpsertLoadCategory(row) {
        this.formLoadCategories = this._formBuilder.group({
            id: [row == null ? Guid.create().toString() : row.id],
            description: [row == null ? null : row.description, Validators.required],
            loadCategoryId: [row == null ? null : row.loadCategoryId, Validators.required],
            liquid: [row == null ? false : row.liquid]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.formLoadCategories,
            loadCategoryList: this.loadCategoryList,
            title: row == null ? 'Insert' : 'Update'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogLoadCategoryComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                this.fuseSplashScreenService.show(); this.loading = true;
                if (row == null) {
                    this.apiService.post('loadCategories', null, result).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                this.getLoadCategories().then(getLoadCategoriesResult => {
                                    this.loadCategoryList = getLoadCategoriesResult;
                                    this.dataSourceLoadCategories = new MatTableDataSource(this.loadCategoryList);
                                    setTimeout(() => {
                                        this.dataSourceLoadCategories.paginator = this.paginatorLoadCategories;
                                        this.dataSourceLoadCategories.sort = this.sortLoadCategories;
                                    }, 100);
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
                    this.apiService.put('loadCategories', result).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                this.getLoadCategories().then(getLoadCategoriesResult => {
                                    this.loadCategoryList = getLoadCategoriesResult;
                                    this.dataSourceLoadCategories = new MatTableDataSource(this.loadCategoryList);
                                    setTimeout(() => {
                                        this.dataSourceLoadCategories.paginator = this.paginatorLoadCategories;
                                        this.dataSourceLoadCategories.sort = this.sortLoadCategories;
                                    }, 100);
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
        });
    }
    initDeleteLoadCategory(id) {
        this.deleteFormLoadCategories = this._formBuilder.group({
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

        const dialogRef = this.fuseConfirmationService.open(this.deleteFormLoadCategories.value);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                {
                    this.fuseSplashScreenService.show(); this.loading = true;
                    this.apiService.delete('loadCategories', id).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                this.loadCategoryList.splice(this.loadCategoryList.findIndex(item => item.id === apiResult.id), 1);
                                this.dataSourceLoadCategories = new MatTableDataSource(this.loadCategoryList);
                                setTimeout(() => {
                                    this.dataSourceLoadCategories.paginator = this.paginatorLoadCategories;
                                    this.dataSourceLoadCategories.sort = this.sortLoadCategories;
                                }, 100);
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
    applyFilterLoadCategories(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceLoadCategories.filter = filterValue.trim().toLowerCase();

        if (this.dataSourceLoadCategories.paginator) {
            this.dataSourceLoadCategories.paginator.firstPage();
        }
    }

    getLoadTypes(): Promise<loadType[]> {
        var promise = new Promise<loadType[]>((resolve) => {
            try {
                this.apiService.post('loadTypes', 'all', null).subscribe({
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
    initUpsertLoadType(row) {
        this.formLoadTypes = this._formBuilder.group({
            id: [row == null ? Guid.create().toString() : row.id],
            description: [row == null ? null : row.description, Validators.required],
            loadCategoryId: [row == null ? null : row.loadCategoryId, Validators.required],
            liquid: [row == null ? false : row.liquid]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.formLoadTypes,
            loadCategoryList: this.loadCategoryList,
            title: row == null ? 'Insert' : 'Update'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogLoadTypeComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                this.fuseSplashScreenService.show(); this.loading = true;
                if (row == null) {
                    this.apiService.post('loadTypes', null, result).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                this.getLoadTypes().then(getLoadTypesResult => {
                                    this.loadTypeList = getLoadTypesResult;
                                    this.dataSourceLoadTypes = new MatTableDataSource(this.loadTypeList);
                                    setTimeout(() => {
                                        this.dataSourceLoadTypes.paginator = this.paginatorLoadTypes;
                                        this.dataSourceLoadTypes.sortingDataAccessor = (item, property) => {
                                            switch (property) {
                                                case 'loadCategoryDescription': return item.loadCategory.description;
                                                default: return item[property];
                                            }
                                        };
                                        this.dataSourceLoadTypes.sort = this.sortLoadTypes;
                                    }, 100);
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
                    this.apiService.put('loadTypes', result).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                this.getLoadTypes().then(getLoadTypesResult => {
                                    this.loadTypeList = getLoadTypesResult;
                                    this.dataSourceLoadTypes = new MatTableDataSource(this.loadTypeList);
                                    setTimeout(() => {
                                        this.dataSourceLoadTypes.paginator = this.paginatorLoadTypes;
                                        this.dataSourceLoadTypes.sortingDataAccessor = (item, property) => {
                                            switch (property) {
                                                case 'loadCategoryDescription': return item.loadCategory.description;
                                                default: return item[property];
                                            }
                                        };
                                        this.dataSourceLoadTypes.sort = this.sortLoadTypes;
                                    }, 100);
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
        });
    }
    initDeleteLoadType(id) {
        this.deleteFormLoadTypes = this._formBuilder.group({
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

        const dialogRef = this.fuseConfirmationService.open(this.deleteFormLoadTypes.value);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                {
                    this.fuseSplashScreenService.show(); this.loading = true;
                    this.apiService.delete('loadTypes', id).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                this.loadTypeList.splice(this.loadTypeList.findIndex(item => item.id === apiResult.id), 1);
                                this.dataSourceLoadTypes = new MatTableDataSource(this.loadTypeList);
                                setTimeout(() => {
                                    this.dataSourceLoadTypes.paginator = this.paginatorLoadTypes;
                                    this.dataSourceLoadTypes.sortingDataAccessor = (item, property) => {
                                        switch (property) {
                                            case 'loadCategoryDescription': return item.loadCategory.description;
                                            default: return item[property];
                                        }
                                    };
                                    this.dataSourceLoadTypes.sort = this.sortLoadTypes;
                                }, 100);
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
    applyFilterLoadTypes(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceLoadTypes.filter = filterValue.trim().toLowerCase();

        if (this.dataSourceLoadTypes.paginator) {
            this.dataSourceLoadTypes.paginator.firstPage();
        }
    }
}
