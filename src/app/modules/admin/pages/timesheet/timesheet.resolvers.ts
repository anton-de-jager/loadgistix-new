import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminTimesheetService } from 'app/modules/admin/pages/timesheet/timesheet.service';

@Injectable({
    providedIn: 'root'
})
export class AdminTimesheetResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _timesheetService: AdminTimesheetService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._timesheetService.getData();
    }
}
