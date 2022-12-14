import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';

import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';

import { NgApexchartsModule } from 'ng-apexcharts';

import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import {
    NgxMatDateFormats,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    NGX_MAT_DATE_FORMATS
} from '@angular-material-components/datetime-picker';

import { WebcamModule } from 'ngx-webcam';

import { MapComponent } from 'app/modules/admin/controls/map/map.component';
import { StarRatingComponent } from 'app/modules/admin/controls/star-rating/star-rating.component';
import { AdvertComponent } from 'app/modules/admin/controls/advert/advert.component';

import { ApiService } from 'app/modules/admin/services/api.service';

import { DialogAddressComponent } from 'app/modules/admin/dialogs/dialog-address/dialog-address.component';
import { DialogDriverComponent } from 'app/modules/admin/dialogs/dialog-driver/dialog-driver.component';
import { DialogVehicleComponent } from 'app/modules/admin/dialogs/dialog-vehicle/dialog-vehicle.component';
import { DialogLoadComponent } from 'app/modules/admin/dialogs/dialog-load/dialog-load.component';
import { DialogReviewComponent } from 'app/modules/admin/dialogs/dialog-review/dialog-review.component';
import { DialogLoadDetailsComponent } from 'app/modules/admin/dialogs/dialog-load-details/dialog-load-details.component';
import { DialogBidComponent } from 'app/modules/admin/dialogs/dialog-bid/dialog-bid.component';
import { DialogBidListComponent } from 'app/modules/admin/dialogs/dialog-bid-list/dialog-bid-list.component';
import { DialogAdvertComponent } from 'app/modules/admin/dialogs/dialog-advert/dialog-advert.component';
import { DialogDirectoryComponent } from 'app/modules/admin/dialogs/dialog-directory/dialog-directory.component';
import { DialogCameraComponent } from 'app/modules/admin/dialogs/dialog-camera/dialog-camera.component';
import { MatRippleModule } from '@angular/material/core';
import { TranslocoModule } from '@ngneat/transloco';
import { DialogVehicleCategoryComponent } from 'app/modules/admin/dialogs/dialog-vehicleCategory/dialog-vehicleCategory.component';
import { DialogVehicleTypeComponent } from 'app/modules/admin/dialogs/dialog-vehicleType/dialog-vehicleType.component';
import { DialogLoadCategoryComponent } from 'app/modules/admin/dialogs/dialog-loadCategory/dialog-loadCategory.component';
import { DialogLoadTypeComponent } from 'app/modules/admin/dialogs/dialog-loadType/dialog-loadType.component';
import { FuseCardModule } from '@fuse/components/card';
import { DialogTcComponent } from 'app/modules/admin/dialogs/dialog-tc/dialog-tc.component';
import { DialogDirectoryDetailComponent } from 'app/modules/admin/dialogs/dialog-directory-detail/dialog-directory-detail.component';

import { DialogClientComponent } from 'app/modules/admin/dialogs/client/dialog-client.component';
import { DialogProspectComponent } from 'app/modules/admin/dialogs/prospect/dialog-prospect.component';
import { DialogSowComponent } from 'app/modules/admin/dialogs/sow/dialog-sow.component';
import { DialogTimesheetComponent } from 'app/modules/admin/dialogs/timesheet/dialog-timesheet.component';
import { DialogInvoiceComponent } from 'app/modules/admin/dialogs/invoice/dialog-invoice.component';
import { DialogProspectLanguageComponent } from 'app/modules/admin/dialogs/prospectLanguage/dialog-prospectLanguage.component';
import { DialogProspectSubjectComponent } from 'app/modules/admin/dialogs/prospectSubject/dialog-prospectSubject.component';
import { DialogProspectTertiaryComponent } from 'app/modules/admin/dialogs/prospectTertiary/dialog-prospectTertiary.component';
import { DialogProspectEmploymentComponent } from 'app/modules/admin/dialogs/prospectEmployment/dialog-prospectEmployment.component';
import { DialogProspectEmploymentDutyComponent } from 'app/modules/admin/dialogs/prospectEmploymentDuty/dialog-prospectEmploymentDuty.component';
import { DialogProspectEmploymentTechnologyComponent } from 'app/modules/admin/dialogs/prospectEmploymentTechnology/dialog-prospectEmploymentTechnology.component';
import { DialogCvComponent } from 'app/modules/admin/dialogs/cv/dialog-cv.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { DialogPaypalComponent } from 'app/modules/admin/dialogs/dialog-paypal/dialog-paypal.component';
import { PlanBillingComponent } from 'app/modules/admin/controls/plan-billing/plan-billing.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { DialogInsuranceComponent } from 'app/modules/landing/dialog-insurance/dialog-insurance.component';
// import * as moment from 'moment';

// const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
//     parse: {
//         dateInput: "yyyy/mm/dd HH:mm"
//     },
//     display: {
//         dateInput: "l, LTS",
//         monthYearLabel: "MMM YYYY",
//         dateA11yLabel: "LL",
//         monthYearA11yLabel: "MMMM YYYY"
//     }
// };

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        FuseSplashScreenModule,
        FuseCardModule,
        FuseAlertModule,

        MatMomentDateModule,

        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatChipsModule,
        MatDatepickerModule,
        MatSlideToggleModule,
        MatCardModule,
        MatDividerModule,
        MatInputModule,
        MatListModule,
        MatBadgeModule,
        MatGridListModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatRadioModule,
        MatTooltipModule,
        MatSidenavModule,
        MatSelectModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatTabsModule,
        MatExpansionModule,
        MatSnackBarModule,
        MatStepperModule,
        MatRippleModule,
        TranslocoModule,

        NgApexchartsModule,

        NgxMatFileInputModule,
        NgxMatTimepickerModule,
        NgxMatDatetimePickerModule,
        NgxMatNativeDateModule,

        WebcamModule,

        GoogleMapsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        MatMomentDateModule,

        FuseSplashScreenModule,
        FuseCardModule,
        FuseAlertModule,

        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatChipsModule,
        MatDatepickerModule,
        MatSlideToggleModule,
        MatCardModule,
        MatDividerModule,
        MatInputModule,
        MatListModule,
        MatBadgeModule,
        MatGridListModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatRadioModule,
        MatTooltipModule,
        MatSidenavModule,
        MatSelectModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatTabsModule,
        MatExpansionModule,
        MatSnackBarModule,
        MatStepperModule,
        MatRippleModule,
        TranslocoModule,

        NgApexchartsModule,

        NgxMatFileInputModule,
        NgxMatTimepickerModule,
        NgxMatDatetimePickerModule,
        NgxMatNativeDateModule,

        WebcamModule,

        MapComponent,
        StarRatingComponent,
        AdvertComponent,

        GoogleMapsModule
    ],
    declarations: [
        DialogTcComponent,
        DialogAddressComponent,
        DialogDriverComponent,
        DialogVehicleComponent,
        DialogVehicleCategoryComponent,
        DialogVehicleTypeComponent,
        DialogLoadComponent,
        DialogLoadCategoryComponent,
        DialogLoadTypeComponent,
        DialogReviewComponent,
        DialogLoadDetailsComponent,
        DialogBidComponent,
        DialogBidListComponent,
        DialogAdvertComponent,
        DialogDirectoryComponent,
        DialogDirectoryDetailComponent,
        DialogCameraComponent,
        DialogInsuranceComponent,
        MapComponent,
        StarRatingComponent,
        AdvertComponent,

        DialogClientComponent,
        DialogProspectComponent,
        DialogSowComponent,
        DialogTimesheetComponent,
        DialogInvoiceComponent,
        DialogProspectLanguageComponent,
        DialogProspectSubjectComponent,
        DialogProspectTertiaryComponent,
        DialogProspectEmploymentComponent,
        DialogProspectEmploymentDutyComponent,
        DialogProspectEmploymentTechnologyComponent,
        DialogCvComponent,
        DialogPaypalComponent,
        PlanBillingComponent
    ],
    entryComponents: [
        DialogTcComponent,
        DialogAddressComponent,
        DialogDriverComponent,
        DialogVehicleComponent,
        DialogVehicleCategoryComponent,
        DialogVehicleTypeComponent,
        DialogLoadComponent,
        DialogLoadCategoryComponent,
        DialogLoadTypeComponent,
        DialogReviewComponent,
        DialogLoadDetailsComponent,
        DialogBidComponent,
        DialogBidListComponent,
        DialogAdvertComponent,
        DialogDirectoryComponent,
        DialogDirectoryDetailComponent,
        DialogCameraComponent,
        DialogInsuranceComponent,

        DialogClientComponent,
        DialogProspectComponent,
        DialogSowComponent,
        DialogTimesheetComponent,
        DialogInvoiceComponent,
        DialogProspectLanguageComponent,
        DialogProspectSubjectComponent,
        DialogProspectTertiaryComponent,
        DialogProspectEmploymentComponent,
        DialogProspectEmploymentDutyComponent,
        DialogProspectEmploymentTechnologyComponent,
        DialogCvComponent,
        DialogPaypalComponent,
        PlanBillingComponent
    ],
    providers: [
        ApiService,
        // { provide: 'moment', useValue: moment },
        // { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
    ]
})
export class SharedModule {
}
