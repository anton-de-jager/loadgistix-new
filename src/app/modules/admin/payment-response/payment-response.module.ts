import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PaymentResponseComponent } from 'app/modules/admin/payment-response/payment-response.component';

const paymentResponseRoutes: Route[] = [
    {
        path     : '',
        component: PaymentResponseComponent
    }
];

@NgModule({
    declarations: [
        PaymentResponseComponent
    ],
    imports     : [
        RouterModule.forChild(paymentResponseRoutes)
    ]
})
export class PaymentResponseModule
{
}
