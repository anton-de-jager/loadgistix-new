import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Capacitor } from '@capacitor/core';

@Component({
    selector     : 'auth-confirmation-required',
    templateUrl  : './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthConfirmationRequiredComponent
{
    native: string = '';
    /**
     * Constructor
     */
    constructor()
    {
        this.native = Capacitor.isNativePlatform() ? 'White' : '';
    }
}
