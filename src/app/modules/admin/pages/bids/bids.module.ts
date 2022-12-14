import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BidsComponent } from 'app/modules/admin/pages/bids/bids.component';

import { SharedModule } from 'app/shared/shared.module';

const bidsRoutes: Route[] = [
    {
        path     : '',
        component: BidsComponent
    }
];

@NgModule({
    declarations: [
        BidsComponent
    ],
    imports     : [
        RouterModule.forChild(bidsRoutes),

        SharedModule
    ]
})
export class BidsModule
{
}
