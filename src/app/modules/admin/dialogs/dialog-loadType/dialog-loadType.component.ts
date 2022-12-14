import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { Subject } from 'rxjs';

@Component({
    selector: 'dialog-loadType',
    templateUrl: 'dialog-loadType.component.html'
})
export class DialogLoadTypeComponent {
    form: FormGroup;
    formErrors: any;
    formValid: boolean;
    formData: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogLoadTypeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.formErrors = data.formErrors;
        this.formData = data;

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.form = this.data.form;
        this.formValid = false;
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        this.dialogRef.close(this.form.value);
    }
}