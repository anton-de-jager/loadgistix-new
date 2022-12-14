import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { AuthCancelComponent } from 'app/modules/auth/cancel/cancel.component';
import { authCancelRoutes } from 'app/modules/auth/cancel/cancel.routing';

@NgModule({
    declarations: [
        AuthCancelComponent
    ],
    imports     : [
        RouterModule.forChild(authCancelRoutes),
        MatButtonModule,
        FuseCardModule,
        SharedModule
    ]
})
export class AuthCancelModule
{
}
