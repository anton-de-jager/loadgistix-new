import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminProfileService } from 'app/modules/admin/pages/profile/profile.service';

@Injectable({
    providedIn: 'root'
})
export class AdminProfileResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _profileService: AdminProfileService)
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
        return this._profileService.getData();
    }
}
