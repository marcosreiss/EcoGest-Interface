import Grid from '@mui/material/Grid'; 
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { CONFIG } from 'src/config-global';

import { AnalyticsCurrentVisits } from '../sections/overview/analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../sections/overview/analytics-website-visits';
import { AnalyticsWidgetSummary } from '../sections/overview/analytics-widget-summary';


// ----------------------------------------------------------------------

export default function Page() {
    return (
        <DashboardContent maxWidth="xl">

        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Balanço
      </Typography>

            {/* <AdminViews /> */}

        <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total de Vendas"
            total={714000}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total de Compras"
            total={1352831}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Compras em processo:"
            total={1723315}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Vendas em processo:"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
          />
        </Grid>

            <Grid container spacing={3}> {/* Adiciona o container com espaçamento */}
                <Grid item xs={12} md={6} lg={4}> {/* Define como item */}
                    <AnalyticsCurrentVisits
                        title="Current visits"
                        chart={{
                            series: [
                                { label: 'America', value: 3500 },
                                { label: 'Asia', value: 2500 },
                                { label: 'Europe', value: 1500 },
                                { label: 'Africa', value: 500 },
                            ],
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={6} lg={8}> {/* Define como item */}
                    <AnalyticsWebsiteVisits
                        title="Website visits"
                        subheader="(+43%) than last year"
                        chart={{
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                            series: [
                                { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                                { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
                            ],
                        }}
                    />
                </Grid>
            </Grid>
            
      </Grid>
      </DashboardContent>
    );
}
