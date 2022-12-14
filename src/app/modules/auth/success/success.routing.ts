import { Route } from '@angular/router';
import { AuthSuccessComponent } from 'app/modules/auth/success/success.component';

export const authSuccessRoutes: Route[] = [
    {
        path     : '',
        component: AuthSuccessComponent
    }
];
