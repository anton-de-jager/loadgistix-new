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
import { directoryCategory } from 'app/modules/admin/models/directoryCategory.model';
import { Guid } from 'guid-typescript';
import { first } from 'rxjs';
import { DialogDirectoryComponent } from 'app/modules/admin/dialogs/dialog-directory/dialog-directory.component';
import { VariableService } from 'app/shared/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { HttpEventType } from '@angular/common/http';
import { User } from 'app/core/user/user.types';
import { DialogPaypalComponent } from '../../dialogs/dialog-paypal/dialog-paypal.component';
//import {promises as fs} from 'fs';

@Component({
    selector: 'directory',
    templateUrl: './directory.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DirectoryComponent implements OnInit {
    timestamp: number = 0;
    loading: boolean;
    form: FormGroup;
    directoryCategoryList: directoryCategory[] = [];
    directoryList: directory[] = [];
    user: User;

    displayedColumns: string[];
    dataSource: MatTableDataSource<directory>;
    @ViewChild(MatPaginator, { static: false }) paginatorDirectory: MatPaginator;
    @ViewChild(MatSort, { static: false }) sortDirectory: MatSort;

    deleteForm: FormGroup;

    quantity: number = Number(localStorage.getItem('directoryQuantity').toString() == '-1' ? 1 : localStorage.getItem('directoryQuantity'));

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
        this.displayedColumns = ['cud', 'companyName', 'directoryCategoryDescription', 'statusDescription'];
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params.action == 'return') {
                console.log('now');
            }
        });

        this.getDirectoryCategories().then(getDirectoryCategoriesResult => {
            this.directoryCategoryList = getDirectoryCategoriesResult;
            this.getDirectories().then(getDirectoryResult => {
                this.variableService.setPageSelected('Directory');
                this.directoryList = getDirectoryResult;
                this.dataSource = new MatTableDataSource(this.directoryList);
                this.fuseSplashScreenService.hide(); this.loading = false;
            });
        });

    }

    showPaypal() {
        this.fuseSplashScreenService.hide();
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { page: 'directory' };

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

    getDirectories(): Promise<directory[]> {
        var promise = new Promise<directory[]>((resolve) => {
            try {
                this.apiService.get('directories').subscribe({
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

    getDirectoryCategories(): Promise<directoryCategory[]> {
        var promise = new Promise<directoryCategory[]>((resolve) => {
            try {
                this.apiService.get('directoryCategories').subscribe({
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
                directoryCategoryId: [row == null ? null : row.directoryCategoryId, Validators.required],
                companyName: [row == null ? null : row.companyName, Validators.required],
                description: [row == null ? null : row.description, Validators.required],
                email: [row == null ? null : row.email, Validators.required],
                phone: [row == null ? null : row.phone, Validators.required],
                website: [row == null ? null : row.website, Validators.required],
                instagram: [row == null ? null : row.instagram],
                facebook: [row == null ? null : row.facebook],
                twitter: [row == null ? null : row.twitter],
                addressLat: [row == null ? null : row.addressLat, Validators.required],
                addressLon: [row == null ? null : row.addressLon, Validators.required],
                addressLabel: [row == null ? null : row.addressLabel, Validators.required],
                avatar: [row == null ? null : row.avatar],
                avatarChanged: [false],
                fileToUpload: [null],
                statusId: [row == null ? Guid.parse('50000F55-C3B0-4D92-BCFD-3203F5FD35B8').toString() : row.statusId]
            });

            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: row,
                form: this.form,
                directoryCategoryList: this.directoryCategoryList,
                title: row == null ? 'Insert' : 'Update'
            }

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "800px";

            const dialogRef = this.dialog.open(DialogDirectoryComponent,
                dialogConfig);

            dialogRef.afterClosed().subscribe(result => {
                if (result !== false) {
                    this.fuseSplashScreenService.show(); this.loading = true;
                    if (row == null) {
                        this.apiService.post('directories', null, result).subscribe({
                            next: (apiResult: any) => {
                                if (apiResult.id != '00000000-0000-0000-0000-000000000000' && result.fileToUpload) {
                                    this.uploadFile(result.fileToUpload, apiResult.id + '.' + result.fileToUpload.name.split('.').pop()).then(x => {
                                        apiResult.data.avatar = '.' + result.fileToUpload.name.split('.').pop();
                                        this.directoryList.push(apiResult.data);
                                        this.dataSource = new MatTableDataSource(this.directoryList);
                                        this.fuseSplashScreenService.hide(); this.loading = false;
                                        this.timestamp = new Date().getTime();
                                    });
                                } else {
                                    this.directoryList.push(apiResult.data);
                                    this.dataSource = new MatTableDataSource(this.directoryList);
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
                        this.apiService.put('directories', result).subscribe({
                            next: (apiResult: any) => {
                                if (apiResult.result == true) {
                                    if (apiResult.id != '00000000-0000-0000-0000-000000000000' && result.fileToUpload) {
                                        this.uploadFile(result.fileToUpload, apiResult.id + '.' + result.fileToUpload.name.split('.').pop()).then(x => {
                                            apiResult.data.avatar = '.' + result.fileToUpload.name.split('.').pop();
                                            let objIndex = this.directoryList.findIndex(x => x.id === row.id);
                                            this.directoryList[objIndex] = apiResult.data;
                                            this.dataSource = new MatTableDataSource(this.directoryList);
                                            this.fuseSplashScreenService.hide(); this.loading = false;
                                            this.timestamp = new Date().getTime();
                                        });
                                    } else {
                                        let objIndex = this.directoryList.findIndex(x => x.id === row.id);
                                        this.directoryList[objIndex] = apiResult.data;
                                        this.dataSource = new MatTableDataSource(this.directoryList);
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
            title: 'Delete Directory',
            message: 'Are you sure you want to remove this Directory',
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
                this.apiService.delete('directories', id).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            this.directoryList.splice(this.directoryList.findIndex(item => item.id === apiResult.id), 1);
                            this.dataSource = new MatTableDataSource(this.directoryList);
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
                this.apiService.upload('directories', formData, filename).subscribe(event => {
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
