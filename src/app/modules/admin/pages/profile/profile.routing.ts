import { Route } from '@angular/router';
import { AdminProfileComponent } from 'app/modules/admin/pages/profile/profile.component';
import { AdminProfileResolver } from 'app/modules/admin/pages/profile/profile.resolvers';

export const profileRoutes: Route[] = [
    {
        path     : '',
        component: AdminProfileComponent,
        resolve  : {
            data: AdminProfileResolver
        }
    }
];
