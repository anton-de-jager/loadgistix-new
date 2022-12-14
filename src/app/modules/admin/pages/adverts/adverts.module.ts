import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AdvertsComponent } from 'app/modules/admin/pages/adverts/adverts.component';

import { SharedModule } from 'app/shared/shared.module';

const advertsRoutes: Route[] = [
    {
        path     : '',
        component: AdvertsComponent
    }
];

@NgModule({
    declarations: [
        AdvertsComponent
    ],
    imports     : [
        RouterModule.forChild(advertsRoutes),

        SharedModule
    ]
})
export class AdvertsModule
{
}
