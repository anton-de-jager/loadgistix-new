import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { ApiService } from 'app/modules/admin/services/api.service';
import { directory } from 'app/modules/admin/models/directory.model';
import { VariableService } from 'app/shared/variable.service';
import { Router } from '@angular/router';
import { Navigation } from 'app/core/navigation/navigation.types';
import { directoryCategory } from 'app/modules/admin/models/directoryCategory.model';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
//import {promises as fs} from 'fs';

export interface Section {
    name: string;
    count: number;
}

@Component({
    selector: 'businessDirectory',
    templateUrl: './businessDirectory.component.html',
    styleUrls: ['./businessDirectory.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BusinessDirectoryOpenComponent implements OnInit {
    loading: boolean = true;
    directoryCategoryList: directoryCategory[];
    directoryCategoryListOriginal: directoryCategory[];
    isScreenSmall: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    userId: string = localStorage.getItem('userId');
    navigation: Navigation;
    navigationAppearance: 'default' | 'dense' = 'dense';
    native: string = '';

    constructor(
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
        this.fuseSplashScreenService.show(); this.loading = true;
        console.log(this.userId);
        this.native = Capacitor.isNativePlatform() ? 'White' : '';
    }

    ngOnInit(): void {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

        this.getDirectoryCategories().then(getDirectoryCategoriesResult => {
            this.variableService.setPageSelected('Business Directory');
            this.directoryCategoryListOriginal = JSON.parse(JSON.stringify(getDirectoryCategoriesResult));
            this.directoryCategoryList = getDirectoryCategoriesResult;
            this.fuseSplashScreenService.hide(); this.loading = false;
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
    
    /**
     * Getter for current year
     */
     get currentYear(): number
     {
         return new Date().getFullYear();
     }

    getDirectoryCategories(): Promise<directoryCategory[]> {
        var promise = new Promise<directoryCategory[]>((resolve) => {
            try {
                this.apiService.post('directoryCategories', 'available', null).subscribe({
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

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        console.log(filterValue);
        this.directoryCategoryList = this.directoryCategoryListOriginal.filter(x => x.description.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0);
    }

    buttonClick(str) {
        const host: string = location.origin;
        const url: string = host + '/#/' + str;
        if (Capacitor.isNativePlatform) {
            Browser.open({ url });
        }else{
            window.open(url);
        }
    }
}
