import { Route } from '@angular/router';
import { AdminTimesheetComponent } from 'app/modules/admin/pages/timesheet/timesheet.component';
import { AdminTimesheetResolver } from 'app/modules/admin/pages/timesheet/timesheet.resolvers';

export const timesheetRoutes: Route[] = [
    {
        path     : '',
        component: AdminTimesheetComponent,
        resolve  : {
            //data: AdminTimesheetResolver
        }
    }
];
