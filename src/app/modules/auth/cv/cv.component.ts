import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { Prospect } from 'app/modules/admin/models/prospect.model';
import { ProspectEmployment } from 'app/modules/admin/models/prospectEmployment.model';
import { ProspectEmploymentDuty } from 'app/modules/admin/models/prospectEmploymentDuty.model';
import { ProspectEmploymentTechnology } from 'app/modules/admin/models/prospectEmploymentTechnology.model';
import { ProspectLanguage } from 'app/modules/admin/models/prospectLanguage.model';
import { ProspectSubject } from 'app/modules/admin/models/prospectSubject.model';
import { ProspectTertiary } from 'app/modules/admin/models/prospectTertiary.model';
import { ApiService } from 'app/modules/admin/services/api.service';
import { VariableService } from 'app/shared/variable.service';
import { Guid } from 'guid-typescript';


@Component({
    selector: 'cv',
    templateUrl: './cv.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CvComponent implements OnInit, OnDestroy {
    loading: boolean = true;
    prospect: Prospect;
    id: Guid;

    constructor(
        private apiService: ApiService, 
        private route: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private _router: Router,
        public variableService: VariableService,
        private fuseSplashScreenService: FuseSplashScreenService,
        private fuseConfirmationService: FuseConfirmationService) {
        fuseSplashScreenService.show();
        this.route.queryParamMap.subscribe((params) => {
            this.id = params.get("id") ? Guid.parse(params.get("id")) : Guid.createEmpty();
        });

        this.getProspect(this.id).then(getProspectResult => {
            //console.log(getProspectResult);
            this.prospect = getProspectResult;
            this.fuseSplashScreenService.hide();
            // if (getProspectResult.length > 0) {
            //     this.prospect = getProspectResult[0];
            //     // this.getProspectLanguage(this.prospect.id).then(getProspectLanguageResult => {
            //     //     this.prospect.languageItems = getProspectLanguageResult;
            //     //     this.getProspectSubject(this.prospect.id).then(getProspectSubjectResult => {
            //     //         this.prospect.subjectItems = getProspectSubjectResult;
            //     //         this.getProspectTertiary(this.prospect.id).then(getProspectTertiaryResult => {
            //     //             this.prospect.tertiaryItems = getProspectTertiaryResult;
            //     //             this.getProspectEmployment(this.prospect.id).then(getProspectEmploymentResult => {
            //     //                 this.prospect.employmentItems = getProspectEmploymentResult;
            //     //                 this.fuseSplashScreenService.hide();
            //     //             });
            //     //         });
            //     //     });
            //     // });
            // } else {
            //     this.fuseSplashScreenService.hide();
            // }
        });
    }

    getProspect(id: Guid): Promise<Prospect> {
        var promise = new Promise<Prospect>((resolve) => {
            try {
                this.apiService.getById('prospects', id).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            resolve(apiResult.data);
                        } else {
                            if (apiResult.message == 'Expired') {
                                this._router.navigate(['/sign-out']);
                            } else {
                                this._snackBar.open('Error: ' + apiResult.message, null, { duration: 2000 });
                                this.fuseSplashScreenService.hide(); this.loading = false;
                            }
                        }
                    },
                    error: (error) => {
                        console.log(error);
                        this._snackBar.open('Error: ' + error, null, { duration: 2000 });
                        this.fuseSplashScreenService.hide(); this.loading = false;
                    },
                    complete: () => {
                        //console.log('Done');
                    }
                });
            } catch (exception) {
                resolve(null);
            }
        });
        return promise;
    }
    // getProspect(id: Guid): Promise<Prospect[]> {
    //     var promise = new Promise<Prospect[]>((resolve) => {
    //         try {
    //             this.apiService.getById('prospects', id).subscribe((prospectResult: Prospect[]) => {
    //                 resolve(prospectResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }
    // getProspectLanguage(id: Guid): Promise<ProspectLanguage[]> {
    //     var promise = new Promise<ProspectLanguage[]>((resolve) => {
    //         try {
    //             this.apiService.getData('prospectLanguage', id).subscribe((prospectLanguageResult: ProspectLanguage[]) => {
    //                 resolve(prospectLanguageResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }
    // getProspectSubject(id: Guid): Promise<ProspectSubject[]> {
    //     var promise = new Promise<ProspectSubject[]>((resolve) => {
    //         try {
    //             this.apiService.getData('prospectSubject', id).subscribe((prospectSubjectResult: ProspectSubject[]) => {
    //                 resolve(prospectSubjectResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }
    // getProspectTertiary(id: Guid): Promise<ProspectTertiary[]> {
    //     var promise = new Promise<ProspectTertiary[]>((resolve) => {
    //         try {
    //             this.apiService.getData('prospectTertiary', id).subscribe((prospectTertiaryResult: ProspectTertiary[]) => {
    //                 resolve(prospectTertiaryResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }
    // getProspectEmployment(id: Guid): Promise<ProspectEmployment[]> {
    //     var promise = new Promise<ProspectEmployment[]>((resolve) => {
    //         try {
    //             let i = 0;
    //             this.apiService.getData('prospectEmployment', id).subscribe((prospectEmploymentResult: ProspectEmployment[]) => {
    //                 if (prospectEmploymentResult.length == 0) {
    //                     resolve(prospectEmploymentResult);
    //                 } else {
    //                     prospectEmploymentResult.forEach(prospectEmploymentItem => {
    //                         this.getProspectEmploymentDuty(prospectEmploymentItem.id).then(getProspectEmploymentDutyResult => {
    //                             prospectEmploymentItem.dutyItems = getProspectEmploymentDutyResult;
    //                             i++;
    //                             if (i / 2 == prospectEmploymentResult.length) {
    //                                 setTimeout(() => {
    //                                     resolve(prospectEmploymentResult);
    //                                 }, 100);
    //                             }
    //                         })
    //                         this.getProspectEmploymentTechnology(prospectEmploymentItem.id).then(getProspectEmploymentTechnologyResult => {
    //                             prospectEmploymentItem.technologyItems = getProspectEmploymentTechnologyResult;
    //                             i++;
    //                             if (i / 2 == prospectEmploymentResult.length) {
    //                                 setTimeout(() => {
    //                                     resolve(prospectEmploymentResult);
    //                                 }, 100);
    //                             }
    //                         })
    //                     });
    //                 }

    //                 resolve(prospectEmploymentResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }
    // getProspectEmploymentDuty(id: Guid): Promise<ProspectEmploymentDuty[]> {
    //     var promise = new Promise<ProspectEmploymentDuty[]>((resolve) => {
    //         try {
    //             this.apiService.getData('prospectEmploymentDuty', id).subscribe((prospectEmploymentDutyResult: ProspectEmploymentDuty[]) => {
    //                 resolve(prospectEmploymentDutyResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }
    // getProspectEmploymentTechnology(id: Guid): Promise<ProspectEmploymentTechnology[]> {
    //     var promise = new Promise<ProspectEmploymentTechnology[]>((resolve) => {
    //         try {
    //             this.apiService.getData('prospectEmploymentTechnology', id).subscribe((prospectEmploymentTechnologyResult: ProspectEmploymentTechnology[]) => {
    //                 resolve(prospectEmploymentTechnologyResult);
    //             });
    //         } catch (exception) {
    //             resolve([]);
    //         }
    //     });
    //     return promise;
    // }

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
    /*
getProspect(id: Guid): Promise<boolean> {
var promise = new Promise<boolean>((resolve) => {
try {
this.apiService.getData('prospects', id).subscribe((prospectResult: Prospect[]) => {
this.prospectItems = prospectResult;
});
resolve(true);
} catch (exception) {
resolve(false);
}
});
return promise;
}
*/