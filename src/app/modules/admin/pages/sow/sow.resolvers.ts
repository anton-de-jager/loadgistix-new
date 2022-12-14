import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminSowService } from 'app/modules/admin/pages/sow/sow.service';

@Injectable({
    providedIn: 'root'
})
export class AdminSowResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _sowService: AdminSowService)
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
        return this._sowService.getData();
    }
}
