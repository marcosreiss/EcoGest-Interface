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
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ReceiptsPage = lazy(() => import('src/pages/receipts/receipts'));
export const AdminPage = lazy(() => import('src/pages/admin/admin'));

// ---------- Costumer Components
export const CustomersPage = lazy(() => import('src/pages/customers/customersIndex'));
export const CustomersCreatePage = lazy(() => import('src/pages/customers/createCustomer'));
export const CustomersDetailsPage = lazy(() => import('src/pages/customers/customersDetails'));
export const CustomersEditPage = lazy(() => import('src/pages/customers/editCustomer'));

// ---------- Product Components
export const ProductsPage = lazy(() => import('src/pages/products/productsIndex'));
export const CreateProduct = lazy(() => import('src/pages/products/createProduct'));
export const EditProduct = lazy(() => import('src/pages/products/editProduct'));
export const ProductDetails = lazy(() => import('src/pages/products/productDetails'));

// ---------- Supplier Components
export const SuppliersPage = lazy(() => import('src/pages/suppliers/suppliersIndex'));
export const CreateSupplier = lazy(() => import('src/pages/suppliers/createSupplier'));
export const EditSupplier = lazy(() => import('src/pages/suppliers/editSupplier'));
export const SupplierDetails = lazy(() => import('src/pages/suppliers/suppliersDetails'));

// ---------- Purchases Components
export const PurchasesPage = lazy(() => import('src/pages/purchases/purchasesIndex'));
export const CreatePurchase = lazy(() => import('src/pages/purchases/createPurchase'));
export const EditPurchase = lazy(() => import('src/pages/purchases/editPurchase'));
export const PurchaseDetails = lazy(() => import('src/pages/purchases/purchaseDetails'));

// ---------- Sales Components
export const SalesPage = lazy(() => import('src/pages/sales/salesIndex'));
export const CreateSale = lazy(() => import('src/pages/sales/createSale'));
export const EditSale = lazy(() => import('src/pages/sales/editSale'));
export const SaleDetails = lazy(() => import('src/pages/sales/saleDetails'));

// ---------- Employee Components
export const EmployeesPage = lazy(() => import('src/pages/employees/employeesIndex'));
export const CreateEmployee = lazy(() => import('src/pages/employees/createEmployee'));
export const EditEmployee = lazy(() => import('src/pages/employees/editEmployee'));
export const EmployeeDetails = lazy(() => import('src/pages/employees/employeeDetails'));


// ---------- Expenses Components
// ---------- Expense Components
export const ExpensesPage = lazy(() => import('src/pages/expenses/expensesIndex'));
export const CreateExpense = lazy(() => import('src/pages/expenses/createExpense'));
export const EditExpense = lazy(() => import('src/pages/expenses/editExpense'));
export const ExpenseDetails = lazy(() => import('src/pages/expenses/expenseDetails'));



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

export function PrivateRouter() {
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
        { path: 'blog', element: <BlogPage /> },
        { path: 'sales', element: <SalesPage /> },
        { path: 'expenses', element: <ExpensesPage /> },
        { path: 'employees', element: <EmployeesPage /> },
        { path: 'receipts', element: <ReceiptsPage /> },
        { path: 'admin', element: <AdminPage /> },

        { path: 'customers', element: <CustomersPage /> },
        { path: 'customers/create', element: <CustomersCreatePage /> },
        { path: 'customers/details/:id', element: <CustomersDetailsPage /> },
        { path: 'customers/edit/:id', element: <CustomersEditPage /> },

        { path: 'products', element: <ProductsPage /> },
        { path: 'products/create', element: <CreateProduct /> },
        { path: 'products/edit/:id', element: <EditProduct /> },
        { path: 'products/details/:id', element: <ProductDetails /> },

        { path: 'suppliers', element: <SuppliersPage /> },
        { path: 'suppliers/create', element: <CreateSupplier /> },
        { path: 'suppliers/edit/:id', element: <EditSupplier /> },
        { path: 'suppliers/details/:id', element: <SupplierDetails /> },

        { path: 'purchases', element: <PurchasesPage /> },
        { path: 'purchases/create', element: <CreatePurchase /> },
        { path: 'purchases/edit/:id', element: <EditPurchase /> },
        { path: 'purchases/details/:id', element: <PurchaseDetails /> },

        { path: 'sales', element: <SalesPage /> },
        { path: 'sales/create', element: <CreateSale /> },
        { path: 'sales/edit/:id', element: <EditSale /> },
        { path: 'sales/details/:id', element: <SaleDetails /> },

        { path: 'employees', element: <EmployeesPage /> },
        { path: 'employees/create', element: <CreateEmployee /> },
        { path: 'employees/edit/:id', element: <EditEmployee /> },
        { path: 'employees/details/:id', element: <EmployeeDetails /> },

        { path: 'expenses', element: <ExpensesPage /> },
        { path: 'expenses/create', element: <CreateExpense /> },
        { path: 'expenses/edit/:id', element: <EditExpense /> },
        { path: 'expenses/details/:id', element: <ExpenseDetails /> },


      ],
    },
    { path: '404', element: <Page404 />, },
    { path: '*', element: <Navigate to="/404" replace />, },
  ]);
}

export function PublicRouter() {
  return useRoutes([
    { element: <AuthLayout><SignInPage /></AuthLayout>, index: true },
    { path: 'user', element: <AuthLayout><SignInPage /></AuthLayout> },

    { path: 'products', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'products/create', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'products/details/:id', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'products/edit/:id', element: <AuthLayout><SignInPage /></AuthLayout> },

    { path: 'blog', element: <AuthLayout><SignInPage /></AuthLayout> },

    { path: 'suppliers', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'suppliers/create', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'suppliers/details/:id', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'suppliers/edit/:id', element: <AuthLayout><SignInPage /></AuthLayout> },

    { path: 'purchases', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'purchases/create', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'purchases/details/:id', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'purchases/edit/:id', element: <AuthLayout><SignInPage /></AuthLayout> },

    { path: 'expenses', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'employees', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'receipts', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'admin', element: <AuthLayout><SignInPage /></AuthLayout> },

    { path: 'customers', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'customers/create', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'customers/details/:id', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'customers/edit/:id', element: <AuthLayout><SignInPage /></AuthLayout> },

    { path: 'sales', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'sales/create', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'sales/details/:id', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'sales/edit/:id', element: <AuthLayout><SignInPage /></AuthLayout> },

    { path: 'employees', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'employees/create', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'employees/details/:id', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'employees/edit/:id', element: <AuthLayout><SignInPage /></AuthLayout> },

    { path: 'expenses', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'expenses/create', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'expenses/details/:id', element: <AuthLayout><SignInPage /></AuthLayout> },
    { path: 'expenses/edit/:id', element: <AuthLayout><SignInPage /></AuthLayout> },


    { path: '404', element: <Page404 />, },
    { path: '*', element: <Navigate to="/404" replace />, },
  ])
}