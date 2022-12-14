import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
import { Subject } from 'rxjs';
import { DialogProspectEmploymentComponent } from '../../dialogs/prospectEmployment/dialog-prospectEmployment.component';
import { DialogProspectLanguageComponent } from '../../dialogs/prospectLanguage/dialog-prospectLanguage.component';
import { DialogProspectSubjectComponent } from '../../dialogs/prospectSubject/dialog-prospectSubject.component';
import { DialogProspectTertiaryComponent } from '../../dialogs/prospectTertiary/dialog-prospectTertiary.component';
import { user } from '../../models/user.model';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AdminProfileComponent implements OnInit {
    imagesFolder = environment.api + 'Images/';
    splashScreen: FuseSplashScreenService;
    user: user;
    prospect: Prospect;
    prospectId: Guid;

    form: FormGroup;
    formErrors: any;
    formValid: boolean;
    private _unsubscribeAll: Subject<any>;
    formData: any;

    formLanguage: FormGroup;
    displayedColumnsLanguage: string[] = ['cud', 'description'];
    dataSourceLanguage: MatTableDataSource<ProspectLanguage>;

    formSubject: FormGroup;
    displayedColumnsSubject: string[] = ['cud', 'description', 'level', 'result'];
    dataSourceSubject: MatTableDataSource<ProspectSubject>;

    formTertiary: FormGroup;
    displayedColumnsTertiary: string[] = ['cud', 'description', 'course', 'yearCompleted'];
    dataSourceTertiary: MatTableDataSource<ProspectTertiary>;

    formEmployment: FormGroup;
    displayedColumnsEmployment: string[] = ['cud', 'description', 'position', 'dateStart', 'dateEnd'];
    dataSourceEmployment: MatTableDataSource<ProspectEmployment>;

    constructor(
        splashScreen: FuseSplashScreenService,
        private apiService: ApiService,
        private _formBuilder: FormBuilder,
        private dialog: MatDialog,
        public variableService: VariableService
    ) {
        this.splashScreen = splashScreen;
        this.splashScreen.show();
        this.user = JSON.parse(localStorage.getItem('user'));

        this.getProspect(this.prospectId).then(getProspectResult => {
            this.prospect = getProspectResult[0];

            this.form = this._formBuilder.group({
                id: [this.prospect == null ? null : this.prospect.id],
                clientId: [this.prospect == null ? Guid.createEmpty() : this.prospect.clientId],
                name: [this.prospect == null ? null : this.prospect.name, Validators.required],
                surname: [this.prospect == null ? null : this.prospect.surname, Validators.required],
                idNumber: [this.prospect == null ? null : this.prospect.idNumber, Validators.required],
                phone: [this.prospect == null ? null : this.prospect.phone, Validators.required],
                email: [this.prospect == null ? null : this.prospect.email, Validators.required],
                address1: [this.prospect == null ? null : this.prospect.address1, Validators.required],
                address2: [this.prospect == null ? null : this.prospect.address2, Validators.required],
                addressCity: [this.prospect == null ? null : this.prospect.addressCity, Validators.required],
                addressProvince: [this.prospect == null ? null : this.prospect.addressProvince, Validators.required],
                addressCountry: [this.prospect == null ? null : this.prospect.addressCountry, Validators.required],
                addressCode: [this.prospect == null ? null : this.prospect.addressCode, Validators.required],
                equity: [this.prospect == null ? null : this.prospect.equity, Validators.required],
                nationality: [this.prospect == null ? null : this.prospect.nationality, Validators.required],
                transport: [this.prospect == null ? null : this.prospect.transport, Validators.required],
                availability: [this.prospect == null ? null : this.prospect.availability, Validators.required],
                educationSchool: [this.prospect == null ? null : this.prospect.educationSchool, Validators.required],
                educationHighestGrade: [this.prospect == null ? null : this.prospect.educationHighestGrade, Validators.required],
                educationYearCompleted: [this.prospect == null ? null : this.prospect.educationYearCompleted, Validators.required],
                role: [this.prospect == null ? null : this.prospect.role, Validators.required]
            });

            this.variableService.pageSelected = 'Profile';
            this.loadData();
        })

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
    }

    getProspect(id: Guid): Promise<Prospect[]> {
        var promise = new Promise<Prospect[]>((resolve) => {
            try {
                this.apiService.getData('prospect', id).subscribe((prospectResult: Prospect[]) => {
                    resolve(prospectResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    loadData() {
        this.getProspectLanguage(this.prospect.id).then(getProspectLanguageResult => {
            this.dataSourceLanguage = new MatTableDataSource(getProspectLanguageResult);
            this.getProspectSubject(this.prospect.id).then(getProspectSubjectResult => {
                this.dataSourceSubject = new MatTableDataSource(getProspectSubjectResult);
                this.getProspectTertiary(this.prospect.id).then(getProspectTertiaryResult => {
                    this.dataSourceTertiary = new MatTableDataSource(getProspectTertiaryResult);
                    this.getProspectEmployment(this.prospect.id).then(getProspectEmploymentResult => {
                        getProspectEmploymentResult.forEach(employmentItem => {
                            this.getProspectEmploymentDuty(employmentItem.id).then(getProspectEmploymentDutyResult => {
                                employmentItem.dutyItems = getProspectEmploymentDutyResult;
                            });
                            this.getProspectEmploymentTechnology(employmentItem.id).then(getProspectEmploymentTechnologyResult => {
                                employmentItem.technologyItems = getProspectEmploymentTechnologyResult;
                            });
                        });
                        setTimeout(() => {
                            this.dataSourceEmployment = new MatTableDataSource(getProspectEmploymentResult);
                            this.splashScreen.hide();
                        }, 1000);
                    });
                });
            });
        });
    }

    getProspectLanguage(id: Guid): Promise<ProspectLanguage[]> {
        var promise = new Promise<ProspectLanguage[]>((resolve) => {
            try {
                this.apiService.getData('prospectLanguage', id).subscribe((prospectLanguageResult: ProspectLanguage[]) => {
                    resolve(prospectLanguageResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }
    initUpsertLanguage(row) {
        this.formLanguage = this._formBuilder.group({
            id: [row == null ? Guid.create() : row.id, Validators.required],
            prospectId: [this.prospect.id, Validators.required],
            description: [row == null ? null : row.description, Validators.required]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.formLanguage,
            title: row == null ? 'Insert' : 'Update'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "600px";

        const dialogRef = this.dialog.open(DialogProspectLanguageComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                if (row == null) {
                    //insert
                    this.dataSourceLanguage.data.push(result);
                    setTimeout(() => {
                        this.dataSourceLanguage._updateChangeSubscription();
                    }, 100);
                } else {
                    //update
                    this.dataSourceLanguage.data.find(x => x.id == row.id).description = result.description;
                    setTimeout(() => {
                        this.dataSourceLanguage._updateChangeSubscription();
                    }, 100);
                }
            }
        });
    }
    initDeleteLanguage(rowDeleted) {
        if (confirm('Are you sure you want to delete item?')) {
            //delete
            this.dataSourceLanguage = new MatTableDataSource(
                this.dataSourceLanguage.data.filter(
                    row => row != rowDeleted
                ));
        }
    }

    getProspectSubject(id: Guid): Promise<ProspectSubject[]> {
        var promise = new Promise<ProspectSubject[]>((resolve) => {
            try {
                this.apiService.getData('prospectSubject', id).subscribe((prospectSubjectResult: ProspectSubject[]) => {
                    resolve(prospectSubjectResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }
    initUpsertSubject(row) {
        this.formSubject = this._formBuilder.group({
            id: [row == null ? Guid.create() : row.id, Validators.required],
            prospectId: [this.prospect.id, Validators.required],
            description: [row == null ? null : row.description, Validators.required],
            level: [row == null ? null : row.level, Validators.required],
            result: [row == null ? null : row.result, Validators.required]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.formSubject,
            title: row == null ? 'Insert' : 'Update'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "600px";

        const dialogRef = this.dialog.open(DialogProspectSubjectComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                if (row == null) {
                    //insert
                    this.dataSourceSubject.data.push(result);
                    setTimeout(() => {
                        this.dataSourceSubject._updateChangeSubscription();
                    }, 100);
                } else {
                    //update
                    this.dataSourceSubject.data.find(x => x.id == row.id).description = result.description;
                    this.dataSourceSubject.data.find(x => x.id == row.id).level = result.level;
                    this.dataSourceSubject.data.find(x => x.id == row.id).result = result.result;
                    setTimeout(() => {
                        this.dataSourceSubject._updateChangeSubscription();
                    }, 100);
                }
            }
        });
    }
    initDeleteSubject(rowDeleted) {
        if (confirm('Are you sure you want to delete item?')) {
            //delete
            this.dataSourceSubject = new MatTableDataSource(
                this.dataSourceSubject.data.filter(
                    row => row != rowDeleted
                ));
        }
    }

    getProspectTertiary(id: Guid): Promise<ProspectTertiary[]> {
        var promise = new Promise<ProspectTertiary[]>((resolve) => {
            try {
                this.apiService.getData('prospectTertiary', id).subscribe((prospectTertiaryResult: ProspectTertiary[]) => {
                    resolve(prospectTertiaryResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }
    initUpsertTertiary(row) {
        this.formTertiary = this._formBuilder.group({
            id: [row == null ? Guid.create() : row.id, Validators.required],
            prospectId: [this.prospect.id, Validators.required],
            description: [row == null ? null : row.description, Validators.required],
            course: [row == null ? null : row.course, Validators.required],
            yearCompleted: [row == null ? null : row.yearCompleted, Validators.required]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.formTertiary,
            title: row == null ? 'Insert' : 'Update'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "600px";

        const dialogRef = this.dialog.open(DialogProspectTertiaryComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                if (row == null) {
                    //insert
                    this.dataSourceTertiary.data.push(result);
                    setTimeout(() => {
                        this.dataSourceTertiary._updateChangeSubscription();
                    }, 100);
                } else {
                    //update
                    this.dataSourceTertiary.data.find(x => x.id == row.id).description = result.description;
                    this.dataSourceTertiary.data.find(x => x.id == row.id).course = result.course;
                    this.dataSourceTertiary.data.find(x => x.id == row.id).yearCompleted = result.yearCompleted;
                    setTimeout(() => {
                        this.dataSourceTertiary._updateChangeSubscription();
                    }, 100);
                }
            }
        });
    }
    initDeleteTertiary(rowDeleted) {
        if (confirm('Are you sure you want to delete item?')) {
            //delete
            this.dataSourceTertiary = new MatTableDataSource(
                this.dataSourceTertiary.data.filter(
                    row => row != rowDeleted
                ));
        }
    }

    getProspectEmployment(id: Guid): Promise<ProspectEmployment[]> {
        var promise = new Promise<ProspectEmployment[]>((resolve) => {
            try {
                let i = 0;
                this.apiService.getData('prospectEmployment', id).subscribe((prospectEmploymentResult: ProspectEmployment[]) => {
                    if (prospectEmploymentResult.length == 0) {
                        resolve(prospectEmploymentResult);
                    } else {
                        prospectEmploymentResult.forEach(prospectEmploymentItem => {
                            this.getProspectEmploymentDuty(prospectEmploymentItem.id).then(getProspectEmploymentDutyResult => {
                                prospectEmploymentItem.dutyItems = getProspectEmploymentDutyResult;
                                i++;
                                if (i / 2 == prospectEmploymentResult.length) {
                                    resolve(prospectEmploymentResult);
                                }
                            })
                            this.getProspectEmploymentTechnology(prospectEmploymentItem.id).then(getProspectEmploymentTechnologyResult => {
                                prospectEmploymentItem.technologyItems = getProspectEmploymentTechnologyResult;
                                i++;
                                if (i / 2 == prospectEmploymentResult.length) {
                                    resolve(prospectEmploymentResult);
                                }
                            })
                        });
                    }

                    resolve(prospectEmploymentResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }
    initUpsertEmployment(row) {
        this.splashScreen.show();

        if (row == null) {
            this.splashScreen.hide();
            this.formEmployment = this._formBuilder.group({
                id: [row == null ? Guid.create() : row.id, Validators.required],
                prospectId: [this.prospect.id, Validators.required],
                description: [row == null ? null : row.description, Validators.required],
                position: [row == null ? null : row.position, Validators.required],
                dateStart: [row == null ? null : row.dateStart, Validators.required],
                dateEnd: [row == null ? null : row.dateEnd, Validators.required],
                reasonForLeaving: [row == null ? null : row.reasonForLeaving, Validators.required],
                dutyItems: [[], Validators.required],
                technologyItems: [[], Validators.required]
            });

            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: row,
                form: this.formEmployment,
                title: row == null ? 'Insert' : 'Update'
            }

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "600px";

            const dialogRef = this.dialog.open(DialogProspectEmploymentComponent,
                dialogConfig);


            dialogRef.afterClosed().subscribe(result => {
                if (result !== false) {
                    this.dataSourceEmployment.data.push(result);
                    setTimeout(() => {
                        this.dataSourceEmployment._updateChangeSubscription();
                    }, 100);
                }
            });
        } else {
            this.splashScreen.hide();

            this.formEmployment = this._formBuilder.group({
                id: [row.id, Validators.required],
                prospectId: [this.prospect.id, Validators.required],
                description: [row.description, Validators.required],
                position: [row.position, Validators.required],
                dateStart: [row.dateStart, Validators.required],
                dateEnd: [row.dateEnd, Validators.required],
                reasonForLeaving: [row.reasonForLeaving, Validators.required],
                dutyItems: [row.dutyItems, Validators.required],
                technologyItems: [row.technologyItems, Validators.required]
            });

            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: row,
                form: this.formEmployment,
                title: row == null ? 'Insert' : 'Update'
            }

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "600px";

            const dialogRef = this.dialog.open(DialogProspectEmploymentComponent,
                dialogConfig);


            dialogRef.afterClosed().subscribe(result => {
                if (result !== false) {
                    //update
                    this.dataSourceEmployment.data.find(x => x.id == row.id).description = result.description;
                    this.dataSourceEmployment.data.find(x => x.id == row.id).position = result.description;
                    this.dataSourceEmployment.data.find(x => x.id == row.id).dateStart = result.description;
                    this.dataSourceEmployment.data.find(x => x.id == row.id).dateEnd = result.description;
                    this.dataSourceEmployment.data.find(x => x.id == row.id).reasonForLeaving = result.description;
                    this.dataSourceEmployment.data.find(x => x.id == row.id).dutyItems = result.description;
                    this.dataSourceEmployment.data.find(x => x.id == row.id).technologyItems = result.description;
                    setTimeout(() => {
                        this.dataSourceEmployment._updateChangeSubscription();
                    }, 100);
                }
            });
        }
    }
    initDeleteEmployment(rowDeleted) {
        if (confirm('Are you sure you want to delete item?')) {
            //delete
            this.dataSourceEmployment = new MatTableDataSource(
                this.dataSourceEmployment.data.filter(
                    row => row != rowDeleted
                ));
        }
    }

    getProspectEmploymentDuty(id: Guid): Promise<ProspectEmploymentDuty[]> {
        var promise = new Promise<ProspectEmploymentDuty[]>((resolve) => {
            try {
                this.apiService.getData('prospectEmploymentDuty', id).subscribe((prospectEmploymentDutyResult: ProspectEmploymentDuty[]) => {
                    resolve(prospectEmploymentDutyResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }
    getProspectEmploymentTechnology(id: Guid): Promise<ProspectEmploymentTechnology[]> {
        var promise = new Promise<ProspectEmploymentTechnology[]>((resolve) => {
            try {
                this.apiService.getData('prospectEmploymentTechnology', id).subscribe((prospectEmploymentTechnologyResult: ProspectEmploymentTechnology[]) => {
                    resolve(prospectEmploymentTechnologyResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.complete();
    }

    onNoClick(): void {

    }
    onYesClick(): void {
        this.splashScreen.show();
        
        this.apiService.deleteChildren('prospect', this.prospect).subscribe(prospectDeleteChildrenResult => {
            this.apiService.updatItem('prospect', this.form.value).subscribe(prospectUpdateResult => {
                //insert prospectLanguage
                this.dataSourceLanguage.data.forEach(languageItem => {
                    languageItem.prospectId = this.prospect.id;
                    this.apiService.insertItem('prospectLanguage', languageItem).subscribe((prospectLanguageInsertResult: any[]) => { });
                });

                //insert prospectSubject
                this.dataSourceSubject.data.forEach(subjectItem => {
                    subjectItem.prospectId = this.prospect.id;
                    this.apiService.insertItem('prospectSubject', subjectItem).subscribe((prospectSubjectInsertResult: any[]) => { });
                });

                //insert prospectTertiary
                this.dataSourceTertiary.data.forEach(tertiaryItem => {
                    tertiaryItem.prospectId = this.prospect.id;
                    this.apiService.insertItem('prospectTertiary', tertiaryItem).subscribe((prospectTertiaryInsertResult: any[]) => { });
                });

                //insert prospectEmployment
                this.dataSourceEmployment.data.forEach(employmentItem => {
                    employmentItem.prospectId = this.prospect.id;
                    this.apiService.insertItem('prospectEmployment', employmentItem).subscribe((prospectEmploymentInsertResult: any[]) => {
                        if (prospectEmploymentInsertResult.length > 0) {
                            employmentItem.id = prospectEmploymentInsertResult[0].id;

                            //insert prospectEmploymentDuty
                            employmentItem.dutyItems.forEach(dutyItem => {
                                dutyItem.prospectEmploymentId = employmentItem.id;
                                this.apiService.insertItem('prospectEmploymentDuty', dutyItem).subscribe((prospectEmploymentDutyInsertResult: any[]) => { });
                            });

                            //insert prospectEmploymentTechnology
                            employmentItem.technologyItems.forEach(technologyItem => {
                                technologyItem.prospectEmploymentId = employmentItem.id;
                                this.apiService.insertItem('prospectEmploymentTechnology', technologyItem).subscribe((prospectEmploymentTechnologyInsertResult: any[]) => { });
                            });
                        }
                    });
                });
                setTimeout(() => {
                    this.splashScreen.hide();
                }, 100);
            });
        });
    }

    initView() {
        window.open(environment.urlShort + 'cv?id=' + this.prospect.id, "_blank");
    }
}