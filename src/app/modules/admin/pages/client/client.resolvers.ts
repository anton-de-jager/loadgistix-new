import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminClientService } from 'app/modules/admin/pages/client/client.service';

@Injectable({
    providedIn: 'root'
})
export class AdminClientResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _clientService: AdminClientService)
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
        return this._clientService.getData();
    }
}
