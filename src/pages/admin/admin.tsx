import type { KpiParams } from 'src/models/kpiModel';

import { useState } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useGetSalesKpi, useGetExpensesKpi } from 'src/hooks/useKpi';

import { DashboardContent } from 'src/layouts/dashboard';

import KpiFilter from './components/kpiFilter';
import GenerateDailyReport from './components/generateDailyReport';
import FinancialOverviewCard from '../../sections/overview/analytics-banking';
// import { AnalyticsCurrentVisits } from '../../sections/overview/analytics-current-visits';
// import { AnalyticsWebsiteVisits } from '../../sections/overview/analytics-website-visits';
// import { AnalyticsWidgetSummary } from '../../sections/overview/analytics-widget-summary';

export default function Page() {
    const [params, setParams] = useState<KpiParams>({})

    const { data: salesData } = useGetSalesKpi(params);
    const { data: expensesData } = useGetExpensesKpi(params);

    const totalSalesAmount = salesData?.data?.totalSalesApprovedData?.length
        ? salesData.data.totalSalesApprovedData.reduce(
            (acc, data) => acc + parseFloat(data.totalSalesApproved),
            0
        )
        : 0;

    const totalExpensesAmount = expensesData?.data?.totalExpensesData?.length
        ? expensesData.data.totalExpensesData.reduce(
            (acc, data) => acc + parseFloat(data.totalExpenses),
            0
        )
        : 0;


    const totalBalanceData = totalSalesAmount - totalExpensesAmount;

    return (
        <DashboardContent maxWidth="xl">
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                Balanço
            </Typography>


            <KpiFilter salesKpiParams={params} setSalesKpiParams={setParams} />

            <Grid container spacing={3}>
                {/* <Grid item xs={12} sm={6} md={3}>
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
                </Grid> */}

                <Grid container justifyContent="end" sx={{ margin: 1, paddingRight: 8, scale: 1.1 }}>
                    <Grid item>
                        <GenerateDailyReport />
                    </Grid>
                </Grid>


                <Grid item xs={12} md={12} lg={12} paddingBottom={5}>
                    <FinancialOverviewCard
                        totalBalance={totalBalanceData}
                        income={totalSalesAmount}
                        incomeChangePercentage={0}
                        expenses={totalExpensesAmount}
                        expenseChangePercentage={0}
                        salesData={salesData?.data.totalSalesApprovedData ?? []}
                        expensesData={expensesData?.data.totalExpensesData ?? []}
                        setSalesKpiParams={setParams}
                    />
                </Grid>

                {/* <Grid container spacing={3}>
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
                </Grid> */}
            </Grid>
        </DashboardContent>
    );
}
