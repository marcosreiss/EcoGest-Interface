import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{`Vendas - ${CONFIG.appName}`}</title>
            </Helmet>

            <h1>Vendas</h1>

            {/* <SalesViews /> */}
        </>
    );
}
