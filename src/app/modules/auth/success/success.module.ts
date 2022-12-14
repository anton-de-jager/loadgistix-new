import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { AuthSuccessComponent } from 'app/modules/auth/success/success.component';
import { authSuccessRoutes } from 'app/modules/auth/success/success.routing';

@NgModule({
    declarations: [
        AuthSuccessComponent
    ],
    imports     : [
        RouterModule.forChild(authSuccessRoutes),
        MatButtonModule,
        FuseCardModule,
        SharedModule
    ]
})
export class AuthSuccessModule
{
}
