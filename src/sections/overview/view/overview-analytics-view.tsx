import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';


// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 3 } }}>
        Bem-Vindo de volta ao EcoGest 👋
      </Typography>

      <Grid container spacing={3}>
        
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Compras em processo:"
            total={30}
            color="primary"
            icon={<img alt="icon" src="/assets/icons/glass/compras.svg" />}
  
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Vendas em processo:"
            total={10}
            color="primary"
            icon={<img alt="icon" src="/assets/icons/glass/vendas.svg" />}
          />
        </Grid>
        

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="Vendas em processo" list={_posts.slice(0, 5)} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="⚠️ Produtos em estoque baixo:" list={_timeline} />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="Compras em processo" list={_posts.slice(0, 5)} />
        </Grid>

      </Grid>
    </DashboardContent>
  );
}
