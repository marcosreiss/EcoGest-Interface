import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{`Recibos - ${CONFIG.appName}`}</title>
            </Helmet>

            <h1>Recibos</h1>

            {/* <ReceiptsViews /> */}
        </>
    );
}
