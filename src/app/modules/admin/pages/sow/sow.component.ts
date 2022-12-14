import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { UserService } from 'app/core/user/user.service';
import { SowView } from 'app/modules/admin/models/sow.view';
import { ApiService } from 'app/modules/admin/services/api.service';
import { VariableService } from 'app/shared/variable.service';
import { environment } from 'environments/environment';
import { Guid } from 'guid-typescript';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogSowComponent } from '../../dialogs/sow/dialog-sow.component';
import { user } from '../../models/user.model';

@Component({
    selector: 'sow',
    templateUrl: './sow.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AdminSowComponent implements OnInit {
    imagesFolder = environment.api + 'Images/';
    user: user;
    splashScreen: FuseSplashScreenService;

    displayedColumns: string[] = ['cud', 'descriptionClient', 'descriptionProspect', 'role', 'dateStart', 'dateEnd', 'view'];
    dataSource: MatTableDataSource<SowView>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    form: FormGroup;
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        splashScreen: FuseSplashScreenService,
        private apiService: ApiService,
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        public variableService: VariableService
    ) {
        this.splashScreen = splashScreen;
        this.splashScreen.show();
        this.getSowView(Guid.createEmpty()).then(getSowResult => {
            this.dataSource = new MatTableDataSource(getSowResult);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.variableService.pageSelected = 'Statement of Work';
            this.splashScreen.hide();
        });
    }

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: any) => {
                this.user = user;
            });
    }

    getSowView(id: Guid): Promise<SowView[]> {
        var promise = new Promise<SowView[]>((resolve) => {
            try {
                this.apiService.getView('sow', id).subscribe((sowResult: SowView[]) => {
                    resolve(sowResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }


    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    initUpsert(row) {
        this.form = this._formBuilder.group({
            id: [row == null ? null : row.id],
            clientId: [row == null ? null : row.clientId],
            prospectId: [row == null ? null : row.prospectId],
            role: [row == null ? null : row.role],
            location: [row == null ? null : row.location],
            dateStart: [row == null ? null : row.dateStart],
            dateEnd: [row == null ? null : row.dateEnd],
            hourlyRateClient: [row == null ? null : row.hourlyRateClient],
            hourlyRateProspect: [row == null ? null : row.hourlyRateProspect],
            documentNumberClient: [row == null ? null : row.documentNumberClient],
            documentNumberProspect: [row == null ? null : row.documentNumberProspect],
            dateContractClient: [row == null ? null : row.dateContractClient],
            dateContractProspect: [row == null ? null : row.dateContractProspect]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.form,
            title: row == null ? 'Insert' : 'Update'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "100%";

        const dialogRef = this.dialog.open(DialogSowComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                this.splashScreen.show();
                if (row == null) {
                    //insert sow
                    this.apiService.insertItem('sow', result).subscribe((sowInsertResult: any[]) => {
                        this.getSowView(Guid.createEmpty()).then(getSowResult => {
                            this.dataSource = new MatTableDataSource(getSowResult);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                            this.splashScreen.hide();
                        });
                    });
                } else {
                    this.apiService.updatItem('sow', result).subscribe(sowUpdateResult => {
                        this.getSowView(Guid.createEmpty()).then(getSowResult => {
                            this.dataSource = new MatTableDataSource(getSowResult);
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                            this.splashScreen.hide();
                        });
                    });
                }
            }
        });
    }
    initDelete(row) {
        if (confirm('Are you sure you want to delete item?')) {
            this.splashScreen.show();
            this.apiService.deleteItem('sow', row).subscribe(sowDeleteResult => {
                this.getSowView(Guid.createEmpty()).then(getSowResult => {
                    this.dataSource = new MatTableDataSource(getSowResult);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.splashScreen.hide();
                });
            });
        }
    }

    initViewClient(row) {
        window.open(environment.urlShort + 'sow-client?id=' + row.id, "_blank");
    }
    initViewProspect(row) {
        window.open(environment.urlShort + 'sow-prospect?id=' + row.id, "_blank");
    }
    initViewMsa(row) {
        window.open(environment.urlShort + 'msa-client?id=' + row.id, "_blank");
    }
}