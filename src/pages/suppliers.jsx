import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{`Fornecedores - ${CONFIG.appName}`}</title>
            </Helmet>

            <h1>Fornecedores</h1>

            {/* <SuppliersViews /> */}
        </>
    );
}
