import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoadsComponent } from 'app/modules/admin/pages/loads/loads.component';

import { SharedModule } from 'app/shared/shared.module';

const loadsRoutes: Route[] = [
    {
        path     : '',
        component: LoadsComponent
    }
];

@NgModule({
    declarations: [
        LoadsComponent
    ],
    imports     : [
        RouterModule.forChild(loadsRoutes),

        SharedModule
    ]
})
export class LoadsModule
{
}
