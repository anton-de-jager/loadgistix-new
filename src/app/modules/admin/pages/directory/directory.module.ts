import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DirectoryComponent } from 'app/modules/admin/pages/directory/directory.component';

import { SharedModule } from 'app/shared/shared.module';

const directoryRoutes: Route[] = [
    {
        path     : '',
        component: DirectoryComponent
    }
];

@NgModule({
    declarations: [
        DirectoryComponent
    ],
    imports     : [
        RouterModule.forChild(directoryRoutes),

        SharedModule
    ]
})
export class DirectoryModule
{
}
