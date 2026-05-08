import { Navigate } from 'react-router-dom';

import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import ExampleConfig from '../main/example/ExampleConfig';
import Placeorder from '../main/mypages/ordersims/Placeorder';
import Orderlist from '../main/mypages/orderlists/Orderlist';
import Subscription from '../main/mypages/subscription/Subscription';
import Billinghistory from '../main/mypages/billinghistory/billinghistory';
import Orderhistory from '../main/mypages/orderhistory/Orderhistory';
import Changenumber from '../main/mypages/changenumber/Changenumber';
import Numberchangehistory from '../main/mypages/numberchangehistory/Numberchangehistory';
import Account from '../main/mypages/accountdetail/Account';
import Terms from '../main/mypages/Terms/Terms';
import Closelines from '../main/mypages/closelines/Closelines';
import ChangePlans from '../main/mypages/changeplans/ChangePlans';
import Addons from '../main/mypages/addons/Addons';
import Gateways from '../main/mypages/gateways/Gateways';
import SimPlan from '../main/mypages/sim&plan/Sim&Plan';

import settingsConfig from 'app/configs/settingsConfig';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseUtils from '@fuse/utils';

const routeConfigs = [ExampleConfig, SignOutConfig, SignInConfig, SignUpConfig];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to="/example" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  {
    path: '404',
    element: <Error404Page />,
  },
  {
    path: '/dashboards/activatesims',
    element: <Orderlist />,
  },
  {
    path: '/dashboards/gateways',
    element: <Gateways />,
  },
  {
    path: '/dashboards/placeorder',
    element: <Placeorder />,
  },
  {
    path: '/dashboards/simsplans',
    element: <SimPlan />,
  },
  {
    path: '/dashboards/subscriptions',
    element: <Subscription />,
  },
  {
    path: '/dashboards/closelines',
    element: <Closelines />,
  },
  {
    path: '/dashboards/changeplans',
    element: <ChangePlans />,
  },
  {
    path: '/dashboards/addons',
    element: <Addons />,
  },
  {
    path: '/dashboards/billinghistory',
    element: <Billinghistory />,
  },
  {
    path: '/dashboards/orderhistory',
    element: <Orderhistory />,
  },
  {
    path: '/dashboards/changenumber',
    element: <Changenumber />,
  },
  {
    path: '/dashboards/numberchangehistory',
    element: <Numberchangehistory />,
  },
  {
    path: '/dashboards/account',
    element: <Account />,
  },

  {
    path: '/reset-password',
    element: <Terms />,
  },
  {
    path: '*',
    element: <Error404Page />,
  },
];

export default routes;
