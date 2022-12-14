import { Route } from '@angular/router';
import { AdminSowComponent } from 'app/modules/admin/pages/sow/sow.component';
import { AdminSowResolver } from 'app/modules/admin/pages/sow/sow.resolvers';

export const sowRoutes: Route[] = [
    {
        path     : '',
        component: AdminSowComponent,
        resolve  : {
            //data: AdminSowResolver
        }
    }
];
