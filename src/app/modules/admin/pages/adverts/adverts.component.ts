import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { ApiService } from 'app/modules/admin/services/api.service';
import { advert } from 'app/modules/admin/models/advert.model';
import { Guid } from 'guid-typescript';
import { first } from 'rxjs';
import { DialogAdvertComponent } from 'app/modules/admin/dialogs/dialog-advert/dialog-advert.component';
import { VariableService } from 'app/shared/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { advertPackage } from '../../models/advertPackage.model';
import { status } from '../../models/status.model';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { HttpEventType } from '@angular/common/http';
import { environment } from 'environments/environment';
import { User } from 'app/core/user/user.types';
import { DialogPaypalComponent } from '../../dialogs/dialog-paypal/dialog-paypal.component';

const MAX_SIZE: number = 1048576;

@Component({
    selector: 'adverts',
    templateUrl: './adverts.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AdvertsComponent implements OnInit {
    timestamp: number = 0;
    imagesFolder = environment.api + 'Images/';
    loading: boolean = true;
    form: FormGroup;
    advertList: advert[] = [];
    user: User;

    displayedColumns: string[];
    dataSource: MatTableDataSource<advert>;
    @ViewChild(MatPaginator, { static: false }) paginatorAdvert: MatPaginator;
    @ViewChild(MatSort, { static: false }) sortAdvert: MatSort;

    advertPackageList: advertPackage[] = [];

    theFile: any = null;
    messages: string[] = [];

    deleteForm: FormGroup;

    quantity: number = Number(localStorage.getItem('advertsQuantity'));

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
        this.timestamp = new Date().getTime();
        this.fuseSplashScreenService.show(); this.loading = true;
        this.displayedColumns = ['cud', 'title', 'avatar', 'statusDescription'];
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if(params.action == 'return'){
                console.log('now');
            }
        });
        
        this.getAdvertPackages().then(getAdvertPackagesResult => {
            this.advertPackageList = getAdvertPackagesResult;
            this.getAdverts().then(getAdvertResult => {
                this.variableService.setPageSelected('Adverts');
                this.advertList = getAdvertResult;
                this.dataSource = new MatTableDataSource(this.advertList);
                this.fuseSplashScreenService.hide(); this.loading = false;
            });
        });
    }

    showPaypal() {
        this.fuseSplashScreenService.hide();
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { page: 'adverts' };

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

    getAdverts(): Promise<advert[]> {
        var promise = new Promise<advert[]>((resolve) => {
            try {
                this.apiService.get('adverts').subscribe({
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

    getAdvertPackages(): Promise<advertPackage[]> {
        var promise = new Promise<advertPackage[]>((resolve) => {
            try {
                this.apiService.post('advertPackages', 'all', null).subscribe({
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
        if (this.dataSource.data.length < this.quantity || this.quantity === -1 || row !== null) {
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth();
            var day = d.getDate();
            var c = new Date(year + 1, month, day);

            this.form = this._formBuilder.group({
                id: [row == null ? Guid.create().toString() : row.id],
                userId: [row == null ? localStorage.getItem('userId') : row.userId],
                dateExpiry: [row == null ? c : row.dateExpiry],
                advertPackageId: [row == null ? null : row.advertPackageId, Validators.required],
                advertPackageDescription: [row == null ? null : row.advertPackageDescription],
                title: [row == null ? null : row.title, [Validators.required, Validators.maxLength(30)]],
                subTitle: [row == null ? null : row.subTitle, [Validators.required, Validators.maxLength(50)]],
                link: [row == null ? null : row.link, [Validators.required, Validators.maxLength(200)]],
                content: [row == null ? null : row.content, [Validators.required, Validators.maxLength(200)]],
                avatar: [row == null ? null : row.avatar],
                avatarChanged: [false],
                fileToUpload: [null],
                statusId: [row == null ? Guid.parse('490039A9-3DD3-4265-B998-FB735E2A233C').toString() : row.statusId],
                statusDescription: [row == null ? null : row.statusDescription]
            });

            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: row,
                form: this.form,
                advertPackageList: this.advertPackageList,
                title: row == null ? 'Insert' : 'Update'
            }

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "800px";

            const dialogRef = this.dialog.open(DialogAdvertComponent,
                dialogConfig);


            dialogRef.afterClosed().subscribe(result => {
                if (result !== false) {
                    this.fuseSplashScreenService.show(); this.loading = true;
                    if (row == null) {
                        this.apiService.post('adverts', null, result).subscribe({
                            next: (apiResult: any) => {
                                if (apiResult.id != '00000000-0000-0000-0000-000000000000' && result.fileToUpload) {
                                    this.uploadFile(result.fileToUpload, apiResult.id + '.' + result.fileToUpload.name.split('.').pop()).then(x => {
                                        apiResult.data.avatar = '.' + result.fileToUpload.name.split('.').pop();
                                        this.advertList.push(apiResult.data);
                                        this.dataSource = new MatTableDataSource(this.advertList);
                                        this.fuseSplashScreenService.hide(); this.loading = false;
                                        this.timestamp = new Date().getTime();
                                    });
                                } else {
                                    this.advertList.push(apiResult.data);
                                    this.dataSource = new MatTableDataSource(this.advertList);
                                    this.fuseSplashScreenService.hide(); this.loading = false;
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
                        this.apiService.put('adverts', result).subscribe({
                            next: (apiResult: any) => {
                                if (apiResult.result == true) {
                                    if (apiResult.id != '00000000-0000-0000-0000-000000000000' && result.fileToUpload) {
                                        this.uploadFile(result.fileToUpload, apiResult.id + '.' + result.fileToUpload.name.split('.').pop()).then(x => {
                                            apiResult.data.avatar = '.' + result.fileToUpload.name.split('.').pop();
                                            let objIndex = this.advertList.findIndex(x => x.id === row.id);
                                            this.advertList[objIndex] = apiResult.data;
                                            this.dataSource = new MatTableDataSource(this.advertList);
                                            this.fuseSplashScreenService.hide(); this.loading = false;
                                            this.timestamp = new Date().getTime();
                                        });
                                    } else {
                                        let objIndex = this.advertList.findIndex(x => x.id === row.id);
                                        this.advertList[objIndex] = apiResult.data;
                                        this.dataSource = new MatTableDataSource(this.advertList);
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
            title: 'Delete Advert',
            message: 'Are you sure you want to remove this Advert?',
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
                this.apiService.delete('adverts', id).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            this.advertList.splice(this.advertList.findIndex(item => item.id === apiResult.id), 1);
                            this.dataSource = new MatTableDataSource(this.advertList);
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
                this.apiService.upload('adverts', formData, filename).subscribe(event => {
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
