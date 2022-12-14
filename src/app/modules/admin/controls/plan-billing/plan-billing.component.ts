import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { User } from 'app/core/user/user.types';
import { ApiService } from 'app/modules/admin/services/api.service';
import { environment } from 'environments/environment';
import { Md5 } from 'ts-md5';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';

@Component({
    selector: 'plan-billing',
    templateUrl: './plan-billing.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanBillingComponent implements OnInit {
    @Input()
    page: string;
    
    plans: any[];
    user = JSON.parse(localStorage.getItem('user'));
    selectedBusinessDirectory = false;
    selectedAdvert = false;
    selectedVehicle1 = false;
    selectedVehicle5 = false;
    selectedVehicle10 = false;
    selectedVehicle11 = false;
    selectedLoad5 = false;
    selectedLoad10 = false;
    selectedLoad11 = false;
    pricing =
        {
            Advert: [
                { quantity: 1, usd: 11, zar: 199 }
            ],
            BusinessDirectory: [
                { quantity: 1, usd: 6, zar: 99 }
            ],
            Vehicle: [
                { quantity: 1, usd: 9, zar: 150 },
                { quantity: 5, usd: 34, zar: 590 },
                { quantity: 10, usd: 55, zar: 975 },
                { quantity: 11, usd: 127, zar: 2250 }
            ],
            Load: [
                { quantity: 5, usd: 17, zar: 290 },
                { quantity: 10, usd: 28, zar: 490 },
                { quantity: 11, usd: 82, zar: 1450 }
            ]
        };
    usd = 0;
    zar = 0;
    zarOriginal = 0;
    checkOutReady = false;
    checkOutDone = false;
    @ViewChild('activateButton') activateButton: ElementRef<HTMLElement>;
    activated = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private apiService: ApiService,
        private fuseSplashScreenService: FuseSplashScreenService
    ) {
        App.addListener('appStateChange', ({ isActive }) => {
            console.log('App state changed. Is active?', isActive);
        });

        App.addListener('appUrlOpen', data => {
            console.log('App opened with URL:', data);
        });

        App.addListener('appRestoredResult', data => {
            console.log('Restored state:', data);
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        switch (this.user.vehicles) {
            case 1:
                this.selectedVehicle1 = true;
                break;
            case 5:
                this.selectedVehicle5 = true;
                break;
            case 10:
                this.selectedVehicle10 = true;
                break;
            case -1:
                this.selectedVehicle11 = true;
                break;
            default:
                break;
        }
        switch (this.user.loads) {
            case 5:
                this.selectedLoad5 = true;
                break;
            case 10:
                this.selectedLoad10 = true;
                break;
            case -1:
                this.selectedLoad11 = true;
                break;
            default:
                break;
        }
        this.selectedBusinessDirectory = this.user.directory > 0;
        this.selectedAdvert = this.user.adverts > 0;
        setTimeout(() => {
            this.usd = this.getUSD();
            this.zar = this.getZAR();
            this.zarOriginal = Number(this.getZAR().toString());
            let el: HTMLElement = this.activateButton.nativeElement;
            el.click();
        }, 100);
    }

    onSelectCardBusinessDirectory() {
        this.checkOutReady = false;
        this.selectedBusinessDirectory = !this.selectedBusinessDirectory;
        this.usd = this.getUSD();
        this.zar = this.getZAR();
        let el: HTMLElement = this.activateButton.nativeElement;
        el.click();
    }

    onSelectCardAdvert() {
        this.checkOutReady = false;
        this.selectedAdvert = !this.selectedAdvert;
        this.usd = this.getUSD();
        this.zar = this.getZAR();
        let el: HTMLElement = this.activateButton.nativeElement;
        el.click();
    }

    onSelectCardVehicle(index) {
        this.checkOutReady = false;
        //this.payPalConfig = null;
        switch (index) {
            case 1:
                this.selectedVehicle1 = !this.selectedVehicle1;
                this.selectedVehicle5 = false;
                this.selectedVehicle10 = false;
                this.selectedVehicle11 = false;
                //if(this.selectedVehicle1){this.payPalConfig = this.initConfig(1);}
                break;
            case 5:
                this.selectedVehicle5 = !this.selectedVehicle5;
                this.selectedVehicle1 = false;
                this.selectedVehicle10 = false;
                this.selectedVehicle11 = false;
                //if(this.selectedVehicle5){this.payPalConfig = this.initConfig(5);}
                break;
            case 10:
                this.selectedVehicle10 = !this.selectedVehicle10;
                this.selectedVehicle1 = false;
                this.selectedVehicle5 = false;
                this.selectedVehicle11 = false;
                //if(this.selectedVehicle10){this.payPalConfig = this.initConfig(10);}
                break;
            case 11:
                this.selectedVehicle11 = !this.selectedVehicle11;
                this.selectedVehicle1 = false;
                this.selectedVehicle5 = false;
                this.selectedVehicle10 = false;
                //if(this.selectedVehicle11){this.payPalConfig = this.initConfig(11);}
                break;
            default:
                break;
        }
        this.usd = this.getUSD();
        this.zar = this.getZAR();
        let el: HTMLElement = this.activateButton.nativeElement;
        el.click();
    }

    onSelectCardLoad(index) {
        this.checkOutReady = false;
        switch (index) {
            case 5:
                this.selectedLoad5 = !this.selectedLoad5;
                this.selectedLoad10 = false;
                this.selectedLoad11 = false;
                //if(this.selectedLoad5){this.payPalConfig = this.initConfig(5);}
                break;
            case 10:
                this.selectedLoad10 = !this.selectedLoad10;
                this.selectedLoad5 = false;
                this.selectedLoad11 = false;
                //if(this.selectedLoad10){this.payPalConfig = this.initConfig(10);}
                break;
            case 11:
                this.selectedLoad11 = !this.selectedLoad11;
                this.selectedLoad5 = false;
                this.selectedLoad10 = false;
                //if(this.selectedLoad11){this.payPalConfig = this.initConfig(11);}
                break;
            default:
                break;
        }
        this.usd = this.getUSD();
        this.zar = this.getZAR();
        let el: HTMLElement = this.activateButton.nativeElement;
        el.click();
    }

    getValue(page, quantity) {
        switch (page) {
            case 'Vehicle':
                return this.pricing.Vehicle.find(x => x.quantity == quantity) ? this.pricing.Vehicle.find(x => x.quantity == quantity) : { quantity: 0, usd: 0, zar: 0 };
            case 'Load':
                return this.pricing.Load.find(x => x.quantity == quantity) ? this.pricing.Load.find(x => x.quantity == quantity) : { quantity: 0, usd: 0, zar: 0 };
            case 'BusinessDirectory':
                return this.pricing.BusinessDirectory.find(x => x.quantity == quantity) ? this.pricing.BusinessDirectory.find(x => x.quantity == quantity) : { quantity: 0, usd: 0, zar: 0 };
            case 'Advert':
                return this.pricing.Advert.find(x => x.quantity == quantity) ? this.pricing.Advert.find(x => x.quantity == quantity) : { quantity: 0, usd: 0, zar: 0 };
            default:
                return { quantity: 0, usd: 0, zar: 0 };
        }
    }

    getUSD() {
        return (this.selectedAdvert ? this.getValue('Advert', 1).usd : 0)
            + (this.selectedBusinessDirectory ? this.getValue('BusinessDirectory', 1).usd : 0)
            + (this.selectedVehicle1 ? this.getValue('Vehicle', 1).usd : 0)
            + (this.selectedVehicle5 ? this.getValue('Vehicle', 5).usd : 0)
            + (this.selectedVehicle10 ? this.getValue('Vehicle', 10).usd : 0)
            + (this.selectedVehicle11 ? this.getValue('Vehicle', 11).usd : 0)
            + (this.selectedLoad5 ? this.getValue('Load', 5).usd : 0)
            + (this.selectedLoad10 ? this.getValue('Load', 10).usd : 0)
            + (this.selectedLoad11 ? this.getValue('Load', 11).usd : 0)
    }

    getZAR() {
        return (this.selectedAdvert ? this.getValue('Advert', 1).zar : 0)
            + (this.selectedBusinessDirectory ? this.getValue('BusinessDirectory', 1).zar : 0)
            + (this.selectedVehicle1 ? this.getValue('Vehicle', 1).zar : 0)
            + (this.selectedVehicle5 ? this.getValue('Vehicle', 5).zar : 0)
            + (this.selectedVehicle10 ? this.getValue('Vehicle', 10).zar : 0)
            + (this.selectedVehicle11 ? this.getValue('Vehicle', 11).zar : 0)
            + (this.selectedLoad5 ? this.getValue('Load', 5).zar : 0)
            + (this.selectedLoad10 ? this.getValue('Load', 10).zar : 0)
            + (this.selectedLoad11 ? this.getValue('Load', 11).zar : 0)
    }

    getQuantity(item) {
        switch (item) {
            case 'vehicle':
                if (this.selectedVehicle1) {
                    return 1;
                } else {
                    if (this.selectedVehicle5) {
                        return 5;
                    } else {
                        if (this.selectedVehicle10) {
                            return 10;
                        } else {
                            if (this.selectedVehicle11) {
                                return -1;
                            } else {
                                return 0;
                            }
                        }
                    }
                }
            case 'load':
                if (this.selectedLoad5) {
                    return 5;
                } else {
                    if (this.selectedLoad10) {
                        return 10;
                    } else {
                        if (this.selectedLoad11) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                }
            case 'advert':
                return this.selectedAdvert ? 1 : 0;
            case 'directory':
                return this.selectedBusinessDirectory ? 1 : 0;
            default:
                return 0;
        }
    }

    checkOut() {
        this.fuseSplashScreenService.show();
        this.payfast();
        // this.payPalConfig = null;
        // this.fuseSplashScreenService.show();
        // this.initConfig();
        // setTimeout(() => {
        //     this.checkOutReady = true;
        //     this.fuseSplashScreenService.hide();
        //     let el: HTMLElement = this.activateButton.nativeElement;
        //     el.click();
        // }, 3000);
    }

    payfast() {
        const myData = [];
        // Merchant details
        myData["merchant_id"] = environment.merchant_id;
        myData["merchant_key"] = environment.merchant_key;
        myData["cancel_url"] = environment.urlShort + this.page + '?action=cancel';
        myData["return_url"] = environment.urlShort + this.page + '?action=return';
        myData["notify_url"] = environment.apiUrl + "payfast";
        // Buyer details
        myData["name_first"] = this.user.firstName;
        myData["name_last"] = this.user.lastName;
        myData["email_address"] = this.user.email;
        // Transaction details
        myData["m_payment_id"] = this.user.id.toString();
        myData["amount"] = this.getZAR();
        myData["item_name"] = "Loadgistix Subscription";

        myData["subscription_type"] = "1";
        myData["frequency"] = "3";
        myData["cycles"] = "0";

        myData["custom_int1"] = this.getQuantity('vehicle').toString();
        myData["custom_int2"] = this.getQuantity('load').toString();
        myData["custom_int3"] = this.getQuantity('advert').toString();
        myData["custom_int4"] = this.getQuantity('directory').toString();


        // Generate signature
        this.generateAPISignature(myData, environment.passPhrase);

        // let params = '';
        // for (let key in myData) {
        //   if(myData.hasOwnProperty(key)){
        //     params = params == '' ? key + '=' + myData[key] : params + '&' + key + '=' + myData[key];
        //   }
        // }

        // setTimeout(() => {
        //     window.open('https://' + environment.pfHost + '.payfast.co.za/eng/process?' + params, '_blank');
        //     console.log(params);
        //     // this.apiService.payfastSubscribe('https://' + environment.pfHost + '.payfast.co.za/eng/process', params).subscribe(res => {
        //     //     console.log(res);
        //     //     window.location.href = 'https://' + environment.pfHost + '.payfast.co.za/eng/process?' + params;
        //     // })
        // }, 500);

        // htmlForm += '<input type="submit" value="Pay Now" /></form>'; 
        // return htmlForm;
    }

    generateAPISignature = (data, passPhrase = null) => {
        // Arrange the array by key alphabetically for API calls
        let ordered_data = {};
        let getString = '';
        let params = '';

        Object.keys(data).sort().forEach(key => {
            ordered_data[key] = data[key];
        });
        data = ordered_data;

        setTimeout(() => {
            for (let key in data) {
                getString += key + '=' + encodeURIComponent(data[key]).replace(/%20/g, '+') + '&';
                params += key + '=' + encodeURIComponent(data[key]).replace(/%20/g, '+') + '&';
            }

            setTimeout(() => {
                //Browser.open({ url: 'https://' + environment.pfHost + '.payfast.co.za/eng/process?' + params + 'signature=' + Md5.hashStr(getString + `passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`) });
                Browser.open({ url: 'https://' + environment.pfHost + '.payfast.co.za/eng/process?' + getString + `passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`, windowName: '_self' });
            }, 100);
        }, 100);
    }

    // private initConfig(): void {
    //     if (localStorage.getItem('subscriptionId') == null) {

    //     } else {
    //         this.payPalConfig = {
    //             currency: 'USD',
    //             clientId: environment.paypalClientId,
    //             vault: "true",
    //             intent: "subscription",
    //             createSubscriptionOnClient: (data) => <ICreateSubscriptionRequest>{
    //                 plan_id: environment.paypalPlanId,
    //                 quantity: this.usd,
    //                 custom_id: this.user.id.toString(),
    //             },
    //             advanced: {
    //                 commit: 'true'
    //             },
    //             style: {
    //                 label: 'subscribe',
    //                 layout: 'vertical',
    //                 shape: 'pill'
    //             },
    //             onApprove: (data, actions) => {
    //                 //console.log('onApprove - transaction was approved, but not authorized', data, actions);
    //                 console.log('orderID', data.orderID);
    //                 console.log('payerID', data.payerID);
    //                 console.log('subscriptionID', data.subscriptionID);
    //                 this.apiService.paid({
    //                     userId: this.user.id.toString(),
    //                     orderId: data.orderID,
    //                     subscriptionId: data.subscriptionID,
    //                     price: this.usd,
    //                     vehiclesQuantity: this.getQuantity('vehicle'),
    //                     loadsQuantity: this.getQuantity('load'),
    //                     advertsQuantity: this.getQuantity('advert'),
    //                     directoryQuantity: this.getQuantity('directory')
    //                 }).subscribe(result => {
    //                     this.user.vehicles = this.getQuantity('vehicle');
    //                     this.user.loads = this.getQuantity('load');
    //                     this.user.adverts = this.getQuantity('advert');
    //                     this.user.directory = this.getQuantity('directory');
    //                     this.user.orderId = this.getQuantity('orderId');
    //                     this.user.subscriptionId = this.getQuantity('subscriptionId');
    //                     this.user.subscriptionStatus = this.getQuantity('subscriptionStatus');
    //                     localStorage.setItem('user', JSON.stringify(this.user));
    //                     localStorage.setItem('vehiclesQuantity', JSON.stringify(this.user.vehicles));
    //                     localStorage.setItem('loadsQuantity', JSON.stringify(this.user.loads));
    //                     localStorage.setItem('advertsQuantity', JSON.stringify(this.user.adverts));
    //                     localStorage.setItem('directoryQuantity', JSON.stringify(this.user.directory));
    //                     localStorage.setItem('orderId', JSON.stringify(this.user.orderId));
    //                     localStorage.setItem('subscriptionId', JSON.stringify(this.user.subscriptionId));
    //                     localStorage.setItem('subscriptionStatus', JSON.stringify(this.user.subscriptionStatus));
    //                     this.checkOutDone = true;
    //                     this.checkOutReady = false;
    //                 });
    //                 // facilitatorAccessToken: "A21AAJPkGzeulCJOyjhRyJd8cGYD3FDhXb3zbtc4L101axTg9SUTmpMPfkZX7e8hV67yKC1HB7QkhGZX_JkKdUe0qHimeWyng"
    //                 // orderID: "909241869F8769929"
    //                 // paymentSource: "card"
    //                 // subscriptionID: "I-FJW8G9B8UAC8"
    //             },
    //             onClientAuthorization: (data) => {
    //                 console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
    //                 //this.showSuccess = true;
    //             },
    //             onCancel: (data, actions) => {
    //                 console.log('OnCancel', data, actions);
    //                 //this.showCancel = true;

    //             },
    //             onError: (err) => {
    //                 console.log('OnError', err);
    //                 //this.showError = true;
    //             },
    //             onClick: (data, actions) => {
    //                 console.log('onClick', data, actions);
    //                 //this.resetStatus();
    //             }
    //         };
    //     }
    // }

    activate() {
        this.activated = true;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
