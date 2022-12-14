import { Route } from '@angular/router';
import { MsaClientComponent } from 'app/modules/auth/msa-client/msa-client.component';

export const msaClientRoutes: Route[] = [
    {
        path     : '',
        component: MsaClientComponent
    }
];
