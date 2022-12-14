import { Route } from '@angular/router';
import { AdminProspectComponent } from 'app/modules/admin/pages/prospect/prospect.component';
import { AdminProspectResolver } from 'app/modules/admin/pages/prospect/prospect.resolvers';

export const prospectRoutes: Route[] = [
    {
        path     : '',
        component: AdminProspectComponent,
        resolve  : {
            //data: AdminProspectResolver
        }
    }
];
