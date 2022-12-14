import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { Invoice } from 'app/modules/admin/models/invoice.model';
import { InvoiceItemView } from 'app/modules/admin/models/invoiceItem.view';
import { ApiService } from 'app/modules/admin/services/api.service';
import { Guid } from 'guid-typescript';


@Component({
    selector     : 'invoice',
    templateUrl  : './invoice.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class InvoiceComponent implements OnInit, OnDestroy {
    invoice: Invoice;
    invoiceItems: InvoiceItemView[] = [];
    id: Guid;
    subtotal:number;
    vat:number;
    total:number;

    constructor(private apiService: ApiService, splashScreen: FuseSplashScreenService, private route: ActivatedRoute) {
        splashScreen.show();
        this.route.queryParamMap.subscribe((params) => {
            this.id = params.get("id") ? Guid.parse(params.get("id")) : Guid.createEmpty();
        });

        this.getInvoice(this.id).then(getInvoiceResult => {
            if (getInvoiceResult.length > 0) {
                this.invoice = getInvoiceResult[0];
                this.getInvoiceItem(this.invoice.id).then(getInvoiceItemResult => {
                    if (getInvoiceItemResult.length > 0) {
                        this.invoiceItems = getInvoiceItemResult;
                        this.subtotal = 0;
                        this.vat = 0;
                        this.total = 0;
                        this.invoiceItems.forEach(invoiceItem => {
                            this.subtotal += invoiceItem.totalOvertime + invoiceItem.totalRegular;
                            this.vat += (invoiceItem.totalOvertime + invoiceItem.totalRegular) * 0.15;
                            this.total += (invoiceItem.totalOvertime + invoiceItem.totalRegular) + ((invoiceItem.totalOvertime + invoiceItem.totalRegular) * 0.15); 
                        });
                        splashScreen.hide();
                    } else {
                        splashScreen.hide();
                    }
                });
            } else {
                splashScreen.hide();
            }
        });
    }

    getInvoice(id: Guid): Promise<Invoice[]> {
        var promise = new Promise<Invoice[]>((resolve) => {
            try {
                this.apiService.getData('invoice', id).subscribe((invoiceResult: Invoice[]) => {
                    resolve(invoiceResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    getInvoiceItem(id: Guid): Promise<InvoiceItemView[]> {
        var promise = new Promise<InvoiceItemView[]>((resolve) => {
            try {
                this.apiService.getData('invoiceItem', id).subscribe((invoiceResult: InvoiceItemView[]) => {
                    resolve(invoiceResult);
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