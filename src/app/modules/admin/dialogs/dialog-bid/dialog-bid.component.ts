import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { Subject } from 'rxjs';
import { ApiService } from 'app/modules/admin/services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { bid } from '../../models/bid.model';
import { Guid } from 'guid-typescript';

@Component({
    selector: 'dialog-bid',
    templateUrl: 'dialog-bid.component.html'
})
export class DialogBidComponent {
    form: FormGroup;
    formErrors: any;
    formValid: boolean;
    private _unsubscribeAll: Subject<any>;
    formData: any;
    previewImage: string = null;
    readOnly: boolean = false;
    bidRow: bid;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogBidComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private sanitizer: DomSanitizer) {
        this.formErrors = data.formErrors;
        this.formData = data;
        this.bidRow = data.item;
        this.readOnly = data.readOnly == 1 ? true : false;

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.form = this.data.form;
        //this.previewImage = this.form.controls['avatar'].value;
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
    accept(): void {
        this.bidRow.statusId = Guid.parse('6a21aec4-fb07-4740-98b5-b8ecfad465d7');
        this.bidRow.statusDescription = 'Accepted';
        this.dialogRef.close(this.bidRow);
    }
    decline(): void {
        this.bidRow.statusId = Guid.parse('e12dcdd2-65e0-48d3-a313-1b796a7668f9');
        this.bidRow.statusDescription = 'Declined';
        this.dialogRef.close(this.bidRow);
    }
}