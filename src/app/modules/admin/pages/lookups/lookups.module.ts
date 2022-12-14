import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LookupsComponent } from 'app/modules/admin/pages/lookups/lookups.component';

import { SharedModule } from 'app/shared/shared.module';

const businessDirectoryRoutes: Route[] = [
    {
        path     : '',
        component: LookupsComponent
    }
];

@NgModule({
    declarations: [
        LookupsComponent
    ],
    imports     : [
        RouterModule.forChild(businessDirectoryRoutes),

        SharedModule
    ]
})
export class LookupsModule
{
}
