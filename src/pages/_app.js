import dynamic from 'next/dynamic';

import '../styles/app-base.css';
import '../styles/app-components.css';
import '../styles/app-utilities.css';

const AppWithProviders = dynamic(() => import('../components/next/AppWithProviders'), {
  ssr: false,
});

export default function MyApp(props) {
  return <AppWithProviders {...props} />;
}
