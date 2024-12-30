import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OverviewMenuView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Home - ${CONFIG.appName}`}</title>
      </Helmet>

      <OverviewMenuView />
    </>
  );
}
