import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { VariableService } from 'app/shared/variable.service';
import { Subject } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

@Component({
    selector: 'privacy-policy',
    templateUrl: './privacyPolicy.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PrivacyPolicyComponent {
    isScreenSmall: boolean;
    native: string = '';
    
    constructor(
        public variableService: VariableService,
        private _router: Router
    ) {
        this.native = Capacitor.isNativePlatform() ? 'White' : '';
    }

    get currentYear(): number {
        return new Date().getFullYear();
    }

    navigateExternal(event:Event, url) {
        event.preventDefault();
        if (Capacitor.isNativePlatform) {
            Browser.open({ url });
        }else{
            window.open(url, '_blank');
        }
    }
}
