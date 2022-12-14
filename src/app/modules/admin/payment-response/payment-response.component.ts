import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'payment-response',
    templateUrl  : './payment-response.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PaymentResponseComponent
{
    user = JSON.parse(localStorage.getItem('user'));

    constructor()
    {
        console.log(this.user);
    }
}
