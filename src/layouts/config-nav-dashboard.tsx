import path from 'path';
import { title } from 'process';
import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
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
    title: 'Clientes',
    path: '/costomers',
    icon: icon('ic-people')
  },
  {
    title: 'Produtos',
    path: '/products',
    icon: icon('ic-soda'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },
  {
    title: 'Fornecedores',
    path: '/suppliers',
    icon: icon('ic-truck')
  },
  {
    title: 'Despesas',
    path: '/expenses',
    icon: icon('ic-coins')
  },
  {
    title: 'Recibos',
    path: '/receipts',
    icon: icon('ic-bill')
  },
  {
    title: 'Funcionarios',
    path: '/employees',
    icon: icon('ic-employees'),
  },
  {
    title: 'Adm',
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
