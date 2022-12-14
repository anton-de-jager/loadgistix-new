import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'app/modules/admin/services/api.service';
import { Subject } from 'rxjs';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { Guid } from 'guid-typescript';
import { DateBilling } from 'app/modules/admin/models/dateBilling.model';
import { status } from 'app/modules/admin/models/status.model';
import { ClientNote } from 'app/modules/admin/models/clientNote.model';
import { user } from 'app/modules/admin/models/user.model';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
    selector: 'dialog-client',
    templateUrl: 'dialog-client.component.html'
})
export class DialogClientComponent {
    user: user;
    splashScreen: FuseSplashScreenService
    loading: boolean = true;

    form: FormGroup;
    formErrors: any;
    formValid: boolean;
    private _unsubscribeAll: Subject<any>;
    formData: any;

    statusItems: status[] = [];
    dateBillingItems: DateBilling[] = [];

    clientId: Guid;
    prospectId: Guid;
    noteItems: ClientNote[];
    formNote: FormGroup;

    constructor(
        splashScreen: FuseSplashScreenService,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogClientComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private fuseSplashScreenService: FuseSplashScreenService,
        private fuseConfirmationService: FuseConfirmationService
    ) {
        this.user = JSON.parse(localStorage.getItem('user'));

        this.splashScreen = splashScreen;
        this.formErrors = data.formErrors;
        this.formData = data;
        this.clientId = data.id;
        this.prospectId = data.prospectId;

        this.dateBillingItems = data.dateBillingItems;
        this.statusItems = data.statusItems;

        this.formNote = this._formBuilder.group({
            content: ''
        });

        this.splashScreen.show();
        if (data.title === 'Update') {
            this.getNotes(this.clientId).then(getNotesResult => {
                this.noteItems = getNotesResult;
                this.splashScreen.hide();
            });
        } else {
            this.splashScreen.hide();
        }

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.form = this.data.form;
        this.formValid = false;

        this.loading = false;
    }

    getNotes(clientId: Guid): Promise<ClientNote[]> {
        var promise = new Promise<ClientNote[]>((resolve) => {
            try {
                this.apiService.post('clientNotes', clientId.toString(), null).subscribe({
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
                resolve([]);
            }
        });
        return promise;
    }

    addNote() {
        this.splashScreen.show();
        this.apiService.post('clientNotes', null, { clientId: this.clientId, note: this.formNote.controls['content'].value }).subscribe((clientNoteInsertResult: any[]) => {
            this.getNotes(this.clientId).then(getNotesResult => {
                this.noteItems = getNotesResult;
                this.splashScreen.hide();
            });
        });
        this.formNote.controls['content'].setValue('');
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.complete();
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        this.dialogRef.close();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}