import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { UserService } from 'app/core/user/user.service';
import { Client } from 'app/modules/admin/models/client.model';
import { Prospect } from 'app/modules/admin/models/prospect.model';
import { Timesheet } from 'app/modules/admin/models/timesheet.model';
import { TimesheetView } from 'app/modules/admin/models/timesheet.view';
import { ApiService } from 'app/modules/admin/services/api.service';
import { Guid } from 'guid-typescript';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogTimesheetComponent } from '../../dialogs/timesheet/dialog-timesheet.component';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { TimesheetItem } from 'app/modules/admin/models/timesheetItem.model';
import { environment } from 'environments/environment';
import { VariableService } from 'app/shared/variable.service';
import { user } from '../../models/user.model';

const moment = _rollupMoment || _moment;

@Component({
    selector: 'timesheet',
    templateUrl: './timesheet.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AdminTimesheetComponent implements OnInit {
    imagesFolder = environment.api + 'Images/';
    user: user;
    splashScreen: FuseSplashScreenService;
    prospectId: Guid;

    displayedColumns: string[] = ['cud', 'description', 'timesheetDate', 'hoursRegular', 'hoursOvertime', 'view'];
    dataSource: MatTableDataSource<Timesheet>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    form: FormGroup;

    prospectItems: Prospect[] = [];
    client: Client;

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

        this.user = JSON.parse(localStorage.getItem('user'));

        this.getProspect(this.user.userType == 'Prospect' ? this.prospectId : Guid.createEmpty()).then(getProspectResult => {
            this.prospectItems = getProspectResult;
        })
        this.getClient(Guid.createEmpty()).then(getClientResult => {
            this.client = getClientResult[0];
        })

        this.getTimesheet(this.prospectId).then(getTimesheetResult => {
            this.dataSource = new MatTableDataSource(getTimesheetResult);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.variableService.pageSelected = 'Timesheets';
            this.splashScreen.hide();
        });
    }

    ngOnInit(): void {
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

    getTimesheet(id: Guid): Promise<TimesheetView[]> {
        var promise = new Promise<TimesheetView[]>((resolve) => {
            try {
                this.apiService.getDataByUser('timesheet', id).subscribe((timesheetResult: TimesheetView[]) => {
                    resolve(timesheetResult);
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
        let newId = Guid.create();
        this.form = this._formBuilder.group({
            id: [row == null ? newId : row.id],
            prospectId: [{ value: row == null ? this.prospectId : row.prospectId, disabled: row !== null }, Validators.required],
            timesheetDate: [{ value: row == null ? moment() : moment(row.timesheetDate), disabled: row !== null }, Validators.required]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            id: row == null ? newId : row.id,
            dateBillingId: this.client.dateBillingId,
            form: this.form,
            prospectItems: this.prospectItems,
            title: row == null ? 'Insert' : 'Update'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "100%";

        const dialogRef = this.dialog.open(DialogTimesheetComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                this.splashScreen.show();
                if (row == null) {
                    this.apiService.insertItem('timesheet', result.form).subscribe((timesheetInsertResult: any[]) => {
                        if (result.timesheetItems.length === 0) {
                            this.getTimesheet(this.prospectId).then(getTimesheetResult => {
                                this.dataSource = new MatTableDataSource(getTimesheetResult);
                                this.dataSource.paginator = this.paginator;
                                this.dataSource.sort = this.sort;
                                this.splashScreen.hide();
                            });
                        } else {
                            let i = 0;
                            result.timesheetItems.forEach((timesheetItem: TimesheetItem) => {
                                timesheetItem.hoursRegular = timesheetItem.hoursRegular == null ? 0 : timesheetItem.hoursRegular;
                                timesheetItem.hoursOvertime = timesheetItem.hoursOvertime == null ? 0 : timesheetItem.hoursOvertime;
                                setTimeout(() => {
                                    i++;
                                    if (timesheetItem.description != '' || timesheetItem.hoursRegular > 0 || timesheetItem.hoursOvertime > 0) {
                                        this.apiService.insertItem('timesheetItem', timesheetItem).subscribe((timesheetItemInsertResult: any[]) => {
                                        });
                                    }
                                    if (i === result.timesheetItems.length) {
                                        setTimeout(() => {
                                            this.getTimesheet(this.prospectId).then(getTimesheetResult => {
                                                this.dataSource = new MatTableDataSource(getTimesheetResult);
                                                this.dataSource.paginator = this.paginator;
                                                this.dataSource.sort = this.sort;
                                                this.splashScreen.hide();
                                            });
                                        }, 100);
                                    }
                                }, 10);
                            });
                        }
                    });
                } else {
                    this.apiService.updatItem('timesheet', result.form).subscribe(timesheetUpdateResult => {
                        if (result.timesheetItems.length === 0) {
                            this.getTimesheet(this.prospectId).then(getTimesheetResult => {
                                this.dataSource = new MatTableDataSource(getTimesheetResult);
                                this.dataSource.paginator = this.paginator;
                                this.dataSource.sort = this.sort;
                                this.splashScreen.hide();
                            });
                        } else {
                            let i = 0;
                            result.timesheetItems.forEach((timesheetItem: TimesheetItem) => {                                
                                timesheetItem.hoursRegular = timesheetItem.hoursRegular == null ? 0 : timesheetItem.hoursRegular;
                                timesheetItem.hoursOvertime = timesheetItem.hoursOvertime == null ? 0 : timesheetItem.hoursOvertime;
                                setTimeout(() => {
                                    i++;
                                    if (timesheetItem.description != '' || timesheetItem.hoursRegular > 0 || timesheetItem.hoursOvertime > 0) {
                                        this.apiService.insertItem('timesheetItem', timesheetItem).subscribe((timesheetItemInsertResult: any[]) => {
                                        });
                                    }
                                    if (i === result.timesheetItems.length) {
                                        setTimeout(() => {
                                            this.getTimesheet(this.prospectId).then(getTimesheetResult => {
                                                this.dataSource = new MatTableDataSource(getTimesheetResult);
                                                this.dataSource.paginator = this.paginator;
                                                this.dataSource.sort = this.sort;
                                                this.splashScreen.hide();
                                            });
                                        }, 100);
                                    }
                                }, 10);
                            });
                        }
                    });
                }
            }
        });
    }
    initDelete(row) {
        if (confirm('Are you sure you want to delete item?')) {
            this.splashScreen.show();
            this.apiService.deleteItem('timesheet', row).subscribe(timesheetDeleteResult => {
                this.getTimesheet(this.prospectId).then(getTimesheetResult => {
                    this.dataSource = new MatTableDataSource(getTimesheetResult);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.splashScreen.hide();
                });
            });
        }
    }

    initView(row) {
        window.open(environment.urlShort + 'timesheet?id=' + row.id, "_blank");
    }
}