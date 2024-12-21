import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useGetSalesKpi } from 'src/hooks/useKpi';

import { DashboardContent } from 'src/layouts/dashboard';

import FinancialOverviewCard from '../sections/overview/analytics-banking';
import { AnalyticsCurrentVisits } from '../sections/overview/analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../sections/overview/analytics-website-visits';
import { AnalyticsWidgetSummary } from '../sections/overview/analytics-widget-summary';

export default function Page() {
  const { data } = useGetSalesKpi();
  console.log(data);
  

  return (
      <DashboardContent maxWidth="xl">
          <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
              Balanço
          </Typography>

          <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                  <AnalyticsWidgetSummary
                      title="Total de Vendas"
                      total={714000}
                      icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
                  />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                  <AnalyticsWidgetSummary
                      title="Total de Compras"
                      total={1352831}
                      color="secondary"
                      icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
                  />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                  <AnalyticsWidgetSummary
                      title="Compras em processo:"
                      total={1723315}
                      color="warning"
                      icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
                  />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                  <AnalyticsWidgetSummary
                      title="Vendas em processo:"
                      total={234}
                      color="error"
                      icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
                  />
              </Grid>

              <Grid item xs={12} md={12} lg={12} paddingBottom={5}>
                  <FinancialOverviewCard
                      totalBalance={49990}
                      income={9990}
                      incomeChangePercentage={8.2}
                      expenses={1989}
                      expenseChangePercentage={-6.6}
                      chartData={[
                          { month: 'Jan', value: 5 },
                          { month: 'Feb', value: 15 },
                          { month: 'Mar', value: 20 },
                          { month: 'Apr', value: 35 },
                          { month: 'May', value: 90 },
                          { month: 'Jun', value: 70 },
                          { month: 'Jul', value: 60 },
                          { month: 'Aug', value: 65 },
                          { month: 'Sep', value: 70 },
                      ]}
                  />
              </Grid>

              <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={4}>
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

                  <Grid item xs={12} md={6} lg={8}>
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
