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
import { Prospect } from 'app/modules/admin/models/prospect.model';
import { ProspectEmployment } from 'app/modules/admin/models/prospectEmployment.model';
import { ProspectEmploymentDuty } from 'app/modules/admin/models/prospectEmploymentDuty.model';
import { ProspectEmploymentTechnology } from 'app/modules/admin/models/prospectEmploymentTechnology.model';
import { ProspectLanguage } from 'app/modules/admin/models/prospectLanguage.model';
import { ProspectSubject } from 'app/modules/admin/models/prospectSubject.model';
import { ProspectTertiary } from 'app/modules/admin/models/prospectTertiary.model';
import { ApiService } from 'app/modules/admin/services/api.service';
import { VariableService } from 'app/shared/variable.service';
import { environment } from 'environments/environment';
import { Guid } from 'guid-typescript';
import { DialogProspectComponent } from '../../dialogs/prospect/dialog-prospect.component';
import { Client } from '../../models/client.model';

@Component({
    selector: 'prospect',
    templateUrl: './prospect.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AdminProspectComponent implements OnInit {
    imagesFolder = environment.api + 'Images/';
    loading: boolean = true;
    splashScreen: FuseSplashScreenService;

    displayedColumns: string[] = ['cud', 'name', 'surname', 'addressProvince', 'role', 'view'];
    dataSource: MatTableDataSource<Prospect>;
    // employmentItems: ProspectEmployment[];
    // languageItems: ProspectLanguage[];
    // subjectItems: ProspectSubject[];
    // tertiaryItems: ProspectTertiary[];
    clientItems: Client[];
    prospectItems: Prospect[];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    form: FormGroup;

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
        this.splashScreen = splashScreen;
        this.splashScreen.show();
        this.getClients().then(getClientsResult => {
            this.clientItems = getClientsResult;
        })
        this.getProspects().then(getProspectResult => {
            this.dataSource = new MatTableDataSource(getProspectResult);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.variableService.pageSelected = 'Prospects';
            this.splashScreen.hide();
        });
    }

    ngOnInit(): void {
    }

    getProspects(): Promise<Prospect[]> {
        var promise = new Promise<Prospect[]>((resolve) => {
            try {
                this.apiService.get('prospects').subscribe({
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
    // getProspectLanguage(id: Guid): Promise<ProspectLanguage[]> {
    //     var promise = new Promise<ProspectLanguage[]>((resolve) => {
    //         try {
    //             this.apiService.getData('prospectLanguage', id).subscribe((prospectLanguageResult: ProspectLanguage[]) => {
    //                 resolve(prospectLanguageResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }
    // getProspectSubject(id: Guid): Promise<ProspectSubject[]> {
    //     var promise = new Promise<ProspectSubject[]>((resolve) => {
    //         try {
    //             this.apiService.getData('prospectSubject', id).subscribe((prospectSubjectResult: ProspectSubject[]) => {
    //                 resolve(prospectSubjectResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }
    // getProspectTertiary(id: Guid): Promise<ProspectTertiary[]> {
    //     var promise = new Promise<ProspectTertiary[]>((resolve) => {
    //         try {
    //             this.apiService.getData('prospectTertiary', id).subscribe((prospectTertiaryResult: ProspectTertiary[]) => {
    //                 resolve(prospectTertiaryResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }
    // getProspectEmployment(id: Guid): Promise<ProspectEmployment[]> {
    //     var promise = new Promise<ProspectEmployment[]>((resolve) => {
    //         try {
    //             let i = 0;
    //             this.apiService.getData('prospectEmployment', id).subscribe((prospectEmploymentResult: ProspectEmployment[]) => {
    //                 if (prospectEmploymentResult.length == 0) {
    //                     resolve(prospectEmploymentResult);
    //                 } else {
    //                     prospectEmploymentResult.forEach(prospectEmploymentItem => {
    //                         this.getProspectEmploymentDuty(prospectEmploymentItem.id).then(getProspectEmploymentDutyResult => {
    //                             prospectEmploymentItem.dutyItems = getProspectEmploymentDutyResult;
    //                             i++;
    //                             if (i / 2 == prospectEmploymentResult.length) {
    //                                 resolve(prospectEmploymentResult);
    //                             }
    //                         })
    //                         this.getProspectEmploymentTechnology(prospectEmploymentItem.id).then(getProspectEmploymentTechnologyResult => {
    //                             prospectEmploymentItem.technologyItems = getProspectEmploymentTechnologyResult;
    //                             i++;
    //                             if (i / 2 == prospectEmploymentResult.length) {
    //                                 resolve(prospectEmploymentResult);
    //                             }
    //                         })
    //                     });
    //                 }

    //                 resolve(prospectEmploymentResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }
    // getProspectEmploymentDuty(id: Guid): Promise<ProspectEmploymentDuty[]> {
    //     var promise = new Promise<ProspectEmploymentDuty[]>((resolve) => {
    //         try {
    //             this.apiService.getData('prospectEmploymentDuty', id).subscribe((prospectEmploymentDutyResult: ProspectEmploymentDuty[]) => {
    //                 resolve(prospectEmploymentDutyResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }
    // getProspectEmploymentTechnology(id: Guid): Promise<ProspectEmploymentTechnology[]> {
    //     var promise = new Promise<ProspectEmploymentTechnology[]>((resolve) => {
    //         try {
    //             this.apiService.getData('prospectEmploymentTechnology', id).subscribe((prospectEmploymentTechnologyResult: ProspectEmploymentTechnology[]) => {
    //                 resolve(prospectEmploymentTechnologyResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }

    // deleteProspectChildren(id: Guid): Promise<Prospect[]> {
    //     var promise = new Promise<Prospect[]>((resolve) => {
    //         try {
    //             this.apiService.post('prospect', 'delete', id).subscribe((prospectResult: Prospect[]) => {
    //                 resolve(prospectResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }


    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    initUpsert(row) {
        this.splashScreen.show();

        if (row == null) {
            this.splashScreen.hide();
            //console.log('row', row);

            this.form = this._formBuilder.group({
                id: [row == null ? Guid.createEmpty().toString() : row.id],
                userId: [row == null ? localStorage.getItem('userId') : row.userId],
                clientId: [row == null ? Guid.createEmpty() : row.clientId, Validators.required],
                name: [row == null ? null : row.name, Validators.required],
                surname: [row == null ? null : row.surname, Validators.required],
                idNumber: [row == null ? null : row.idNumber, Validators.required],
                phone: [row == null ? null : row.phone, Validators.required],
                email: [row == null ? null : row.email, Validators.required],
                address1: [row == null ? null : row.address1, Validators.required],
                address2: [row == null ? null : row.address2, Validators.required],
                addressCity: [row == null ? null : row.addressCity, Validators.required],
                addressProvince: [row == null ? null : row.addressProvince, Validators.required],
                addressCountry: [row == null ? null : row.addressCountry, Validators.required],
                addressCode: [row == null ? null : row.addressCode, Validators.required],
                equity: [row == null ? null : row.equity, Validators.required],
                nationality: [row == null ? null : row.nationality, Validators.required],
                transport: [row == null ? null : row.transport, Validators.required],
                availability: [row == null ? null : row.availability, Validators.required],
                educationSchool: [row == null ? null : row.educationSchool, Validators.required],
                educationHighestGrade: [row == null ? null : row.educationHighestGrade, Validators.required],
                educationYearCompleted: [row == null ? null : row.educationYearCompleted, Validators.required],
                role: [row == null ? null : row.role, Validators.required],
                prospectLanguage: [row == null ? [] : row.prospectLanguage, Validators.required],
                prospectSubject: [row == null ? [] : row.prospectSubject],
                prospectTertiary: [row == null ? [] : row.prospectTertiary],
                prospectEmployment: [row == null ? [] : row.prospectEmployment]
            });

            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: row,
                form: this.form,
                title: row == null ? 'Insert' : 'Update',
                prospectItems: this.prospectItems
            }

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "100%";

            const dialogRef = this.dialog.open(DialogProspectComponent,
                dialogConfig);


            dialogRef.afterClosed().subscribe(result => {
                if (result !== false) {
                    this.fuseSplashScreenService.show(); this.loading = true;
                    if (row == null) {
                        this.apiService.post('prospects', null, result).subscribe({
                            next: (apiResult: any) => {
                                if (apiResult.result == true) {
                                    this.getProspects().then(getProspectResult => {
                                        this.prospectItems = getProspectResult;
                                        this.dataSource = new MatTableDataSource(this.prospectItems);
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
                        this.apiService.put('prospects', result).subscribe({
                            next: (apiResult: any) => {
                                if (apiResult.result == true) {
                                    setTimeout(() => {
                                        this.getProspects().then(getProspectResult => {
                                            this.prospectItems = getProspectResult;
                                            this.dataSource = new MatTableDataSource(this.prospectItems);
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
                // if (result !== false) {
                //     this.splashScreen.show();
                //     //insert prospect
                //     this.apiService.post('prospect', null, result).subscribe((prospectInsertResult: any[]) => {
                //         if (prospectInsertResult.length > 0) {
                //             result.id = prospectInsertResult[0].id;
                //             //insert prospectLanguage
                //             result.languageItems.forEach(languageItem => {
                //                 languageItem.prospectId = result.id;
                //                 this.apiService.insertItem('prospectLanguage', languageItem).subscribe((prospectLanguageInsertResult: any[]) => { });
                //             });

                //             //insert prospectSubject
                //             result.subjectItems.forEach(subjectItem => {
                //                 subjectItem.prospectId = result.id;
                //                 this.apiService.insertItem('prospectSubject', subjectItem).subscribe((prospectSubjectInsertResult: any[]) => { });
                //             });

                //             //insert prospectTertiary
                //             result.tertiaryItems.forEach(tertiaryItem => {
                //                 tertiaryItem.prospectId = result.id;
                //                 this.apiService.insertItem('prospectTertiary', tertiaryItem).subscribe((prospectTertiaryInsertResult: any[]) => { });
                //             });

                //             //insert prospectEmployment
                //             result.employmentItems.forEach(employmentItem => {
                //                 employmentItem.prospectId = result.id;
                //                 this.apiService.insertItem('prospectEmployment', employmentItem).subscribe((prospectEmploymentInsertResult: any[]) => {
                //                     if (prospectEmploymentInsertResult.length > 0) {
                //                         employmentItem.id = prospectEmploymentInsertResult[0].id;

                //                         //insert prospectEmploymentDuty
                //                         employmentItem.dutyItems.forEach(dutyItem => {
                //                             dutyItem.prospectEmploymentId = employmentItem.id;
                //                             this.apiService.insertItem('prospectEmploymentDuty', dutyItem).subscribe((prospectEmploymentDutyInsertResult: any[]) => { });
                //                         });

                //                         //insert prospectEmploymentTechnology
                //                         employmentItem.technologyItems.forEach(technologyItem => {
                //                             technologyItem.prospectEmploymentId = employmentItem.id;
                //                             this.apiService.insertItem('prospectEmploymentTechnology', technologyItem).subscribe((prospectEmploymentTechnologyInsertResult: any[]) => { });
                //                         });
                //                     }
                //                 });
                //             });

                //             this.getProspect(Guid.createEmpty()).then(getProspectResult => {
                //                 this.dataSource = new MatTableDataSource(getProspectResult);
                //                 this.dataSource.paginator = this.paginator;
                //                 this.dataSource.sort = this.sort;
                //                 this.splashScreen.hide();
                //             });
                //         } else {
                //             alert('There has been an error');
                //             this.splashScreen.hide();
                //         }
                //     });
                // }
            });
        } else {
            // this.getProspectLanguage(row.id).then(getProspectLanguageResult => {
            //     this.languageItems = getProspectLanguageResult;
            //     this.getProspectSubject(row.id).then(getProspectSubjectResult => {
            //         this.subjectItems = getProspectSubjectResult;
            //         this.getProspectTertiary(row.id).then(getProspectTertiaryResult => {
            //             this.tertiaryItems = getProspectTertiaryResult;
            //             this.getProspectEmployment(row.id).then(getProspectEmploymentResult => {
            //                 this.employmentItems = getProspectEmploymentResult;
            //                 this.employmentItems.forEach(employmentItem => {
            //                     this.getProspectEmploymentDuty(employmentItem.id).then(getProspectEmploymentDutyResult => {
            //                         employmentItem.dutyItems = getProspectEmploymentDutyResult;
            //                     });
            //                     this.getProspectEmploymentTechnology(employmentItem.id).then(getProspectEmploymentTechnologyResult => {
            //                         employmentItem.technologyItems = getProspectEmploymentTechnologyResult;
            //                     });
            //                 });
            //                 setTimeout(() => {
            this.splashScreen.hide();
            //console.log('row', row);

            this.form = this._formBuilder.group({
                id: [row == null ? Guid.createEmpty().toString() : row.id],
                userId: [row == null ? localStorage.getItem('userId') : row.userId],
                clientId: [row == null ? Guid.createEmpty() : row.clientId, Validators.required],
                name: [row == null ? null : row.name, Validators.required],
                surname: [row == null ? null : row.surname, Validators.required],
                idNumber: [row == null ? null : row.idNumber, Validators.required],
                phone: [row == null ? null : row.phone, Validators.required],
                email: [row == null ? null : row.email, Validators.required],
                address1: [row == null ? null : row.address1, Validators.required],
                address2: [row == null ? null : row.address2, Validators.required],
                addressCity: [row == null ? null : row.addressCity, Validators.required],
                addressProvince: [row == null ? null : row.addressProvince, Validators.required],
                addressCountry: [row == null ? null : row.addressCountry, Validators.required],
                addressCode: [row == null ? null : row.addressCode, Validators.required],
                equity: [row == null ? null : row.equity, Validators.required],
                nationality: [row == null ? null : row.nationality, Validators.required],
                transport: [row == null ? null : row.transport, Validators.required],
                availability: [row == null ? null : row.availability, Validators.required],
                educationSchool: [row == null ? null : row.educationSchool, Validators.required],
                educationHighestGrade: [row == null ? null : row.educationHighestGrade, Validators.required],
                educationYearCompleted: [row == null ? null : row.educationYearCompleted, Validators.required],
                role: [row == null ? null : row.role, Validators.required],
                prospectLanguage: [row == null ? [] : row.prospectLanguage, Validators.required],
                prospectSubject: [row == null ? [] : row.prospectSubject],
                prospectTertiary: [row == null ? [] : row.prospectTertiary],
                prospectEmployment: [row == null ? [] : row.prospectEmployment]
            });

            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: row,
                form: this.form,
                title: row == null ? 'Insert' : 'Update',
                prospectItems: this.prospectItems
            }

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "100%";

            const dialogRef = this.dialog.open(DialogProspectComponent,
                dialogConfig);


            dialogRef.afterClosed().subscribe(result => {
                if (result !== false) {
                    this.splashScreen.show();
                    //update
                    //this.apiService.deleteChildren('prospect', result).subscribe(prospectDeleteChildrenResult => {
                        this.apiService.put('prospects', result).subscribe(prospectUpdateResult => {
                            // //insert prospectLanguage
                            // result.languageItems.forEach(languageItem => {
                            //     languageItem.prospectId = result.id;
                            //     this.apiService.insertItem('prospectLanguage', languageItem).subscribe((prospectLanguageInsertResult: any[]) => { });
                            // });

                            // //insert prospectSubject
                            // result.subjectItems.forEach(subjectItem => {
                            //     subjectItem.prospectId = result.id;
                            //     this.apiService.insertItem('prospectSubject', subjectItem).subscribe((prospectSubjectInsertResult: any[]) => { });
                            // });

                            // //insert prospectTertiary
                            // result.tertiaryItems.forEach(tertiaryItem => {
                            //     tertiaryItem.prospectId = result.id;
                            //     this.apiService.insertItem('prospectTertiary', tertiaryItem).subscribe((prospectTertiaryInsertResult: any[]) => { });
                            // });

                            // //insert prospectEmployment
                            // result.employmentItems.forEach(employmentItem => {
                            //     employmentItem.prospectId = result.id;
                            //     this.apiService.insertItem('prospectEmployment', employmentItem).subscribe((prospectEmploymentInsertResult: any[]) => {
                            //         if (prospectEmploymentInsertResult.length > 0) {
                            //             employmentItem.id = prospectEmploymentInsertResult[0].id;

                            //             //insert prospectEmploymentDuty
                            //             employmentItem.dutyItems.forEach(dutyItem => {
                            //                 dutyItem.prospectEmploymentId = employmentItem.id;
                            //                 this.apiService.insertItem('prospectEmploymentDuty', dutyItem).subscribe((prospectEmploymentDutyInsertResult: any[]) => { });
                            //             });

                            //             //insert prospectEmploymentTechnology
                            //             employmentItem.technologyItems.forEach(technologyItem => {
                            //                 technologyItem.prospectEmploymentId = employmentItem.id;
                            //                 this.apiService.insertItem('prospectEmploymentTechnology', technologyItem).subscribe((prospectEmploymentTechnologyInsertResult: any[]) => { });
                            //             });
                            //         }
                            //     });
                            // });

                            this.getProspects().then(getProspectResult => {
                                this.dataSource = new MatTableDataSource(getProspectResult);
                                this.dataSource.paginator = this.paginator;
                                this.dataSource.sort = this.sort;
                                this.splashScreen.hide();
                            });
                        });
                    //});
                }
            });
            //                     }, 1000);
            //                 });
            //             });
            //         });
            //     });
        }
    }
    initDelete(row) {
        if (confirm('Are you sure you want to delete item?')) {
            this.splashScreen.show();
            this.apiService.deleteItem('prospects', row).subscribe(prospectDeleteResult => {
                this.getProspects().then(getProspectResult => {
                    this.dataSource = new MatTableDataSource(getProspectResult);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.splashScreen.hide();
                });
            });
        }
    }

    initView(row) {
        window.open(environment.urlShort + 'cv?id=' + row.id, "_blank");
    }
}