import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { Capacitor } from '@capacitor/core';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboard'
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    //{ path: '', pathMatch: 'full', redirectTo: 'home' },

    // Redirect signed in user to the '/dashboard'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'cv', loadChildren: () => import('app/modules/auth/cv/cv.module').then(m => m.CvModule) },
            { path: 'sow-client', loadChildren: () => import('app/modules/auth/sow-client/sow-client.module').then(m => m.SowClientModule) },
            { path: 'sow-prospect', loadChildren: () => import('app/modules/auth/sow-prospect/sow-prospect.module').then(m => m.SowProspectModule) },
            { path: 'msa-client', loadChildren: () => import('app/modules/auth/msa-client/msa-client.module').then(m => m.MsaClientModule) },
            { path: 'timesheet', loadChildren: () => import('app/modules/auth/timesheet/timesheet.module').then(m => m.TimesheetModule) },
            { path: 'invoice', loadChildren: () => import('app/modules/auth/invoice/invoice.module').then(m => m.InvoiceModule) },
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule) },
            { path: 'cancel', loadChildren: () => import('app/modules/auth/cancel/cancel.module').then(m => m.AuthCancelModule) },
            { path: 'success', loadChildren: () => import('app/modules/auth/success/success.module').then(m => m.AuthSuccessModule) },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule) }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            //{ path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
            { path: 'privacyPolicy', loadChildren: () => import('app/modules/landing/privacyPolicy/privacyPolicy.module').then(m => m.PrivacyPolicyModule) },
            { path: 'businessDirectory', loadChildren: () => import('app/modules/landing/businessDirectory/businessDirectory.module').then(m => m.BusinessDirectoryOpenModule) },
            { path: 'directoryDetails', loadChildren: () => import('app/modules/landing/directoryDetails/directoryDetails.module').then(m => m.DirectoryDetailsOpenModule) }
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: 'dashboard', loadChildren: () => import('app/modules/admin/dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'settings', loadChildren: () => import('app/modules/admin/pages/settings/settings.module').then(m => m.SettingsModule) },
            { path: 'vehicles', loadChildren: () => import('app/modules/admin/pages/vehicles/vehicles.module').then(m => m.VehiclesModule) },
            { path: 'drivers', loadChildren: () => import('app/modules/admin/pages/drivers/drivers.module').then(m => m.DriversModule) },
            { path: 'loads', loadChildren: () => import('app/modules/admin/pages/loads/loads.module').then(m => m.LoadsModule) },
            { path: 'loads-available', loadChildren: () => import('app/modules/admin/pages/loads-available/loads-available.module').then(m => m.LoadsAvailableModule) },
            { path: 'bids', loadChildren: () => import('app/modules/admin/pages/bids/bids.module').then(m => m.BidsModule) },
            { path: 'adverts', loadChildren: () => import('app/modules/admin/pages/adverts/adverts.module').then(m => m.AdvertsModule) },
            { path: 'directory', loadChildren: () => import('app/modules/admin/pages/directory/directory.module').then(m => m.DirectoryModule) },
            { path: 'directory-details', loadChildren: () => import('app/modules/admin/pages/directory-details/directory-details.module').then(m => m.DirectoryDetailsModule) },
            { path: 'business-directory', loadChildren: () => import('app/modules/admin/pages/business-directory/business-directory.module').then(m => m.BusinessDirectoryModule) },
            { path: 'lookups', loadChildren: () => import('app/modules/admin/pages/lookups/lookups.module').then(m => m.LookupsModule) },

            { path: 'payment-response', loadChildren: () => import('app/modules/admin/payment-response/payment-response.module').then(m => m.PaymentResponseModule) },

            { path: 'profile', loadChildren: () => import('app/modules/admin/pages/profile/profile.module').then(m => m.AdminProfileModule) },
            { path: 'clients', loadChildren: () => import('app/modules/admin/pages/client/client.module').then(m => m.AdminClientModule) },
            { path: 'prospects', loadChildren: () => import('app/modules/admin/pages/prospect/prospect.module').then(m => m.AdminProspectModule) },
            { path: 'sow', loadChildren: () => import('app/modules/admin/pages/sow/sow.module').then(m => m.AdminSowModule) },
            { path: 'timesheet', loadChildren: () => import('app/modules/admin/pages/timesheet/timesheet.module').then(m => m.AdminTimesheetModule) },
            { path: 'invoice', loadChildren: () => import('app/modules/admin/pages/invoice/invoice.module').then(m => m.AdminInvoiceModule) },
        ]
    }
];
