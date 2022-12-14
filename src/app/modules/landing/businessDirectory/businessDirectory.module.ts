import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BusinessDirectoryOpenComponent } from 'app/modules/landing/businessDirectory/businessDirectory.component';

import { SharedModule } from 'app/shared/shared.module';
import { UserModule } from 'app/layout/common/user/user.module';
import { FuseNavigationModule } from '@fuse/components/navigation';

const businessDirectoryRoutes: Route[] = [
    {
        path     : '',
        component: BusinessDirectoryOpenComponent
    }
];

@NgModule({
    declarations: [
        BusinessDirectoryOpenComponent
    ],
    imports     : [
        RouterModule.forChild(businessDirectoryRoutes),
        UserModule,
        FuseNavigationModule,

        SharedModule
    ]
})
export class BusinessDirectoryOpenModule
{
}
