import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { VehiclesComponent } from 'app/modules/admin/pages/vehicles/vehicles.component';

import { SharedModule } from 'app/shared/shared.module';

const vehiclesRoutes: Route[] = [
    {
        path     : '',
        component: VehiclesComponent
    }
];

@NgModule({
    declarations: [
        VehiclesComponent
    ],
    imports     : [
        RouterModule.forChild(vehiclesRoutes),

        SharedModule
    ]
})
export class VehiclesModule
{
}
