import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { ApiService } from 'app/modules/admin/services/api.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'dialog-prospectSubject',
    templateUrl: 'dialog-prospectSubject.component.html'
})
export class DialogProspectSubjectComponent {
    loading: boolean = true;
  
    form: FormGroup;
    formErrors: any;
    formValid: boolean;
    private _unsubscribeAll: Subject<any>;
    formData: any;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogProspectSubjectComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private _formBuilder: FormBuilder
        ) {
        this.formErrors = data.formErrors;
        this.formData = data;

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

    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        this.dialogRef.close();
    }
}