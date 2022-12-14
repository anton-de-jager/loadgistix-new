import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'app/modules/admin/services/api.service';
import { Subject } from 'rxjs';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { Guid } from 'guid-typescript';
import { Client } from 'app/modules/admin/models/client.model';
import { Prospect } from 'app/modules/admin/models/prospect.model';

@Component({
    selector: 'dialog-sow',
    templateUrl: 'dialog-sow.component.html'
})
export class DialogSowComponent {
    splashScreen: FuseSplashScreenService
    loading: boolean = true;

    form: FormGroup;
    formErrors: any;
    formValid: boolean;
    private _unsubscribeAll: Subject<any>;
    formData: any;

    clientItems: Client[];
    prospectItems: Prospect[];

    constructor(
        splashScreen: FuseSplashScreenService,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogSowComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private _formBuilder: FormBuilder
    ) {
        this.splashScreen = splashScreen;
        this.splashScreen.show();
        this.getClient(Guid.createEmpty()).then(getClientResult => {
            this.clientItems = getClientResult;
            this.getProspect(Guid.createEmpty()).then(getProspectResult => {
                this.prospectItems = getProspectResult;

                this.formErrors = data.formErrors;
                this.formData = data;

                this._unsubscribeAll = new Subject();

                this.splashScreen.hide();
            });
        });
    }

    ngOnInit(): void {
        this.form = this.data.form;
        this.formValid = false;

        this.loading = false;
    }


    getClient(id: Guid): Promise<Client[]> {
        var promise = new Promise<Client[]>((resolve) => {
            try {
                this.apiService.getData('client', id).subscribe((clientResult: Client[]) => {
                    resolve(clientResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    getProspect(id: Guid): Promise<Prospect[]> {
        var promise = new Promise<Prospect[]>((resolve) => {
            try {
                this.apiService.getData('prospect', id).subscribe((prospectResult: Prospect[]) => {
                    resolve(prospectResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
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
}