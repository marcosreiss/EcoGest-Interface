import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{`Funcionários - ${CONFIG.appName}`}</title>
            </Helmet>

            <h1>Funcionários</h1>

            {/* <EmployeesViews /> */}
        </>
    );
}
