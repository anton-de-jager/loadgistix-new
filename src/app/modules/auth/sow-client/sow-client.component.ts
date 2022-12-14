import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { SowView } from 'app/modules/admin/models/sow.view';
import { ApiService } from 'app/modules/admin/services/api.service';
import { Guid } from 'guid-typescript';


@Component({
    selector: 'sow-client',
    templateUrl: './sow-client.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class SowClientComponent implements OnInit, OnDestroy {
    sow: SowView;
    id: Guid;

    constructor(private apiService: ApiService, splashScreen: FuseSplashScreenService, private route: ActivatedRoute) {
        splashScreen.show();
        this.route.queryParamMap.subscribe((params) => {
            this.id = params.get("id") ? Guid.parse(params.get("id")) : Guid.createEmpty();
        });

        this.getSow(this.id).then(getSowResult => {
            if (getSowResult.length > 0) {
                this.sow = getSowResult[0];
            }
            splashScreen.hide();
        });
    }

    getSow(id: Guid): Promise<SowView[]> {
        var promise = new Promise<SowView[]>((resolve) => {
            try {
                this.apiService.getView('sow', id).subscribe((prospectResult: SowView[]) => {
                    resolve(prospectResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
    }
}
