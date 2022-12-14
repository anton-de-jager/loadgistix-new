import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { Prospect } from 'app/modules/admin/models/prospect.model';
import { ProspectEmployment } from 'app/modules/admin/models/prospectEmployment.model';
import { ProspectEmploymentDuty } from 'app/modules/admin/models/prospectEmploymentDuty.model';
import { ProspectEmploymentTechnology } from 'app/modules/admin/models/prospectEmploymentTechnology.model';
import { ProspectLanguage } from 'app/modules/admin/models/prospectLanguage.model';
import { ProspectSubject } from 'app/modules/admin/models/prospectSubject.model';
import { ProspectTertiary } from 'app/modules/admin/models/prospectTertiary.model';
import { ApiService } from 'app/modules/admin/services/api.service';
import { Guid } from 'guid-typescript';


@Component({
    selector     : 'sow-prospect',
    templateUrl  : './sow-prospect.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class SowProspectComponent implements OnInit, OnDestroy
{
    prospectFullName: string;
    prospect: string;
    prospectRegNumber: string;
    prospectAddress: string;
    hourlyRate: number;
    contractorDescription: string;
    role: string;
    contactDescription: string;
    contactPhone: string;
    contactEmail: string;

    agreementNumber: string;
    contractDate: Date;
    startDate: Date;
    endDate: Date;
    contractLocation: string;

    constructor() {
        this.prospectFullName = 'MAD Products (Pty) Ltd';
        this.prospect = 'MAD Products';
        this.prospectRegNumber = '2323/4343/2323';
        this.prospectAddress = '1 Street Road, Town City, Gauteng';
        this.hourlyRate = 450;
        this.contractorDescription = 'Piet Pompies';
        this.role = 'Senior Developer';
        this.contactDescription = 'Jan Poggenpeol';
        this.contactPhone = '0116670007';
        this.contactEmail = 'jan@pog.poel';
        this.contractDate = new Date('2020/12/21');
        this.agreementNumber = 'LUNKULU/MAD2/2018';
        this.startDate = new Date('2021/01/01');
        this.endDate = new Date('2021/12/31');
        this.contractLocation = 'Remote';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
    }
}
