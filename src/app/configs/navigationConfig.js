import i18n from '../../i18n';

import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('tr', 'navigation', tr);
i18n.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    subtitle: '',
    type: 'group',
    icon: 'heroicons-outline:home',
    translate: 'DASHBOARDS',
    children: [
      {
        id: 'dashboards.subscriptions',
        title: 'Subscriptions',
        type: 'item',
        icon: 'heroicons-outline:check-circle',
        url: '/dashboards/subscriptions',
      },
      {
        id: 'dashboards.simsplans',
        title: 'Order Sims & Plans',
        type: 'item',
        icon: 'heroicons-outline:plus',
        url: '/dashboards/simsplans',
      },
      {
        id: 'dashboards.ordersims',
        title: 'Order SIMs & Devices',
        type: 'item',
        icon: 'heroicons-outline:plus',
        url: '/dashboards/placeorder',
      },

      {
        id: 'dashboards.activatesims',
        title: 'Activate SIMs & Devices',
        type: 'item',
        icon: 'heroicons-outline:table',
        url: '/dashboards/activatesims',
      },

      {
        id: 'dashboards.closelines',
        title: 'Close Lines',
        type: 'item',
        icon: 'heroicons-outline:x',
        url: '/dashboards/closelines',
      },
      {
        id: 'dashboard.plans',
        title: 'Change Plans',
        type: 'item',
        icon: 'heroicons-outline:switch-vertical',
        url: '/dashboards/changeplans',
      },
      {
        id: 'dashboard.addons',
        title: 'Add/Remove Addons',
        type: 'item',
        icon: 'heroicons-outline:ticket',
        url: '/dashboards/addons',
      },

      {
        id: 'dashboards.billing',
        title: 'Billing',
        type: 'item',
        icon: 'heroicons-outline:clipboard-list',
        url: '/dashboards/billinghistory',
      },
      {
        id: 'dashboards.orderhistory',
        title: 'Order History',
        type: 'item',
        icon: 'heroicons-outline:pencil-alt',
        url: '/dashboards/orderhistory',
      },
      {
        id: 'dashboards.changenumbers',
        title: 'Change Numbers',
        type: 'item',
        icon: 'heroicons-outline:adjustments',
        url: '/dashboards/changenumber',
      },
      {
        id: 'dashboards.history',
        title: 'Number Change History',
        type: 'item',
        icon: 'heroicons-outline:color-swatch',
        url: '/dashboards/numberchangehistory',
      },
      {
        id: 'dashboards.profile',
        title: 'Account Profile',
        type: 'item',
        icon: 'heroicons-outline:users',
        url: '/dashboards/account',
      },

      // {
      //   id: 'dashboards.analytics',
      //   title: 'Upload CSV',
      //   type: 'item',
      //   icon: 'feather:upload',
      //   url: '/dashboards/csv',
      // }
    ],
  },
];

export default navigationConfig;
