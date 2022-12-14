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
import { directoryCategory } from '../../models/directoryCategory.model';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
//import {promises as fs} from 'fs';

export interface Section {
    name: string;
    count: number;
}

@Component({
    selector: 'business-directory',
    templateUrl: './business-directory.component.html',
    styleUrls: ['./business-directory.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BusinessDirectoryComponent implements OnInit {
    loading: boolean = true;
    directoryCategoryList: directoryCategory[];
    isScreenSmall: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    userId: string = localStorage.getItem('userId');
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
    ]

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
}
