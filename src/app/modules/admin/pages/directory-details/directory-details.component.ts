import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { ApiService } from 'app/modules/admin/services/api.service';
import { bid } from 'app/modules/admin/models/bid.model';
import { driver } from 'app/modules/admin/models/driver.model';
import { load } from 'app/modules/admin/models/load.model';
import { vehicle } from 'app/modules/admin/models/vehicle.model';
import { status } from 'app/modules/admin/models/status.model';
import { Guid } from 'guid-typescript';
import { first, Subject, takeUntil } from 'rxjs';
import { DialogBidComponent } from 'app/modules/admin/dialogs/dialog-bid/dialog-bid.component';
import { StarRatingColor } from '../../controls/star-rating/star-rating.component';
import { VariableService } from 'app/shared/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { directory } from '../../models/directory.model';
import { DialogDirectoryDetailComponent } from '../../dialogs/dialog-directory-detail/dialog-directory-detail.component';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { environment } from 'environments/environment';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
//import {promises as fs} from 'fs';

export interface Section {
    name: string;
    count: number;
}

@Component({
    selector: 'directory-details',
    templateUrl: './directory-details.component.html',
    styleUrls: ['./directory-details.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DirectoryDetailsComponent implements OnInit {
    timestamp: number = 0;
    imagesFolder = environment.api + 'Images/';
    loading: boolean = true;
    directoryItems: directory[] = [];
    id: Guid;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    screenSize: number = window.innerWidth;
    directoryCategoryDescription: string = '';
    userId: string = localStorage.getItem('userId');
    isScreenSmall: boolean;
    navigation: FuseNavigationItem[] = [
        // {
        //     id: 'home',
        //     title: 'Home',
        //     type: 'basic',
        //     icon: 'heroicons_outline:home',
        //     link: '/home'
        // },
        {
            id: 'business-directory',
            title: 'Business Directory',
            type: 'basic',
            icon: 'heroicons_outline:chart-pie',
            link: '/business-directory'
        }
    ];
    native: string = '';

    constructor(
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        public variableService: VariableService,
        private _router: Router,
        private _fuseNavigationService: FuseNavigationService,
        private fuseSplashScreenService: FuseSplashScreenService,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {
        this.timestamp = new Date().getTime();
        this.fuseSplashScreenService.show(); this.loading = true;
        this.native = Capacitor.isNativePlatform() ? 'White' : '';
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenSize = window.innerWidth;
    }

    ngOnInit(): void {
        this.route.queryParams
            .subscribe(params => {
                this.id = params.id;
                if (this.id) {
                    this.getDirectories().then(getDirectoriesResult => {
                        if (getDirectoriesResult.length > 0) {
                            this.directoryItems = getDirectoriesResult;
                            this.directoryCategoryDescription = this.directoryItems[0].directoryCategoryDescription;
                            this.variableService.setPageSelected('Directory Details');
                            this.fuseSplashScreenService.hide(); this.loading = false;
                        } else {
                            this._router.navigate(['/business-directory']);
                        }
                    });
                } else {

                }
            });
            // Subscribe to media changes
            this._fuseMediaWatcherService.onMediaChange$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(({matchingAliases}) => {
    
                    // Check if the screen is small
                    this.isScreenSmall = !matchingAliases.includes('md');
                });
    }

    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    getDirectories(): Promise<directory[]> {
        var promise = new Promise<directory[]>((resolve) => {
            try {
                this.apiService.post('directories', 'category', this.id).subscribe({
                    next: (apiResult: any) => {
                        //console.log(apiResult);
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

    showItem(item) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            directoryItem: item
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogDirectoryDetailComponent,
            dialogConfig);
    }

    getAddressSubstring(str: string, char: string) {
        let arr = str.split(char);
        return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
    }

    navigateExternal(event:Event, url) {
        event.preventDefault();
        if (Capacitor.isNativePlatform) {
            Browser.open({ url });
        }else{
            window.open(url, '_blank');
        }
    }
}
