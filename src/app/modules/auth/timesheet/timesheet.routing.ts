import { Route } from '@angular/router';
import { TimesheetComponent } from 'app/modules/auth/timesheet/timesheet.component';

export const timesheetRoutes: Route[] = [
    {
        path     : '',
        component: TimesheetComponent
    }
];
