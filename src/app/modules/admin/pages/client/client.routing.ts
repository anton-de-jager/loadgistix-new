import { Route } from '@angular/router';
import { AdminClientComponent } from 'app/modules/admin/pages/client/client.component';
import { AdminClientResolver } from 'app/modules/admin/pages/client/client.resolvers';

export const clientRoutes: Route[] = [
    {
        path     : '',
        component: AdminClientComponent,
        resolve  : {
            //data: AdminClientResolver
        }
    }
];
