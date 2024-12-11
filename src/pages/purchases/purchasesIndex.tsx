import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{`Compras - ${CONFIG.appName}`}</title>
            </Helmet>

            <h1>Compras</h1>

            {/* <PurchasesViews /> */}
        </>
    );
}
