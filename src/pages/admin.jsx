import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{`Admin - ${CONFIG.appName}`}</title>
            </Helmet>

            <h1>Admin</h1>

            {/* <AdminViews /> */}
        </>
    );
}
