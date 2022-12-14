import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
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
import { Subject } from 'rxjs';

@Component({
    selector: 'dialog-cv',
    templateUrl: 'dialog-cv.component.html'
})
export class DialogCvComponent {
    id: Guid = Guid.createEmpty();
    prospect: Prospect;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogCvComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private _formBuilder: FormBuilder,
        splashScreen: FuseSplashScreenService
    ) {
        this.id = data.id;
        splashScreen.show();
        this.apiService.getData('prospect', this.id).subscribe((prospectResult: Prospect[]) => {
            this.prospect = prospectResult[0];
            if (this.prospect) {
                this.apiService.getData('prospectLanguage', this.prospect.id).subscribe((prospectLanguageResult: ProspectLanguage[]) => {
                    this.prospect.languageItems = prospectLanguageResult;
                });
                this.apiService.getData('prospectSubject', this.prospect.id).subscribe((prospectSubjectResult: ProspectSubject[]) => {
                    this.prospect.subjectItems = prospectSubjectResult;
                });
                this.apiService.getData('prospectTertiary', this.prospect.id).subscribe((prospectTertiaryResult: ProspectTertiary[]) => {
                    this.prospect.tertiaryItems = prospectTertiaryResult;
                });
                this.apiService.getData('prospectEmployment', this.prospect.id).subscribe((prospectEmploymentResult: ProspectEmployment[]) => {
                    this.prospect.employmentItems = prospectEmploymentResult;
                    this.prospect.employmentItems.forEach(employmentHistoryItem => {
                        this.apiService.getData('prospectEmploymentDuty', employmentHistoryItem.id).subscribe((prospectEmploymentDutyResult: ProspectEmploymentDuty[]) => {
                            employmentHistoryItem.dutyItems = prospectEmploymentDutyResult;
                        });
                        this.apiService.getData('prospectEmploymentTechnology', employmentHistoryItem.id).subscribe((prospectEmploymentTechnologyResult: ProspectEmploymentTechnology[]) => {
                            employmentHistoryItem.technologyItems = prospectEmploymentTechnologyResult;
                        });
                    });
                });
            }
        });
        setTimeout(() => {
            splashScreen.hide();
        }, 2000);
    }

    ngOnInit(): void {
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        // var printContents = document.getElementById('divPrint').innerHTML;
        // var originalContents = document.body.innerHTML;
        // document.body.innerHTML = printContents;
        // window.print();
        // document.body.innerHTML = originalContents;
        // this.dialogRef.close(false);

        // var divToPrint = document.getElementById('divPrint');
        // var newWin = window.open('http://localhost:4200/documents/cv', 'Print-Window', 'width=1200,height=700');
        // newWin.document.open();
        // newWin.document.title = this.prospect.surname + ', ' + this.prospect.name;
        // newWin.document.close();
        // setTimeout(function () {
        //     newWin.close();
        // }, 10);
    }

}