import { VsNavigation } from '@vertical/types';

export const navigation: VsNavigation[] = [
  {
    level: 1,
    id: 'products',
    title: 'Products',
    translate: 'NAV.PRODUCTS.TITLE',
    type: 'collapsable',
    // icon: 'gift',
    open: false,
    selected: false,
    url: '/main/products',
    children: [
      {
        level: 2,
        id: 'manage-products',
        title: 'Manage Products',
        type: 'item',
        url: '/main/products/manage-products',
        exactMatch: false,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'manage-images',
        title: 'Manage Images',
        type: 'item',
        url: '/main/products/manage-images',
        exactMatch: false,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'manage-categories',
        title: 'Manage Categories',
        type: 'item',
        url: '/main/products/manage-categories',
        exactMatch: false,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'batch-upload',
        title: 'Batch Upload',
        type: 'item',
        url: '/main/products/batch-upload',
        exactMatch: false,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'procut-choice',
        title: 'Product Choice',
        type: 'item',
        url: '/main/products/product-choice',
        exactMatch: false,
        open: false,
        selected: false,
      },
    ],
  },
  {
    level: 1,
    id: 'orders',
    title: 'Orders',
    translate: 'NAV.ORDERS.TITLE',
    type: 'collapsable',
    // icon: 'mail',
    open: false,
    selected: false,
    url: '/main/orders',
    children: [
      {
        level: 2,
        id: 'manage-orders',
        title: 'Manage Orders',
        type: 'item',
        url: '/main/orders/manage-orders',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'manage-return-orders',
        title: 'Manage Return Orders',
        type: 'item',
        url: '/main/orders/manage-return-orders',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'manage-reviews',
        title: 'Manage Reviews',
        type: 'item',
        url: '/main/orders/manage-reviews',
        exactMatch: true,
        open: false,
        selected: false,
      },
    ],
  },
  {
    level: 1,
    id: 'promotions',
    title: 'Promotions',
    translate: 'NAV.PROMOTIONS.TITLE',
    type: 'collapsable',
    // icon: 'mail',
    open: false,
    selected: false,
    url: '/main/promotions',
    children: [
      {
        level: 2,
        id: 'campaign-management',
        title: 'Campaign Management',
        type: 'item',
        url: '/main/promotions/campaign-management',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'seller-voucher',
        title: 'Seller Voucher',
        type: 'item',
        url: '/main/promotions/seller-voucher',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'cashback-voucher',
        title: 'Cashback Voucher',
        type: 'item',
        url: '/main/promotions/cashback-voucher',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'free-shipping',
        title: 'Free Shipping',
        type: 'item',
        url: '/main/promotions/free-shipping',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'discounts',
        title: 'Discounts',
        type: 'item',
        url: '/main/promotions/discounts',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'discount-types',
        title: 'Discount Types',
        type: 'item',
        url: '/main/promotions/discount-types',
        exactMatch: true,
        open: false,
        selected: false,
      },
    ],
  },
  {
    level: 1,
    id: 'finance',
    title: 'Finance',
    translate: 'NAV.FINANCE.TITLE',
    type: 'collapsable',
    // icon: 'mail',
    open: false,
    selected: false,
    url: '/main/finance',
    children: [
      {
        level: 2,
        id: 'account-statements',
        title: 'Account Statements',
        type: 'item',
        url: '/main/finance/account-statements',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'order-overview',
        title: 'Order Overview',
        type: 'item',
        url: '/main/finance/order-overview',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'transaction-overview',
        title: 'Transaction Overview',
        type: 'item',
        url: '/main/finance/transaction-overview',
        exactMatch: true,
        open: false,
        selected: false,
      },
    ],
  },
  {
    level: 1,
    id: 'manage-stores',
    title: 'Manage Stores',
    translate: 'NAV.STORE.TITLE',
    type: 'collapsable',
    // icon: 'mail',
    open: false,
    selected: false,
    url: '/main/store',
    children: [
      {
        level: 2,
        id: 'shipping_fee_chart',
        title: 'Shipping Fee Chart',
        type: 'item',
        url: '/main/store/shipping-fee-chart',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'product-brands',
        title: 'Product Brands',
        type: 'item',
        url: '/main/store/product-brands',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'addresses',
        title: 'Addresses',
        type: 'item',
        url: '/main/store/addresses',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'users',
        title: 'Users',
        type: 'item',
        url: '/main/store/users',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'suppliers',
        title: 'Suppliers',
        type: 'item',
        url: '/main/store/suppliers',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'customers',
        title: 'Customers',
        type: 'item',
        url: '/main/store/customers',
        exactMatch: true,
        open: false,
        selected: false,
      },
    ]
  },
  {
    level: 1,
    id: 'web-contents',
    title: 'Web Contents',
    type: 'collapsable',
    // icon: 'mail',
    open: false,
    selected: false,
    url: '/main/web-contents',
    children: [
      {
        level: 2,
        id: 'web-sitemap',
        title: 'Web Sitemap',
        type: 'item',
        url: '/main/web-contents/web-sitemap',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'web-image-types',
        title: 'Web Image Types',
        type: 'item',
        url: '/main/web-contents/web-image-types',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'web-themes',
        title: 'Web Themes',
        type: 'item',
        url: '/main/web-contents/web-themes',
        exactMatch: true,
        open: false,
        selected: false,
      },
      {
        level: 2,
        id: 'web-config',
        title: 'Web Config',
        type: 'item',
        url: '/main/web-contents/web-config',
        exactMatch: true,
        open: false,
        selected: false,
      },
    ]
  }
];
