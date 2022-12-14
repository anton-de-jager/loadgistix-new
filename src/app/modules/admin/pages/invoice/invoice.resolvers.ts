import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminInvoiceService } from 'app/modules/admin/pages/invoice/invoice.service';

@Injectable({
    providedIn: 'root'
})
export class AdminInvoiceResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _invoiceService: AdminInvoiceService)
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
        return this._invoiceService.getData();
    }
}
