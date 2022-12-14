import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminProspectService } from 'app/modules/admin/pages/prospect/prospect.service';

@Injectable({
    providedIn: 'root'
})
export class AdminProspectResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _prospectService: AdminProspectService)
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
        return this._prospectService.getData();
    }
}
