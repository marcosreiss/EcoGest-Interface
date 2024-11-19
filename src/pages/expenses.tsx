import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{`Despesas - ${CONFIG.appName}`}</title>
            </Helmet>

            <h1>Despesas</h1>

            {/* <ExpensesViews /> */}
        </>
    );
}
