<?php

// Di-generate oleh php artisan template:zip - hanya berisi flavor "restoran".
// Ganti brand/warna di bawah, atau set TEMPLATE_FLAVOR di .env.

return [
    'flavor' => env('TEMPLATE_FLAVOR', 'restoran'),

    'flavors' => array (
  'restoran' => 
  array (
    'label' => 'Restoran',
    'brand_name' => 'DAPURKU',
    'brand_tagline' => 'Operasional restoran',
    'brand_initials' => 'DA',
    'accent' => '#b91c1c',
    'category' => 'kuliner',
    'home' => 'restoran.index',
    'nav' => 
    array (
      'sections' => 
      array (
        0 => 
        array (
          'label' => 'Restoran',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Dashboard',
              'to' => '/restoran',
              'icon' => 'LayoutDashboard',
            ),
            1 => 
            array (
              'label' => 'Reservasi Meja',
              'to' => '/restoran/reservasi',
              'icon' => 'CalendarCheck',
            ),
            2 => 
            array (
              'label' => 'Order Dapur',
              'to' => '/restoran/dapur',
              'icon' => 'ChefHat',
            ),
            3 => 
            array (
              'label' => 'Menu',
              'to' => '/restoran/menu',
              'icon' => 'UtensilsCrossed',
            ),
            4 => 
            array (
              'label' => 'Kasir',
              'to' => '/restoran/kasir',
              'icon' => 'ShoppingCart',
            ),
            5 => 
            array (
              'label' => 'Laporan',
              'to' => '/restoran/laporan',
              'icon' => 'ChartLine',
            ),
          ),
        ),
        1 => 
        array (
          'label' => 'Umum',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Pengguna',
              'to' => '/users',
              'icon' => 'Users',
            ),
            1 => 
            array (
              'label' => 'Peran',
              'to' => '/roles',
              'icon' => 'ShieldCheck',
            ),
            2 => 
            array (
              'label' => 'Pengaturan',
              'to' => '/settings',
              'icon' => 'Settings',
            ),
            3 => 
            array (
              'label' => 'Profil',
              'to' => '/profile',
              'icon' => 'User',
            ),
          ),
        ),
      ),
    ),
  ),
),
];
