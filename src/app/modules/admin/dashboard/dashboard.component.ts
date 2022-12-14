import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { VariableService } from 'app/shared/variable.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { DashboardService } from 'app/modules/admin/dashboard/dashboard.service';
import { ApiService } from '../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { dashboard } from '../models/dashboard.model';
import { environment } from 'environments/environment';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
    timestamp: number = 0;
    imagesFolder = environment.api + 'Images/';
    viewsAdvert: number;
    viewsBusinessDirectory: number;
    totalBids: number;
    totalBidsDelivered: number;
    totalBidsDeliveredLoad: number;
    totalBidsDeliveredVehicle: number;
    reviews: any[];

    // chartReview: ApexOptions = {};
    // chartTaskDistribution: ApexOptions = {};
    // chartBudgetDistribution: ApexOptions = {};
    // chartWeeklyExpenses: ApexOptions = {};
    // chartMonthlyExpenses: ApexOptions = {};
    // chartYearlyExpenses: ApexOptions = {};
    // data: any;
    // selectedProject: string = 'ACME Corp. Backend App';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    loading: boolean = true;
    user: any = JSON.parse(localStorage.getItem('user'));
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        public variableService: VariableService,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        private fuseSplashScreenService: FuseSplashScreenService,
        private _dashboardService: DashboardService) {
        this.timestamp = new Date().getTime();

        this.getDashboard().then(result => {
            //console.log(result);
            this.viewsAdvert = 0;
            this.viewsBusinessDirectory = 0;
            this.totalBids = 0;
            this.totalBidsDelivered = 0;
            this.totalBidsDeliveredLoad = 0;
            this.totalBidsDeliveredVehicle = 0;
            this.reviews = [];
            result.forEach(element => {
                switch (element.category) {
                    case 'Adverts':
                        this.viewsAdvert = this.viewsAdvert + 1;
                        break;
                    case 'Business Directory':
                        this.viewsBusinessDirectory = this.viewsBusinessDirectory + 1;
                        break;
                    case 'Loads':
                        this.totalBidsDelivered = this.totalBidsDelivered + 1;
                        if (element.description == 'Load') {
                            this.totalBidsDeliveredLoad = this.totalBidsDeliveredLoad + 1;
                        }
                        if (element.description == 'Driver') {
                            this.totalBidsDeliveredVehicle = this.totalBidsDeliveredVehicle + 1;
                        }
                        break;
                    case 'Review':
                        this.reviews.push(element);
                        if (element.description == 'Load') {

                        }
                        if (element.description == 'Driver') {

                        }
                        //this.viewsBusinessDirectory++;
                        break;
                    case 'Bids':
                        this.totalBids = this.totalBids + 1;
                        break;
                    default:
                        break;
                }
            });
        });

        // Get the data
        // this._dashboardService.data$
        //     .pipe()
        //     .subscribe((data) => {
        //         console.log(data);
        //         // Store the data
        //         this.data = data;

        //         // Prepare the chart data
        //         //this._prepareChartData();
        //     });

        // // Attach SVG fill fixer to all ApexCharts
        // window['Apex'] = {
        //     chart: {
        //         events: {
        //             mounted: (chart: any, options?: any): void => {
        //                 this._fixSvgFill(chart.el);
        //             },
        //             updated: (chart: any, options?: any): void => {
        //                 this._fixSvgFill(chart.el);
        //             }
        //         }
        //     }
        // };
    }

    ngOnInit(): void {

        setTimeout(() => {
            //this._prepareChartData();
            this.variableService.setPageSelected('Dashboard');
            this.loading = false;
        }, 1000);
    }

    navigate(str){
        console.log(str);
        this._router.navigateByUrl(str);
    }

    getDashboard(): Promise<dashboard[]> {
        var promise = new Promise<dashboard[]>((resolve) => {
            try {
                this.apiService.get('dashboard').subscribe({
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill');
                el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
            });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    // private _prepareChartData(): void {
    //     // this.data.githubIssues.labels = [];
    //     // this.data.githubIssues.labels.push(new Date(new Date().setDate(new Date().getDate()-6)));
    //     // this.data.githubIssues.labels.push(new Date(new Date().setDate(new Date().getDate()-5)));
    //     // this.data.githubIssues.labels.push(new Date(new Date().setDate(new Date().getDate()-4)));
    //     // this.data.githubIssues.labels.push(new Date(new Date().setDate(new Date().getDate()-3)));
    //     // this.data.githubIssues.labels.push(new Date(new Date().setDate(new Date().getDate()-2)));
    //     // this.data.githubIssues.labels.push(new Date(new Date().setDate(new Date().getDate()-1)));
    //     // this.data.githubIssues.labels.push(new Date());
    //     // this.data.githubIssues.series['last-week'][0].name = 'Reviews';
    //     // this.data.githubIssues.series['last-week'][0].data = [];
    //     // this.data.githubIssues.series['last-week'][0].data.push(this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate()-6))).length);
    //     // this.data.githubIssues.series['last-week'][0].data.push(this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate()-5))).length);
    //     // this.data.githubIssues.series['last-week'][0].data.push(this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate()-4))).length);
    //     // this.data.githubIssues.series['last-week'][0].data.push(this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate()-3))).length);
    //     // this.data.githubIssues.series['last-week'][0].data.push(this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate()-2))).length);
    //     // this.data.githubIssues.series['last-week'][0].data.push(this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate()-1))).length);
    //     // this.data.githubIssues.series['last-week'][0].data.push(this.reviews.filter(x => x.date == new Date()).length);

    //     // this.data.githubIssues.series['last-week'][1].name = 'Reviews';
    //     // this.data.githubIssues.series['last-week'][1].data = [];
    //     // this.data.githubIssues.series['last-week'][1].data.push(this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate()-6))).length);
    //     // this.data.githubIssues.series['last-week'][1].data.push(this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate()-5))).length);
    //     // this.data.githubIssues.series['last-week'][1].data.push(this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate()-4))).length);
    //     // this.data.githubIssues.series['last-week'][1].data.push(this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate()-3))).length);
    //     // this.data.githubIssues.series['last-week'][1].data.push(this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate()-2))).length);
    //     // this.data.githubIssues.series['last-week'][1].data.push(this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate()-1))).length);
    //     // this.data.githubIssues.series['last-week'][1].data.push(this.reviews.filter(x => x.date == new Date()).length);

    //     // this.chartReview = {
    //     //     series: [
    //     //         {
    //     //             name: "Desktops",
    //     //             data: [
    //     //                 this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate() - 6))).length,
    //     //                 this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate() - 5))).length,
    //     //                 this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate() - 4))).length,
    //     //                 this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate() - 3))).length,
    //     //                 this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate() - 2))).length,
    //     //                 this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate() - 1))).length,
    //     //                 this.reviews.filter(x => x.date == new Date(new Date().setDate(new Date().getDate() - 0))).length
    //     //             ]
    //     //         }
    //     //     ],
    //     //     chart: {
    //     //         height: 350,
    //     //         type: "line",
    //     //         zoom: {
    //     //             enabled: false
    //     //         }
    //     //     },
    //     //     dataLabels: {
    //     //         enabled: false
    //     //     },
    //     //     stroke: {
    //     //         curve: "straight"
    //     //     },
    //     //     title: {
    //     //         text: "Reviews",
    //     //         align: "left"
    //     //     },
    //     //     grid: {
    //     //         row: {
    //     //             colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
    //     //             opacity: 0.5
    //     //         }
    //     //     },
    //     //     xaxis: {
    //     //         categories: [
    //     //             new Date(new Date().setDate(new Date().getDate() - 6)),
    //     //             new Date(new Date().setDate(new Date().getDate() - 5)),
    //     //             new Date(new Date().setDate(new Date().getDate() - 4)),
    //     //             new Date(new Date().setDate(new Date().getDate() - 3)),
    //     //             new Date(new Date().setDate(new Date().getDate() - 2)),
    //     //             new Date(new Date().setDate(new Date().getDate() - 1)),
    //     //             new Date()
    //     //         ]
    //     //     }
    //     // };
    // }
}