import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

import { useAuth } from 'src/context/AuthContext';
import { DashboardContent } from 'src/layouts/dashboard';

import { SvgColor } from 'src/components/svg-color';

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
  { title: 'Funcionários', icon: icon('ic-employees', '#546161'), path: '/employees', adminOnly: true }, // Cinza
  { title: 'Despesas', icon: icon('ic-coins', '#F45752'), path: '/expenses', adminOnly: true }, // Vermelho
  { title: 'Balanço', icon: icon('ic-adm', '#38A95A'), path: '/admin', adminOnly: true }, // Verde
];

export function OverviewMenuView() {
  const { role } = useAuth();
  return (
    <DashboardContent
      sx={{
        overflowX: 'hidden', // Garante que o DashboardContent não permita transbordamento horizontal
        width: '100vw', // Limita a largura à viewport
        boxSizing: 'border-box', // Inclui padding/margin no cálculo do tamanho
      }}
      maxWidth="xl"
    >
      <Box
        sx={{
          textAlign: 'center',
          mb: 4,
          scale: 4,
          paddingTop: '0.25rem',
        }}
      >
        ♻️
      </Box>

      <Typography variant="h4" sx={{ mb: { xs: 3, md: 3 }, textAlign: 'center' }}>
        EcoGest
      </Typography>

      <Grid
        container
        spacing={3}
        sx={{
          margin: 0, // Remove margens externas
          width: '100%', // Evita transbordamento horizontal
          overflowX: 'hidden', // Oculta transbordamento horizontal no grid
        }}
      >
        {menuItems
          .filter((item) => !item.adminOnly || role === 'admin')
          .map((item, index) => (
            <Grid xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#FFFFFF',
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
                        color: '#546161',
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
