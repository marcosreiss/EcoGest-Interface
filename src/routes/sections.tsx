import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const CostumersPage = lazy(() => import('src/pages/costomers'));
export const SalesPage = lazy(() => import('src/pages/sales'));
export const SuppliersPage = lazy(() => import('src/pages/suppliers'));
export const PurchasesPage = lazy(() => import('src/pages/purchases'));
export const ExpensesPage = lazy(() => import('src/pages/expenses'));
export const EmployeesPage = lazy(() => import('src/pages/employees'));
export const ReceiptsPage = lazy(() => import('src/pages/receipts'));
export const AdminPage = lazy(() => import('src/pages/admin'));


// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'costomers', element: <CostumersPage /> },
        { path: 'sales', element: <SalesPage /> },
        { path: 'suppliers', element: <SuppliersPage /> },
        { path: 'purchases', element: <PurchasesPage /> },
        { path: 'expenses', element: <ExpensesPage /> },
        { path: 'employees', element: <EmployeesPage /> },
        { path: 'receipts', element: <ReceiptsPage /> },
        { path: 'admin', element: <AdminPage /> },

      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
