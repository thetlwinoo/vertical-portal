import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountStatementsModule } from './account-statements/account-statements.module';
import { OrderOverviewModule } from './order-overview/order-overview.module';
import { TransactionOverviewModule } from './transaction-overview/transaction-overview.module';

const MODULES = [
  AccountStatementsModule,
  OrderOverviewModule,
  TransactionOverviewModule
];

const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: '/account-statements' },
  {
    path: 'account-statements',
    loadChildren: () => import('./account-statements/account-statements.module').then(m => m.AccountStatementsModule)
  },
  {
    path: 'order-overview',
    loadChildren: () => import('./order-overview/order-overview.module').then(m => m.OrderOverviewModule)
  },
  {
    path: 'transaction-overview',
    loadChildren: () => import('./transaction-overview/transaction-overview.module').then(m => m.TransactionOverviewModule)
  },
  { path: '**', redirectTo: 'account-statements' },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(ROUTES),
    ...MODULES
  ]
})
export class FinanceModule { }
