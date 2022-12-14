import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoadsAvailableComponent } from 'app/modules/admin/pages/loads-available/loads-available.component';

import { SharedModule } from 'app/shared/shared.module';

const loadsAvaiableRoutes: Route[] = [
    {
        path     : '',
        component: LoadsAvailableComponent
    }
];

@NgModule({
    declarations: [
        LoadsAvailableComponent
    ],
    imports     : [
        RouterModule.forChild(loadsAvaiableRoutes),

        SharedModule
    ]
})
export class LoadsAvailableModule
{
}
