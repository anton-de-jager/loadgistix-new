/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard'
    },
    {
        id: 'admin',
        title: 'Admin',
        type: 'group',
        icon: 'iconsmind:truck',
        children: [
            {
                id: 'admin-lookups',
                title: 'Lookups',
                type: 'basic',
                icon: 'mat_outline:people',
                link: '/lookups'
            },
            // {
            //     id: 'admin-settings',
            //     title: 'Settings',
            //     type: 'basic',
            //     icon: 'mat_outline:settings',
            //     link: '/settings'
            // },
        ]
    },
    {
        id: 'fleet',
        title: 'Fleet',
        type: 'group',
        icon: 'iconsmind:truck',
        children: [
            {
                id: 'fleet-vehicles',
                title: 'My Vehicles',
                type: 'basic',
                icon: 'iconsmind:truck',
                link: '/vehicles'
            },
            {
                id: 'fleet-drivers',
                title: 'My Drivers',
                type: 'basic',
                icon: 'mat_outline:people',
                link: '/drivers'
            }
        ]
    },
    {
        id: 'loads',
        title: 'Loads',
        type: 'group',
        icon: 'heroicons_outline:chart-pie',
        children: [
            {
                id: 'loads-loads',
                title: 'My Loads',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/loads'
            },
            {
                id: 'loads-available',
                title: 'Available Loads',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/loads-available'
            }
        ]
    },
    {
        id: 'bids',
        title: 'My Bids',
        type: 'basic',
        icon: 'iconsmind:mail_money',
        link: '/bids'
    },
    {
        id: 'adverts',
        title: 'Adverts',
        type: 'basic',
        icon: 'iconsmind:mail_money',
        link: '/adverts'
    },
    {
        id: 'directory',
        title: 'Directory',
        type: 'group',
        icon: 'heroicons_outline:chart-pie',
        children: [
            {
                id: 'business-directory',
                title: 'Business Directory',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/business-directory'
            },
            {
                id: 'directory-directory',
                title: 'My Directory Entries',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/directory'
            }
        ]
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard'
    },
    // {
    //     id: 'settings',
    //     title: 'Settings',
    //     type: 'basic',
    //     icon: 'mat_outline:settings',
    //     link: '/settings'
    // },
    {
        id: 'lookups',
        title: 'Lookups',
        type: 'basic',
        icon: 'iconsmind:truck',
        link: '/lookups'
    },
    {
        id: 'vehicles',
        title: 'My Vehicles',
        type: 'basic',
        icon: 'iconsmind:truck',
        link: '/vehicles'
    },
    {
        id: 'drivers',
        title: 'My Drivers',
        type: 'basic',
        icon: 'mat_outline:people',
        link: '/drivers'
    },
    {
        id: 'loads',
        title: 'My Loads',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/loads'
    },
    {
        id: 'loads-available',
        title: 'Available Loads',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/loads-available'
    },
    {
        id: 'bids',
        title: 'My Bids',
        type: 'basic',
        icon: 'iconsmind:mail_money',
        link: '/bids'
    },
    {
        id: 'adverts',
        title: 'Adverts',
        type: 'basic',
        icon: 'iconsmind:mail_money',
        link: '/adverts'
    },
    {
        id: 'business-directory',
        title: 'Business Directory',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/business-directory'
    },
    {
        id: 'directory',
        title: 'My Directory Entries',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/directory-directory'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard'
    },
    // {
    //     id: 'settings',
    //     title: 'Settings',
    //     type: 'basic',
    //     icon: 'mat_outline:settings',
    //     link: '/settings'
    // },
    {
        id: 'lookups',
        title: 'Lookups',
        type: 'basic',
        icon: 'iconsmind:truck',
        link: '/lookups'
    },
    {
        id: 'vehicles',
        title: 'My Vehicles',
        type: 'basic',
        icon: 'iconsmind:truck',
        link: '/vehicles'
    },
    {
        id: 'drivers',
        title: 'My Drivers',
        type: 'basic',
        icon: 'mat_outline:people',
        link: '/drivers'
    },
    {
        id: 'loads',
        title: 'My Loads',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/loads'
    },
    {
        id: 'loads-available',
        title: 'Available Loads',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/loads-available'
    },
    {
        id: 'bids',
        title: 'My Bids',
        type: 'basic',
        icon: 'iconsmind:mail_money',
        link: '/bids'
    },
    {
        id: 'adverts',
        title: 'Adverts',
        type: 'basic',
        icon: 'iconsmind:mail_money',
        link: '/adverts'
    },
    {
        id: 'business-directory',
        title: 'Business Directory',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/business-directory'
    },
    {
        id: 'directory',
        title: 'My Directory Entries',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/directory-directory'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard'
    },
    // {
    //     id: 'settings',
    //     title: 'Settings',
    //     type: 'basic',
    //     icon: 'mat_outline:settings',
    //     link: '/settings'
    // },
    {
        id: 'admin',
        title: 'Admin',
        type: 'group',
        icon: 'iconsmind:truck',
        children: []
    },
    {
        id: 'fleet',
        title: 'Fleet',
        type: 'group',
        icon: 'iconsmind:truck',
        children: []
    },
    {
        id: 'loads',
        title: 'Loads',
        type: 'group',
        icon: 'heroicons_outline:chart-pie',
        children: []
    },
    {
        id: 'bids',
        title: 'My Bids',
        type: 'basic',
        icon: 'iconsmind:mail_money',
        link: '/bids'
    },
    {
        id: 'adverts',
        title: 'Adverts',
        type: 'basic',
        icon: 'iconsmind:mail_money',
        link: '/adverts'
    },
    {
        id: 'directory',
        title: 'Directory',
        type: 'group',
        icon: 'heroicons_outline:chart-pie',
        children: []
    }
];
