import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { ProspectEmploymentDuty } from 'app/modules/admin/models/prospectEmploymentDuty.model';
import { ProspectEmploymentTechnology } from 'app/modules/admin/models/prospectEmploymentTechnology.model';
import { ApiService } from 'app/modules/admin/services/api.service';
import { Guid } from 'guid-typescript';
import { Subject } from 'rxjs';
import { DialogProspectEmploymentDutyComponent } from '../prospectEmploymentDuty/dialog-prospectEmploymentDuty.component';
import { DialogProspectEmploymentTechnologyComponent } from '../prospectEmploymentTechnology/dialog-prospectEmploymentTechnology.component';

@Component({
    selector: 'dialog-prospectEmployment',
    templateUrl: 'dialog-prospectEmployment.component.html'
})
export class DialogProspectEmploymentComponent {
    loading: boolean = true;
  
    form: FormGroup;
    formErrors: any;
    formValid: boolean;
    private _unsubscribeAll: Subject<any>;
    formData: any;

    formDuty: FormGroup;
    displayedColumnsDuty: string[] = ['cud', 'description'];
    dataSourceDuty: MatTableDataSource<ProspectEmploymentDuty>;

    formTechnology: FormGroup;
    displayedColumnsTechnology: string[] = ['cud', 'description'];
    dataSourceTechnology: MatTableDataSource<ProspectEmploymentTechnology>;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogProspectEmploymentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private _formBuilder: FormBuilder
        ) {
        this.formErrors = data.formErrors;
        this.formData = data;
    
        this.dataSourceDuty = new MatTableDataSource(data.form.value.dutyItems);
        this.dataSourceTechnology = new MatTableDataSource(data.form.value.technologyItems);

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.form = this.data.form;
        this.formValid = false;

        this.loading = false;
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.complete();
    }

    initUpsertDuty(row) {
        this.formDuty = this._formBuilder.group({
            id: [row == null ? Guid.createEmpty().toString() : row.id],
            description: [row == null ? null : row.description, Validators.required]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.formDuty,
            title: row == null ? 'Insert' : 'Update'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "600px";

        const dialogRef = this.dialog.open(DialogProspectEmploymentDutyComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                if (row == null) {
                    //insert
                    let item = this.form.controls['dutyItems'].value;
                    item.push(new ProspectEmploymentDuty(result.id, this.formData.form.value.id, result.description));
                    this.form.controls['dutyItems'].setValue(item);
                    this.dataSourceDuty = new MatTableDataSource(item);
                } else {
                    //update
                    row.description = result.description;
                }
            }
        });
    }
    initDeleteDuty(rowDeleted) {
        if (confirm('Are you sure you want to delete item?')) {
            //delete
            let item = this.form.controls['dutyItems'].value.filter(
                row => row != rowDeleted
            );
            this.form.controls['dutyItems'].setValue(item);
            this.dataSourceDuty = new MatTableDataSource(item);
        }
    }

    initUpsertTechnology(row) {
        this.formTechnology = this._formBuilder.group({
            id: [row == null ? Guid.createEmpty().toString() : row.id],
            description: [row == null ? null : row.description, Validators.required]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.formTechnology,
            title: row == null ? 'Insert' : 'Update'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "600px";

        const dialogRef = this.dialog.open(DialogProspectEmploymentTechnologyComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                if (row == null) {
                    //insert
                    let item = this.form.controls['technologyItems'].value;
                    item.push(new ProspectEmploymentTechnology(result.id, this.formData.form.value.id, result.description));
                    this.form.controls['technologyItems'].setValue(item);
                    this.dataSourceTechnology = new MatTableDataSource(item);
                } else {
                    //update
                    row.description = result.description;
                }
            }
        });
    }
    initDeleteTechnology(rowDeleted) {
        if (confirm('Are you sure you want to delete item?')) {
            //delete
            let item = this.form.controls['technologyItems'].value.filter(
                row => row != rowDeleted
            );
            this.form.controls['technologyItems'].setValue(item);
            this.dataSourceTechnology = new MatTableDataSource(item);
        }
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        this.dialogRef.close();
    }
}