import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'app/modules/admin/services/api.service';
import { Subject } from 'rxjs';
import { MatDatepicker } from '@angular/material/datepicker';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { Guid } from 'guid-typescript';
import { Client } from 'app/modules/admin/models/client.model';
import { MatSelectChange } from '@angular/material/select';
import { TimesheetView } from 'app/modules/admin/models/timesheet.view';
import { InvoiceItem } from 'app/modules/admin/models/invoiceItem.model';

@Component({
    selector: 'dialog-invoice',
    templateUrl: 'dialog-invoice.component.html'
})
export class DialogInvoiceComponent {
    splashScreen: FuseSplashScreenService
    loading: boolean = true;

    form: FormGroup;
    formErrors: any;
    formValid: boolean;
    private _unsubscribeAll: Subject<any>;
    formData: any;

    invoiceId: Guid;
    clientItems: Client[] = [];
    timesheetItems: TimesheetView[] = [];
    timesheetItemsSelected: Guid[];

    constructor(
        splashScreen: FuseSplashScreenService,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogInvoiceComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private _formBuilder: FormBuilder
    ) {
        this.splashScreen = splashScreen;
        this.formErrors = data.formErrors;
        this.formData = data;

        this.getClient(Guid.createEmpty()).then(getClientResult => {
            this.clientItems = getClientResult;
        });

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.form = this.data.form;
        this.formValid = false;

        this.invoiceId = this.form.controls['id'].value;

        if (this.form.controls['clientId'].value == null) {
            this.splashScreen.hide();
        } else {
            this.getTimesheet(this.form.controls['clientId'].value).then(getTimesheetResult => {
                this.timesheetItems = getTimesheetResult;
                this.getInvoiceItem().then(getInvoiceItemResult => {
                    this.timesheetItemsSelected = [];
                    getInvoiceItemResult.forEach(invoiceItem => {
                        this.timesheetItemsSelected.push(invoiceItem.timesheetId);
                    });
                    this.splashScreen.hide();
                });
            });
        }

        this.loading = false;
    }

    getClient(id: Guid): Promise<Client[]> {
        var promise = new Promise<Client[]>((resolve) => {
            try {
                this.apiService.getData('client', id).subscribe((clientResult: Client[]) => {
                    resolve(clientResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    changeClient(change: MatSelectChange): void {
        this.splashScreen.show();
        this.getTimesheet(change.value).then(getTimesheetResult => {
            this.timesheetItems = getTimesheetResult;
            this.getInvoiceItem().then(getInvoiceItemResult => {
                this.timesheetItemsSelected = [];
                getInvoiceItemResult.forEach(invoiceItem => {
                    this.timesheetItemsSelected.push(invoiceItem.timesheetId);
                });
                this.splashScreen.hide();
            });
        });
    }

    getTimesheet(clientId: Guid): Promise<TimesheetView[]> {
        var promise = new Promise<TimesheetView[]>((resolve) => {
            try {
                this.apiService.getTimesheetsReady(clientId, this.invoiceId).subscribe((clientResult: TimesheetView[]) => {
                    resolve(clientResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    getInvoiceItem(): Promise<InvoiceItem[]> {
        var promise = new Promise<InvoiceItem[]>((resolve) => {
            try {
                this.apiService.getData('invoiceItem', this.invoiceId).subscribe((invoiceItemResult: InvoiceItem[]) => {
                    resolve(invoiceItemResult);
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
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        this.dialogRef.close({ form: this.form.getRawValue(), timesheetItemsSelected: this.timesheetItemsSelected });
    }
}