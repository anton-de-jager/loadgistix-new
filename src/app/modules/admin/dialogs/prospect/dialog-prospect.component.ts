import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { ProspectLanguage } from 'app/modules/admin/models/prospectLanguage.model';
import { ProspectSubject } from 'app/modules/admin/models/prospectSubject.model';
import { ProspectTertiary } from 'app/modules/admin/models/prospectTertiary.model';
import { ProspectEmployment } from 'app/modules/admin/models/prospectEmployment.model';
import { ApiService } from 'app/modules/admin/services/api.service';
import { Subject } from 'rxjs';
import { DialogProspectLanguageComponent } from '../prospectLanguage/dialog-prospectLanguage.component';
import { DialogProspectSubjectComponent } from '../prospectSubject/dialog-prospectSubject.component';
import { DialogProspectTertiaryComponent } from '../prospectTertiary/dialog-prospectTertiary.component';
import { DialogProspectEmploymentComponent } from '../prospectEmployment/dialog-prospectEmployment.component';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { ProspectEmploymentDuty } from 'app/modules/admin/models/prospectEmploymentDuty.model';
import { ProspectEmploymentTechnology } from 'app/modules/admin/models/prospectEmploymentTechnology.model';
import { Guid } from 'guid-typescript';

@Component({
    selector: 'dialog-prospect',
    templateUrl: 'dialog-prospect.component.html'
})
export class DialogProspectComponent {
    splashScreen: FuseSplashScreenService
    loading: boolean = true;

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

    // employmentDutyItems: ProspectEmploymentDuty[];
    // employmentTechnologyItems: ProspectEmploymentTechnology[];

    constructor(
        splashScreen: FuseSplashScreenService,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogProspectComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private _formBuilder: FormBuilder
    ) {
        this.splashScreen = splashScreen;
        this.formErrors = data.formErrors;
        this.formData = data;
        console.log(data);

        this.dataSourceLanguage = new MatTableDataSource(data.form.value.prospectLanguage);
        this.dataSourceSubject = new MatTableDataSource(data.form.value.prospectSubject);
        this.dataSourceTertiary = new MatTableDataSource(data.form.value.prospectTertiary);
        this.dataSourceEmployment = new MatTableDataSource(data.form.value.prospectEmployment);

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.form = this.data.form;
        this.formValid = false;

        this.loading = false;
    }

    initUpsertLanguage(row) {
        this.formLanguage = this._formBuilder.group({
            id: [row == null ? Guid.createEmpty().toString() : row.id],
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
                    let item = this.form.controls['prospectLanguage'].value;
                    item.push(new ProspectLanguage(result.id, this.formData.form.value.id, result.description));
                    this.form.controls['prospectLanguage'].setValue(item);
                    this.dataSourceLanguage = new MatTableDataSource(item);
                } else {
                    //update
                    row.description = result.description;
                }
            }
        });
    }
    initDeleteLanguage(rowDeleted) {
        if (confirm('Are you sure you want to delete item?')) {
            //delete
            let item = this.form.controls['prospectLanguage'].value.filter(
                row => row != rowDeleted
            );
            this.form.controls['prospectLanguage'].setValue(item);
            this.dataSourceLanguage = new MatTableDataSource(item);
        }
    }

    initUpsertSubject(row) {
        this.formSubject = this._formBuilder.group({
            id: [row == null ? Guid.createEmpty().toString() : row.id],
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
                    let item = this.form.controls['prospectSubject'].value;
                    item.push(new ProspectSubject(result.id, this.formData.form.value.id, result.description, result.level, result.result));
                    this.form.controls['prospectSubject'].setValue(item);
                    this.dataSourceSubject = new MatTableDataSource(item);
                } else {
                    //update
                    row.description = result.description;
                }
            }
        });
    }
    initDeleteSubject(rowDeleted) {
        if (confirm('Are you sure you want to delete item?')) {
            //delete
            let item = this.form.controls['prospectSubject'].value.filter(
                row => row != rowDeleted
            );
            this.form.controls['prospectSubject'].setValue(item);
            this.dataSourceSubject = new MatTableDataSource(item);
        }
    }

    initUpsertTertiary(row) {
        this.formTertiary = this._formBuilder.group({
            id: [row == null ? Guid.createEmpty().toString() : row.id],
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
                    let item = this.form.controls['prospectTertiary'].value;
                    item.push(new ProspectTertiary(result.id, this.formData.form.value.id, result.description, result.course, result.yearCompleted));
                    this.form.controls['prospectTertiary'].setValue(item);
                    this.dataSourceTertiary = new MatTableDataSource(item);
                } else {
                    //update
                    row.description = result.description;
                }
            }
        });
    }
    initDeleteTertiary(rowDeleted) {
        if (confirm('Are you sure you want to delete item?')) {
            //delete
            let item = this.form.controls['prospectTertiary'].value.filter(
                row => row != rowDeleted
            );
            this.form.controls['prospectTertiary'].setValue(item);
            this.dataSourceTertiary = new MatTableDataSource(item);
        }
    }
    initUpsertEmployment(row) {
        this.splashScreen.show();

        if (row == null) {
            this.splashScreen.hide();
            this.formEmployment = this._formBuilder.group({
                id: [row == null ? Guid.createEmpty().toString() : row.id],
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
                    //insert
                    let item = this.form.controls['prospectEmployment'].value;
                    item.push(new ProspectEmployment(result.id, this.formData.form.value.id, result.description, result.position, result.dateStart, result.dateEnd, result.reasonForLeaving, result.dutyItems, result.technologyItems));
                    this.form.controls['prospectEmployment'].setValue(item);
                    this.dataSourceEmployment = new MatTableDataSource(item);
                }
            });
        } else {
            // this.getProspectEmploymentDuty(row.id).then(getProspectEmploymentDutyResult => {
            //     this.employmentDutyItems = getProspectEmploymentDutyResult;
            //     this.getProspectEmploymentTechnology(row.id).then(getProspectEmploymentTechnologyResult => {
            //         this.employmentTechnologyItems = getProspectEmploymentTechnologyResult;
            this.splashScreen.hide();

            this.formEmployment = this._formBuilder.group({
                id: [row == null ? Guid.createEmpty().toString() : row.id],
                description: [row == null ? null : row.description, Validators.required],
                position: [row == null ? null : row.position, Validators.required],
                dateStart: [row == null ? null : row.dateStart, Validators.required],
                dateEnd: [row == null ? null : row.dateEnd, Validators.required],
                reasonForLeaving: [row == null ? null : row.reasonForLeaving, Validators.required],
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
                    row.description = result.description;
                    row.dutyItems = result.dutyItems;
                    row.technologyItems = result.technologyItems;
                }
            });

            //     });
            // });
        }
    }
    initDeleteEmployment(rowDeleted) {
        if (confirm('Are you sure you want to delete item?')) {
            //delete
            let item = this.form.controls['prospectEmployment'].value.filter(
                row => row != rowDeleted
            );
            this.form.controls['prospectEmployment'].setValue(item);
            this.dataSourceEmployment = new MatTableDataSource(item);
        }
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.complete();
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        this.dialogRef.close();
    }
}