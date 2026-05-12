import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import history from '@history';

/**
 * Keeps @history (Fuse / react-router) and Next.js pathname in sync so Fuse
 * navigation updates the active Next page file and vice versa.
 */
export default function HistoryNextSync() {
  const router = useRouter();
  const syncing = useRef(false);

  useEffect(() => {
    const unlisten = history.listen(({ location }) => {
      if (syncing.current) return;
      const url = `${location.pathname}${location.search}${location.hash}`;
      if (router.asPath === url) return;
      syncing.current = true;
      void router.replace(url).finally(() => {
        syncing.current = false;
      });
    });
    return unlisten;
  }, [router]);

  useEffect(() => {
    const url = router.asPath;
    const hist = `${history.location.pathname}${history.location.search}${history.location.hash}`;
    if (hist === url) return;
    if (syncing.current) return;
    syncing.current = true;
    history.replace(url);
    syncing.current = false;
  }, [router.asPath]);

  return null;
}
