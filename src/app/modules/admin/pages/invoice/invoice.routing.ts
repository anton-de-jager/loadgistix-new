import { Route } from '@angular/router';
import { AdminInvoiceComponent } from 'app/modules/admin/pages/invoice/invoice.component';
import { AdminInvoiceResolver } from 'app/modules/admin/pages/invoice/invoice.resolvers';

export const invoiceRoutes: Route[] = [
    {
        path     : '',
        component: AdminInvoiceComponent,
        resolve  : {
            //data: AdminInvoiceResolver
        }
    }
];
