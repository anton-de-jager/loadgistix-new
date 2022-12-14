import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { VariableService } from 'app/shared/variable.service';
import { Subject } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogInsuranceComponent } from '../dialog-insurance/dialog-insurance.component';

@Component({
    selector: 'landing-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LandingHomeComponent {
    isScreenSmall: boolean;

    native: string = '';
    image = '';

    constructor(
        private dialog: MatDialog,
        public variableService: VariableService,
        private _router: Router
    ) {
        this.native = Capacitor.isNativePlatform() ? 'White' : '';
        if (Capacitor.getPlatform() !== 'web') {
            this._router.navigate(['/dashboard']);
        }
    }

    ngOnInit(): void {
    }

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    signIn(): void {
        this._router.navigate(['/sign-in']);
    }

    signUp(): void {
        //this._router.navigate(['https://loadgistix.com/sign-up']);
        window.location.href = 'https://app.loadgistix.com/sign-up';
    }

    businessDirectory(): void {
        this._router.navigate(['/businessDirectory']);
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    buttonClick(str) {
        window.location.href = 'https://app.loadgistix.com/#/' + str;
        // const host: string = location.origin;
        // const url: string = host + '/#/' + str;
        // if (Capacitor.isNativePlatform) {
        //     Browser.open({ url });
        // } else {
        //     window.open(url);
        // }
    }

    insurance(){
            const dialogConfig = new MatDialogConfig();
    
            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;
            dialogConfig.ariaLabel = 'fffff';
            dialogConfig.width = "800px";
    
            const dialogRef = this.dialog.open(DialogInsuranceComponent,
                dialogConfig);
    }

    navigateExternal(event: Event, url) {
        event.preventDefault();
        if (Capacitor.isNativePlatform) {
            Browser.open({ url });
        } else {
            window.open(url, '_blank');
        }
    }
}
