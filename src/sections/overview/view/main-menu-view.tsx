import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { SvgColor } from 'src/components/svg-color';
import { DashboardContent } from 'src/layouts/dashboard';

// Função para criar o ícone com cor personalizada
const icon = (name: string, color: string) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
    <SvgColor
      width="80px"
      height="80px"
      src={`/assets/icons/navbar/${name}.svg`}
      sx={{
        color, // Aplica a cor diretamente ao ícone SVG
        '& path': { fill: color }, // Garante que o caminho do SVG seja preenchido
      }}
    />
  </div>
);

// Dados do menu com cores personalizadas apenas para os ícones
const menuItems = [
  { title: 'Clientes', icon: icon('ic-people', '#FFC107'), path: '/customers' }, // Amarelo Alaranjado
  { title: 'Fornecedores', icon: icon('ic-truck', '#2F91D1'), path: '/suppliers' }, // Azul
  { title: 'Vendas', icon: icon('ic-sales', '#34B864'), path: '/sales' }, // Verde
  { title: 'Compras', icon: icon('ic-cart', '#FF9D1E'), path: '/purchases' }, // Laranja
  { title: 'Produtos', icon: icon('ic-soda', '#1E6A3A'), path: '/products' }, // Verde Escuro
  { title: 'Funcionários', icon: icon('ic-employees', '#546161'), path: '/employees' }, // Cinza
  { title: 'Despesas', icon: icon('ic-coins', '#F45752'), path: '/expenses' }, // Vermelho
  { title: 'Balanço', icon: icon('ic-adm', '#38A95A'), path: '/admin' }, // Verde
];

export function OverviewMenuView() {
  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ textAlign: 'center', mb: 4, scale: 4, paddingTop: '0.25rem' }}>
        ♻️
        {/* <img
          src="/path/to/logo.png" // Substitua pelo caminho real da logo
          alt="EcoGest Logo"
          style={{ width: '100px', height: 'auto' }}
        /> */}
      </Box>

      <Typography variant="h4" sx={{ mb: { xs: 3, md: 3 }, textAlign: 'center' }}>
        Bem-Vindo de volta ao EcoGest!
      </Typography>

      <Grid container spacing={3}>
        {menuItems.map((item, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: '#FFFFFF', // Fundo branco
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <CardActionArea href={item.path}>
                {item.icon}
                <CardContent>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{
                      color: '#546161', // Cinza escuro para o texto
                    }}
                  >
                    {item.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DashboardContent>
  );
}
