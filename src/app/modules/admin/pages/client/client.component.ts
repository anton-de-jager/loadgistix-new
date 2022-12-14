import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { Client } from 'app/modules/admin/models/client.model';
import { DateBilling } from 'app/modules/admin/models/dateBilling.model';
import { ApiService } from 'app/modules/admin/services/api.service';
import { VariableService } from 'app/shared/variable.service';
import { environment } from 'environments/environment';
import { Guid } from 'guid-typescript';
import { DialogClientComponent } from '../../dialogs/client/dialog-client.component';
import { user } from 'app/modules/admin/models/user.model';
import { status } from 'app/modules/admin/models/status.model';

@Component({
    selector: 'client',
    templateUrl: './client.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AdminClientComponent implements OnInit {
    imagesFolder = environment.api + 'Images/';
    loading: boolean = true;
    splashScreen: FuseSplashScreenService;
    clientList: Client[] = [];
    user: user;
    prospectId: Guid;
    deleteForm: FormGroup;

    displayedColumns: string[] = ['cud', 'description', 'statusDescription'];
    dataSource: MatTableDataSource<Client>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    form: FormGroup;

    dateBillingItems: DateBilling[] = [];
    statusItems: status[] = [];

    constructor(
        splashScreen: FuseSplashScreenService,
        private apiService: ApiService,
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        public variableService: VariableService,
        private fuseSplashScreenService: FuseSplashScreenService,
        private fuseConfirmationService: FuseConfirmationService
    ) {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.splashScreen = splashScreen;
        this.splashScreen.show();
        this.getDateBillings().then(getDateBillingResult => {
            this.dateBillingItems = getDateBillingResult;
            this.getStatus().then(getStatusResult => {
                this.statusItems = getStatusResult;
                this.getClients().then(getClientResult => {
                    this.dataSource = new MatTableDataSource(getClientResult);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.variableService.pageSelected = 'Clients';
                    this.splashScreen.hide();
                });
            });
        });
    }

    ngOnInit(): void {
    }

    getClients(): Promise<Client[]> {
        var promise = new Promise<Client[]>((resolve) => {
            try {
                this.apiService.get('clients').subscribe({
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

    getDateBillings(): Promise<DateBilling[]> {
        var promise = new Promise<DateBilling[]>((resolve) => {
            try {
                this.apiService.get('dateBillings').subscribe({
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
    

    getStatus(): Promise<status[]> {
        var promise = new Promise<status[]>((resolve) => {
            try {
                this.apiService.post('status', 'table', 'client').subscribe({
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

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    initUpsert(row) {
        this.form = this._formBuilder.group({
            id: [row == null ? Guid.create().toString() : row.id],
            userId: [row == null ? localStorage.getItem('userId') : row.userId],
            description: [row == null ? null : row.description, [Validators.required,Validators.maxLength(200)]],
            descriptionShort: [row == null ? null : row.descriptionShort, [Validators.required,Validators.maxLength(50)]],
            registrationNumber: [row == null ? null : row.registrationNumber, [Validators.required,Validators.maxLength(50)]],
            vatNumber: [row == null ? null : row.vatNumber, [Validators.required,Validators.maxLength(50)]],
            address1: [row == null ? null : row.address1, [Validators.required,Validators.maxLength(50)]],
            address2: [row == null ? null : row.address2, [Validators.required,Validators.maxLength(50)]],
            addressCity: [row == null ? null : row.addressCity, [Validators.required,Validators.maxLength(50)]],
            addressProvince: [row == null ? null : row.addressProvince, [Validators.required,Validators.maxLength(50)]],
            addressCountry: [row == null ? null : row.addressCountry, [Validators.required,Validators.maxLength(50)]],
            addressCode: [row == null ? null : row.addressCode, [Validators.required,Validators.maxLength(50)]],
            contact: [row == null ? null : row.contact, [Validators.required,Validators.maxLength(50)]],
            contactPhone: [row == null ? null : row.contactPhone, [Validators.required,Validators.maxLength(50)]],
            contactEmail: [row == null ? null : row.contactEmail, [Validators.required,Validators.maxLength(50)]],
            dateBillingId: [row == null ? null : row.dateBillingId, Validators.required],
            statusId: [row == null ? null : row.statusId.toString(), Validators.required]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            id: row == null ? Guid.createEmpty() : row.id,
            dateBillingItems: this.dateBillingItems,
            statusItems: this.statusItems,
            item: row,
            form: this.form,
            title: row == null ? 'Insert' : 'Update'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "100%";

        const dialogRef = this.dialog.open(DialogClientComponent,
            dialogConfig);

            dialogRef.afterClosed().subscribe(result => {
                if (result !== false) {
                    this.fuseSplashScreenService.show(); this.loading = true;
                    if (row == null) {
                        this.apiService.post('clients', null, result).subscribe({
                            next: (apiResult: any) => {
                                if (apiResult.result == true) {
                                    this.getClients().then(getClientResult => {
                                        this.clientList = getClientResult;
                                        this.dataSource = new MatTableDataSource(this.clientList);
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
                        this.apiService.put('clients', result).subscribe({
                            next: (apiResult: any) => {
                                if (apiResult.result == true) {
                                    setTimeout(() => {
                                        this.getClients().then(getClientResult => {
                                            this.clientList = getClientResult;
                                            this.dataSource = new MatTableDataSource(this.clientList);
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
                title: 'Delete Client',
                message: 'Are you sure you want to remove this Client?',
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
                    this.apiService.delete('clients', id ).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                this.clientList.splice(this.clientList.findIndex(item => item.id === apiResult.id), 1);
                                this.dataSource = new MatTableDataSource(this.clientList);
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

    initView(row) {
        window.open(environment.urlShort + 'client?id=' + row.id, "_blank");
    }

    emailClient(row) {
        this.splashScreen.show();
        this.apiService.sendEmail(row.id, this.prospectId).subscribe(result => {
            this.getClients().then(getClientResult => {
                this.dataSource = new MatTableDataSource(getClientResult);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.splashScreen.hide();
            });
        });
    }
}