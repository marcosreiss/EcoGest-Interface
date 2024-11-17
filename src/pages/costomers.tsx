import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export default function Page(){
    return(
        <>
        <Helmet>
            <title>{`Clientes - ${CONFIG.appName}`}</title>
        </Helmet>

        <h1>Clientes</h1>

        {/* <CostomersViews /> */}
        </>
    )
}