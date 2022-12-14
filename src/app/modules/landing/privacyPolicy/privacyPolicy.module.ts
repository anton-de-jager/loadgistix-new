import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { PrivacyPolicyComponent } from 'app/modules/landing/privacyPolicy/privacyPolicy.component';
import { privacyPolicyRoutes } from 'app/modules/landing/privacyPolicy/privacyPolicy.routing';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { UserModule } from 'app/layout/common/user/user.module';

@NgModule({
    declarations: [
        PrivacyPolicyComponent
    ],
    imports     : [
        RouterModule.forChild(privacyPolicyRoutes),
        MatButtonModule,
        MatIconModule,
        FuseNavigationModule,
        UserModule,
        SharedModule
    ]
})
export class PrivacyPolicyModule
{
}
