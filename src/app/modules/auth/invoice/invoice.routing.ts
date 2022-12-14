import { Route } from '@angular/router';
import { InvoiceComponent } from 'app/modules/auth/invoice/invoice.component';

export const invoiceRoutes: Route[] = [
    {
        path     : '',
        component: InvoiceComponent
    }
];
