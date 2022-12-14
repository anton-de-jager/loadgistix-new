import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { TimesheetView } from 'app/modules/admin/models/timesheet.view';
import { TimesheetItem } from 'app/modules/admin/models/timesheetItem.model';
import { ApiService } from 'app/modules/admin/services/api.service';
import { Guid } from 'guid-typescript';


@Component({
    selector: 'timesheet',
    templateUrl: './timesheet.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class TimesheetComponent implements OnInit, OnDestroy {
    timesheet: TimesheetView;
    timesheetItems: TimesheetItem[] = [];
    startDate: Date;
    hoursRegularTotal: number = 0;
    hoursOvertimeTotal: number = 0;
    id: Guid;

    constructor(private apiService: ApiService, splashScreen: FuseSplashScreenService, private route: ActivatedRoute) {
        splashScreen.show();
        this.route.queryParamMap.subscribe((params) => {
            this.id = params.get("id") ? Guid.parse(params.get("id")) : Guid.createEmpty();
        });

        this.getTimesheet(this.id).then(getTimesheetResult => {
            if (getTimesheetResult.length > 0) {
                this.timesheet = getTimesheetResult[0];
                this.startDate = new Date(this.timesheet.timesheetDate.toString());
                this.startDate.setMonth(this.startDate.getMonth() - 1);
                this.startDate.setDate(this.startDate.getDate() + 1);
                this.getTimesheetItem(this.id).then(getTimesheetItemResult => {
                    if (getTimesheetItemResult.length > 0) {
                        this.timesheetItems = getTimesheetItemResult;
                    }
                    this.hoursRegularTotal = 0;
                    this.hoursOvertimeTotal = 0;
                    this.timesheetItems.forEach(timesheetItem => {
                        this.hoursRegularTotal += timesheetItem.hoursRegular;
                        this.hoursOvertimeTotal += timesheetItem.hoursOvertime;
                    });
                    splashScreen.hide();
                });
            } else {
                splashScreen.hide();
            }
        });
    }

    getTimesheet(id: Guid): Promise<TimesheetView[]> {
        var promise = new Promise<TimesheetView[]>((resolve) => {
            try {
                this.apiService.getData('timesheet', id).subscribe((prospectResult: TimesheetView[]) => {
                    resolve(prospectResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
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

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
    }
}
