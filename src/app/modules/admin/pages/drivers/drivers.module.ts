import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DriversComponent } from 'app/modules/admin/pages/drivers/drivers.component';

import { SharedModule } from 'app/shared/shared.module';

const driversRoutes: Route[] = [
    {
        path     : '',
        component: DriversComponent
    }
];

@NgModule({
    declarations: [
        DriversComponent,
    ],
    imports     : [
        RouterModule.forChild(driversRoutes),

        SharedModule
    ]
})
export class DriversModule
{
}
