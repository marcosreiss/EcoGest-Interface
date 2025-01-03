
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Página Inicial',
    path: '/',
    icon: icon('ic-home'),
  },
  {
    title: 'Clientes',
    path: '/customers',
    icon: icon('ic-people')
  },
  {
    title: 'Produtos',
    path: '/products',
    icon: icon('ic-soda'),
    // info: (
    //   <Label color="error" variant="inverted">
    //     +3
    //   </Label>
    // ),
  },
  {
    title: 'Fornecedores',
    path: '/suppliers',
    icon: icon('ic-truck')
  },
  {
    title: 'Funcionarios',
    path: '/employees',
    icon: icon('ic-employees'),
  },
  {
    title: 'Vendas',
    path: '/sales',
    icon: icon('ic-sales'),
  },
  {
    title: 'Compras',
    path: '/purchases',
    icon: icon('ic-cart')
  },
  {
    title: 'Despesas',
    path: '/expenses',
    icon: icon('ic-coins')
  },
  // {
  //   title: 'Recibos',
  //   path: '/receipts',
  //   icon: icon('ic-bill')
  // },
  {
    title: 'Balanço',
    path: '/admin',
    icon: icon('ic-adm')
  },
  
  // {
  //   title: 'Blog',
  //   path: '/blog',
  //   icon: icon('ic-blog'),
  // },
  // {
  //   title: 'Sign in',
  //   path: '/sign-in',
  //   icon: icon('ic-lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
];
