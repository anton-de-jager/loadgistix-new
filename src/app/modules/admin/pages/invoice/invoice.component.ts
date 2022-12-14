import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { Invoice } from 'app/modules/admin/models/invoice.model';
import { DateBilling } from 'app/modules/admin/models/dateBilling.model';
import { ApiService } from 'app/modules/admin/services/api.service';
import { Guid } from 'guid-typescript';
import { DialogInvoiceComponent } from '../../dialogs/invoice/dialog-invoice.component';
import { environment } from 'environments/environment';
import { InvoiceItem } from 'app/modules/admin/models/invoiceItem.model';
import { VariableService } from 'app/shared/variable.service';

@Component({
    selector: 'invoice',
    templateUrl: './invoice.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AdminInvoiceComponent implements OnInit {
    imagesFolder = environment.api + 'Images/';
    splashScreen: FuseSplashScreenService

    displayedColumns: string[] = ['cud', 'descriptionClient', 'invoiceDate', 'invoiceNumber', 'totalRegular', 'totalOvertime', 'dueDate', 'view'];
    dataSource: MatTableDataSource<Invoice>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    form: FormGroup;

    dateBillingItems: DateBilling[] = [];

    constructor(
        splashScreen: FuseSplashScreenService,
        private apiService: ApiService,
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        public variableService: VariableService
    ) {
        this.splashScreen = splashScreen;
        this.splashScreen.show();
        this.getDateBilling().then(getDateBillingResult => {
            this.dateBillingItems = getDateBillingResult;
        });
        this.getInvoice(Guid.createEmpty()).then(getInvoiceResult => {
            this.dataSource = new MatTableDataSource(getInvoiceResult);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.variableService.pageSelected = 'Invoices';
            this.splashScreen.hide();
        });
    }

    ngOnInit(): void {
    }

    getInvoice(id: Guid): Promise<Invoice[]> {
        var promise = new Promise<Invoice[]>((resolve) => {
            try {
                this.apiService.getData('invoice', id).subscribe((invoiceResult: Invoice[]) => {
                    resolve(invoiceResult);
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    getDateBilling(): Promise<DateBilling[]> {
        var promise = new Promise<DateBilling[]>((resolve) => {
            try {
                this.apiService.getData('dateBilling', Guid.createEmpty()).subscribe((dateBillingResult: DateBilling[]) => {
                    resolve(dateBillingResult);
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
        this.splashScreen.show();
        this.form = this._formBuilder.group({
            id: [row == null ? Guid.create() : row.id],
            clientId: [row == null ? null : row.clientId, Validators.required],
            invoiceNumber: [row == null ? null : row.invoiceNumber, Validators.required],
            poNumber: [row == null ? null : row.poNumber],
            invoiceDate: [row == null ? null : row.invoiceDate, Validators.required],
            dueDate: [row == null ? null : row.dueDate, Validators.required]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            dateBillingItems: this.dateBillingItems,
            item: row,
            form: this.form,
            title: row == null ? 'Insert' : 'Update'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "100%";

        const dialogRef = this.dialog.open(DialogInvoiceComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                this.splashScreen.show();
                if (row == null) {
                    //insert invoice
                    this.apiService.insertItem('invoice', result.form).subscribe((invoiceInsertResult: any[]) => {
                        if (result.timesheetItemsSelected.length === 0) {
                            this.getInvoice(Guid.createEmpty()).then(getInvoiceResult => {
                                this.dataSource = new MatTableDataSource(getInvoiceResult);
                                this.dataSource.paginator = this.paginator;
                                this.dataSource.sort = this.sort;
                                this.splashScreen.hide();
                            });
                        } else {
                            let i = 0;
                            result.timesheetItemsSelected.forEach((timesheetGuid: Guid) => {
                                setTimeout(() => {
                                    i++;
                                    this.apiService.insertItem('InvoiceItem', new InvoiceItem(Guid.createEmpty(), result.form.id, timesheetGuid)).subscribe((InvoiceItemInsertResult: any[]) => {
                                    });
                                    if (i === result.timesheetItemsSelected.length) {
                                        setTimeout(() => {
                                            this.getInvoice(Guid.createEmpty()).then(getInvoiceResult => {
                                                this.dataSource = new MatTableDataSource(getInvoiceResult);
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
                    this.apiService.updatItem('invoice', result.form).subscribe(invoiceUpdateResult => {
                        if (result.timesheetItemsSelected.length === 0) {
                            this.getInvoice(Guid.createEmpty()).then(getInvoiceResult => {
                                this.dataSource = new MatTableDataSource(getInvoiceResult);
                                this.dataSource.paginator = this.paginator;
                                this.dataSource.sort = this.sort;
                                this.splashScreen.hide();
                            });
                        } else {
                            let i = 0;
                            result.timesheetItemsSelected.forEach((timesheetGuid: Guid) => {
                                setTimeout(() => {
                                    i++;
                                    this.apiService.insertItem('InvoiceItem', new InvoiceItem(Guid.createEmpty(), result.form.id, timesheetGuid)).subscribe((InvoiceItemInsertResult: any[]) => {
                                    });
                                    if (i === result.timesheetItemsSelected.length) {
                                        setTimeout(() => {
                                            this.getInvoice(Guid.createEmpty()).then(getInvoiceResult => {
                                                this.dataSource = new MatTableDataSource(getInvoiceResult);
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
            this.apiService.deleteItem('invoice', row).subscribe(invoiceDeleteResult => {
                this.getInvoice(Guid.createEmpty()).then(getInvoiceResult => {
                    this.dataSource = new MatTableDataSource(getInvoiceResult);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.splashScreen.hide();
                });
            });
        }
    }

    initView(row) {
        window.open(environment.urlShort + 'invoice?id=' + row.id, "_blank");
    }
}