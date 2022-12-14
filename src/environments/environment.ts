// // This file can be replaced during build by using the `fileReplacements` array.
// // `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// // The list of file replacements can be found in `angular.json`.

// export const environment = {
//     production: false,
//     //api: 'https://api.loadgistix.com/',
//     api: 'https://localhost:44357/',
//     apiUrl: 'https://luvirosapi.com:1880/loadgistix/api/',
//     apiUrlLunkulu: 'https://luvirosapi.com:1880/api/lunkulu/',
//     urlShort: 'http://localhost:4200/#/',
//     payfastUrl: 'https://www.payfast.co.za/eng/process',
//     receiver: '10147644',
//     merchant_id: '10028092',
//     merchant_key: 'u5jvopjga9iqj',
//     passPhrase: 'ThisIsMyVibeViewerPassphrase007',
//     pfHost: 'sandbox',
//     // merchant_id: '12100762',
//     // merchant_key: '596bxmubjzosk',
//     // passPhrase: 'ThisIsMyVibeViewerPassphrase007',
//     // pfHost: 'www',
//     paypalClientId: 'AT8sJJMymscC263lrIkvmz37FqRlbEiSSZ1P34Fgt4GsYdT4xe6tfklPNxFpZMqzoW2Mh4DC6w4MfBXs',
//     paypalPlanId: 'P-62C96669FX726234DMMM5CEQ',
//     paypalSecret: 'ENPuyaat0opBtSZkwlFnxqeBZgf9_l3MkYpKou5I9Bo4y8eudXzE7is16bhnBLKEwAPVyHRWu7a9s9aW'
// };

// /*
//  * For easier debugging in development mode, you can import the following file
//  * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
//  *
//  * This import should be commented out in production mode because it will have a negative impact
//  * on performance if an error is thrown.
//  */
// // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
export const environment = {
    production: true,
    api: 'https://api.loadgistix.com/',
    apiUrl: 'https://luvirosapi.com:1880/loadgistix/api/',
    apiUrlLunkulu: 'https://luvirosapi.com:1880/api/lunkulu/',
    //urlShort: 'https://loadgistix.com/#/'
    urlShort: 'https://app.loadgistix.com/#/',
    payfastUrl: 'https://www.payfast.co.za/eng/process',
    receiver: '10147644',
    merchant_id: '12100762',
    merchant_key: '596bxmubjzosk',
    passPhrase: 'ThisIsMyVibeViewerPassphrase007',
    pfHost: 'www',
    paypalClientId: 'AT8sJJMymscC263lrIkvmz37FqRlbEiSSZ1P34Fgt4GsYdT4xe6tfklPNxFpZMqzoW2Mh4DC6w4MfBXs',
    paypalPlanId: 'P-62C96669FX726234DMMM5CEQ',
    paypalSecret: 'ENPuyaat0opBtSZkwlFnxqeBZgf9_l3MkYpKou5I9Bo4y8eudXzE7is16bhnBLKEwAPVyHRWu7a9s9aW'
};