import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'app/modules/admin/services/api.service';
import { Subject } from 'rxjs';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { Guid } from 'guid-typescript';
import { TimesheetItem } from 'app/modules/admin/models/timesheetItem.model';
import { UserService } from 'app/core/user/user.service';
import { takeUntil } from 'rxjs/operators';
import { Prospect } from 'app/modules/admin/models/prospect.model';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { formatDate } from '@angular/common';
import { user } from '../../models/user.model';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'dialog-timesheet',
    templateUrl: 'dialog-timesheet.component.html',
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ]
})
export class DialogTimesheetComponent {
    user: user;
    splashScreen: FuseSplashScreenService
    loading: boolean = true;

    form: FormGroup;
    formErrors: any;
    formValid: boolean;
    private _unsubscribeAll: Subject<any>;
    formData: any;

    timesheetItems: TimesheetItem[] = [];

    constructor(
        splashScreen: FuseSplashScreenService,
        public dialogRef: MatDialogRef<DialogTimesheetComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService
    ) {
        this.splashScreen = splashScreen;
        this.splashScreen.show();
        this.formErrors = data.formErrors;
        this.formData = data;

        this.user = JSON.parse(localStorage.getItem('user'));

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.form = this.data.form;
        this.formValid = false;

        this.populateControls(this.form.controls['timesheetDate'].value.toDate()).then(populateControlsResult => {
            this.getTimesheetItem(this.form.controls['id'].value).then(getTimesheetItemResult => {
                if(getTimesheetItemResult.length == 0){
                    this.splashScreen.hide();
                }else{
                    getTimesheetItemResult.forEach(getTimesheetItemResultItem => {                    
                        let item = this.timesheetItems.find(x => formatDate(x.taskDate,'yyyy-MM-dd','en-US') == formatDate(getTimesheetItemResultItem.taskDate,'yyyy-MM-dd','en-US'));
                        if (item) {
                            item.description = getTimesheetItemResultItem.description;
                            item.hoursRegular = getTimesheetItemResultItem.hoursRegular;
                            item.hoursOvertime = getTimesheetItemResultItem.hoursOvertime;
                        }
                    });
                    setTimeout(() => {
                        this.splashScreen.hide();
                    }, 100);
                }
            })
        });

        this.loading = false;
    }

    getTimesheetItem(id: Guid): Promise<TimesheetItem[]> {
        var promise = new Promise<TimesheetItem[]>((resolve) => {
            try {
                this.apiService.getData('timesheetItem', id).subscribe((timesheetItemResult: TimesheetItem[]) => {
                    resolve(timesheetItemResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    chosenYearHandler(normalizedYear: Moment) {
        const ctrlValue = normalizedYear.toDate();//this.form.controls['timesheetDate'].value;
        ctrlValue.setFullYear(normalizedYear.year());
        this.form.controls['timesheetDate'].setValue(ctrlValue);
    }

    chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = normalizedMonth.toDate();//this.form.controls['timesheetDate'].value;
        ctrlValue.setMonth(normalizedMonth.month());
        this.populateControls(ctrlValue);
        datepicker.close();
    }

    getLastDayOfMonth(date: Date) {
        return new Date(date.getFullYear(), (date.getMonth() / 1 + 1), 0).getDate();
    }

    getDaysArray(start, end): Date[] {
        for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
            arr.push(new Date(dt));
        }
        return arr;
    };

    populateControls(date: Date): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                this.timesheetItems = [];
                date.setDate(this.data.dateBillingId == -1 ? this.getLastDayOfMonth(date) : this.data.dateBillingId);
                let dateFrom = new Date(date.toString());

                if (this.data.dateBillingId == -1) {
                    dateFrom.setDate(1);
                } else {
                    dateFrom.setDate(dateFrom.getDate() + 1);
                    dateFrom.setMonth(dateFrom.getMonth() - 1);
                }
                this.form.controls['timesheetDate'].setValue(date);

                this.getDaysArray(dateFrom, date).forEach(dateItem => {
                    this.timesheetItems.push(new TimesheetItem(Guid.create(), this.data.id, dateItem, '', null, null));
                });
                setTimeout(() => {
                    resolve(true);
                }, 100);
            } catch (exception) {
                resolve(false);
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

    isGridValid(): boolean {
        let valid = true;
        this.timesheetItems.forEach(timesheetItem => {
            if (timesheetItem.description == '' && timesheetItem.hoursOvertime + timesheetItem.hoursRegular > 0) {
                valid = false;
            }
        });
        return valid;
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        this.dialogRef.close({ form: this.form.getRawValue(), timesheetItems: this.timesheetItems });
    }
}