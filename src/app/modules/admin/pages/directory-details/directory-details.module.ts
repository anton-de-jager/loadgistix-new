import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DirectoryDetailsComponent } from 'app/modules/admin/pages/directory-details/directory-details.component';

import { SharedModule } from 'app/shared/shared.module';

const directoryDetailsRoutes: Route[] = [
    {
        path     : '',
        component: DirectoryDetailsComponent
    }
];

@NgModule({
    declarations: [
        DirectoryDetailsComponent
    ],
    imports     : [
        RouterModule.forChild(directoryDetailsRoutes),

        SharedModule
    ]
})
export class DirectoryDetailsModule
{
}
