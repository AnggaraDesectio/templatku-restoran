<?php

namespace App\Support\Demo;

/**
 * Data demo RESTORAN (DapurKu): menu masakan Indonesia, order dapur,
 * reservasi meja, transaksi kasir, dan omzet.
 * Semua angka dihitung dari baris mentah supaya konsisten antar halaman.
 * Kontrak status: ['label' => .., 'tone' => ..] tanpa HTML,
 * tone ∈ success | warning | destructive | info.
 */
class RestoranData
{
    private static function rp(int $value): string
    {
        return 'Rp'.number_format($value, 0, ',', '.');
    }

    private static function ribu(int $value): int
    {
        return (int) round($value / 1000);
    }

    /** Baris mentah menu masakan Indonesia (tanpa agregat), dipakai internal agar tidak rekursi. */
    private static function menuRows(): array
    {
        return [
            ['id' => 1,  'nama' => 'Rendang Sapi',            'kategori' => 'Makanan Utama',  'harga' => 45000, 'tersedia' => true, 'gambar' => '/images/restoran/menu-1.jpg'],
            ['id' => 2,  'nama' => 'Soto Ayam Lamongan',      'kategori' => 'Sop & Kuah',     'harga' => 28000, 'tersedia' => true, 'gambar' => '/images/restoran/menu-2.jpg'],
            ['id' => 3,  'nama' => 'Nasi Goreng Spesial',     'kategori' => 'Makanan Utama',  'harga' => 32000, 'tersedia' => true, 'gambar' => '/images/restoran/menu-3.jpg'],
            ['id' => 4,  'nama' => 'Ayam Bakar Bumbu Rujak',  'kategori' => 'Makanan Utama',  'harga' => 38000, 'tersedia' => true, 'gambar' => '/images/restoran/menu-4.jpg'],
            ['id' => 5,  'nama' => 'Gado-Gado Jakarta',       'kategori' => 'Makanan Utama',  'harga' => 25000, 'tersedia' => true, 'gambar' => '/images/restoran/menu-5.jpg'],
            ['id' => 6,  'nama' => 'Ayam Goreng Kalasan',     'kategori' => 'Makanan Utama',  'harga' => 35000, 'tersedia' => true, 'gambar' => '/images/restoran/menu-6.jpg'],
            ['id' => 7,  'nama' => 'Gurame Asam Manis',       'kategori' => 'Makanan Utama',  'harga' => 58000, 'tersedia' => true, 'gambar' => '/images/restoran/menu-7.jpg'],
            ['id' => 8,  'nama' => 'Mie Ayam Bangka',         'kategori' => 'Makanan Utama',  'harga' => 22000, 'tersedia' => true, 'gambar' => '/images/restoran/menu-8.jpg'],
            ['id' => 9,  'nama' => 'Sate Ayam (10 tusuk)',    'kategori' => 'Makanan Utama',  'harga' => 30000, 'tersedia' => true, 'gambar' => '/images/restoran/menu-9.jpg'],
            ['id' => 10, 'nama' => 'Sop Buntut',              'kategori' => 'Sop & Kuah',     'harga' => 52000, 'tersedia' => true, 'gambar' => '/images/restoran/menu-10.jpg'],
            ['id' => 11, 'nama' => 'Nasi Putih',              'kategori' => 'Lauk & Pelengkap','harga' => 7000, 'tersedia' => true],
            ['id' => 12, 'nama' => 'Tahu Tempe Bacem',        'kategori' => 'Lauk & Pelengkap','harga' => 12000, 'tersedia' => true],
            ['id' => 13, 'nama' => 'Kerupuk Udang',           'kategori' => 'Lauk & Pelengkap','harga' => 7000, 'tersedia' => true],
            ['id' => 14, 'nama' => 'Pisang Goreng Keju',      'kategori' => 'Camilan',        'harga' => 16000, 'tersedia' => true, 'gambar' => '/images/restoran/menu-11.jpg'],
            ['id' => 15, 'nama' => 'Es Teh Manis',            'kategori' => 'Minuman',        'harga' => 8000,  'tersedia' => true],
            ['id' => 16, 'nama' => 'Es Jeruk Peras',          'kategori' => 'Minuman',        'harga' => 10000, 'tersedia' => true],
            ['id' => 17, 'nama' => 'Jus Alpukat',             'kategori' => 'Minuman',        'harga' => 18000, 'tersedia' => true],
            ['id' => 18, 'nama' => 'Es Campur',               'kategori' => 'Dessert',        'harga' => 15000, 'tersedia' => false, 'gambar' => '/images/restoran/menu-12.jpg'],
            ['id' => 19, 'nama' => 'Puding Cokelat Vla',      'kategori' => 'Dessert',        'harga' => 14000, 'tersedia' => true],
        ];
    }

    /** Daftar menu untuk halaman Menu & Kasir. */
    public static function menus(): array
    {
        return array_map(fn ($m) => $m + [
            'harga_rp' => self::rp($m['harga']),
            'status'   => $m['tersedia']
                ? ['label' => 'Tersedia', 'tone' => 'success']
                : ['label' => 'Habis', 'tone' => 'destructive'],
        ], self::menuRows());
    }

    private static function hargaMenu(): array
    {
        $map = [];
        foreach (self::menuRows() as $m) {
            $map[$m['id']] = ['nama' => $m['nama'], 'harga' => $m['harga']];
        }
        return $map;
    }

    /** Tahap order dapur. */
    public static function dapurStages(): array
    {
        return [
            ['key' => 'antri',     'label' => 'Antri',     'tone' => 'info'],
            ['key' => 'dimasak',   'label' => 'Dimasak',   'tone' => 'warning'],
            ['key' => 'siap',      'label' => 'Siap',      'tone' => 'success'],
            ['key' => 'disajikan', 'label' => 'Disajikan', 'tone' => 'success'],
        ];
    }

    private static function stage(string $key): array
    {
        foreach (self::dapurStages() as $s) {
            if ($s['key'] === $key) {
                return ['label' => $s['label'], 'tone' => $s['tone']];
            }
        }
        return ['label' => $key, 'tone' => 'info'];
    }

    /**
     * 10 order dapur: 2 antri, 3 dimasak, 2 siap, 3 disajikan.
     * Item merujuk ke menu id. Total dihitung dari harga menu.
     */
    private static function orderRows(): array
    {
        return [
            ['id' => 1,  'nomor' => 'ORD-101', 'meja' => 'M3',  'jam' => '11:42', 'catatan' => 'Sambal dipisah', 'status' => 'antri',     'items' => [[3, 2], [11, 2], [15, 2]]],
            ['id' => 2,  'nomor' => 'ORD-102', 'meja' => 'M7',  'jam' => '11:35', 'catatan' => '',               'status' => 'antri',     'items' => [[2, 3], [12, 3], [16, 3]]],
            ['id' => 3,  'nomor' => 'ORD-103', 'meja' => 'M1',  'jam' => '11:20', 'catatan' => 'Pedas level 3',  'status' => 'dimasak',   'items' => [[1, 2], [11, 2], [17, 1]]],
            ['id' => 4,  'nomor' => 'ORD-104', 'meja' => 'M5',  'jam' => '11:15', 'catatan' => '',               'status' => 'dimasak',   'items' => [[8, 4], [13, 4], [15, 4]]],
            ['id' => 5,  'nomor' => 'ORD-105', 'meja' => 'M2',  'jam' => '11:05', 'catatan' => 'Tanpa MSG',     'status' => 'dimasak',   'items' => [[4, 2], [9, 1], [11, 3]]],
            ['id' => 6,  'nomor' => 'ORD-106', 'meja' => 'M8',  'jam' => '10:58', 'catatan' => '',               'status' => 'siap',      'items' => [[6, 2], [14, 2], [19, 2]]],
            ['id' => 7,  'nomor' => 'ORD-107', 'meja' => 'M4',  'jam' => '10:50', 'catatan' => 'Es sedikit',     'status' => 'siap',      'items' => [[10, 1], [11, 2]]],
            ['id' => 8,  'nomor' => 'ORD-108', 'meja' => 'M6',  'jam' => '10:40', 'catatan' => '',               'status' => 'disajikan', 'items' => [[7, 1], [11, 4], [15, 4]]],
            ['id' => 9,  'nomor' => 'ORD-109', 'meja' => 'M10', 'jam' => '10:25', 'catatan' => 'Bungkus 2',      'status' => 'disajikan', 'items' => [[5, 2], [16, 2]]],
            ['id' => 10, 'nomor' => 'ORD-110', 'meja' => 'M12', 'jam' => '10:15', 'catatan' => '',               'status' => 'disajikan', 'items' => [[1, 1], [2, 1], [11, 2], [15, 2]]],
        ];
    }

    /** Order dapur dengan nama menu + total terhitung. */
    public static function orders(): array
    {
        $harga = self::hargaMenu();

        return array_map(function ($o) use ($harga) {
            $items = array_map(fn ($it) => [
                'menu_id' => $it[0],
                'qty'     => $it[1],
                'nama'    => $harga[$it[0]]['nama'],
                'harga'   => $harga[$it[0]]['harga'],
                'subtotal'=> $harga[$it[0]]['harga'] * $it[1],
            ], $o['items']);
            $o['items']       = $items;
            $o['total']       = array_sum(array_column($items, 'subtotal'));
            $o['total_rp']    = self::rp($o['total']);
            $o['status_label']= self::stage($o['status']);
            unset($o['status']);
            return $o;
        }, self::orderRows());
    }

    /** 20 meja restoran. */
    private static function mejaRows(): array
    {
        $terisi   = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8'];
        $reserved = ['M10', 'M12'];
        $rows = [];
        for ($i = 1; $i <= 20; $i++) {
            $nomor = 'M'.$i;
            $rows[] = [
                'nomor'  => $nomor,
                'status' => in_array($nomor, $terisi, true) ? 'terisi'
                    : (in_array($nomor, $reserved, true) ? 'reserved' : 'kosong'),
            ];
        }
        return $rows;
    }

    /** 10 reservasi meja hari ini. */
    public static function reservasis(): array
    {
        return [
            ['id' => 1,  'nama' => 'Andi Nugraha',      'telepon' => '0812-1111-2222', 'meja' => 'M9',  'jam' => '12:30', 'orang' => 4,  'status' => ['label' => 'Dikonfirmasi', 'tone' => 'success']],
            ['id' => 2,  'nama' => 'Sarah Wijaya',      'telepon' => '0813-3333-4444', 'meja' => 'M11', 'jam' => '13:00', 'orang' => 6,  'status' => ['label' => 'Dikonfirmasi', 'tone' => 'success']],
            ['id' => 3,  'nama' => 'Bambang Sutrisno',  'telepon' => '0815-5555-6666', 'meja' => 'M13', 'jam' => '18:30', 'orang' => 10, 'status' => ['label' => 'Menunggu', 'tone' => 'warning']],
            ['id' => 4,  'nama' => 'Keluarga Hartono',  'telepon' => '0816-7777-8888', 'meja' => 'M14', 'jam' => '19:00', 'orang' => 8,  'status' => ['label' => 'Menunggu', 'tone' => 'warning']],
            ['id' => 5,  'nama' => 'Rina Kartika',      'telepon' => '0817-9999-0000', 'meja' => 'M2',  'jam' => '12:00', 'orang' => 2,  'status' => ['label' => 'Datang', 'tone' => 'info']],
            ['id' => 6,  'nama' => 'Dimas Aryo',        'telepon' => '0818-2222-3333', 'meja' => 'M5',  'jam' => '12:15', 'orang' => 4,  'status' => ['label' => 'Datang', 'tone' => 'info']],
            ['id' => 7,  'nama' => 'Tante Lilis',       'telepon' => '0819-4444-5555', 'meja' => 'M7',  'jam' => '13:30', 'orang' => 5,  'status' => ['label' => 'Datang', 'tone' => 'info']],
            ['id' => 8,  'nama' => 'Pak RT Sukamaju',   'telepon' => '0821-6666-7777', 'meja' => 'M15', 'jam' => '17:00', 'orang' => 12, 'status' => ['label' => 'Dikonfirmasi', 'tone' => 'success']],
            ['id' => 9,  'nama' => 'Bu Sari',           'telepon' => '0822-8888-9999', 'meja' => 'M16', 'jam' => '17:30', 'orang' => 3,  'status' => ['label' => 'Batal', 'tone' => 'destructive']],
            ['id' => 10, 'nama' => 'CV Maju Jaya',      'telepon' => '0823-0000-1111', 'meja' => 'M17', 'jam' => '19:30', 'orang' => 15, 'status' => ['label' => 'Dikonfirmasi', 'tone' => 'success']],
        ];
    }

    /**
     * 8 transaksi kasir hari ini. Total = subtotal + pajak 10%,
     * subtotal dihitung dari harga menu.
     */
    private static function transaksiRows(): array
    {
        return [
            ['id' => 1, 'nomor' => 'TRX-20261008-08', 'meja' => 'M6',  'kasir' => 'Rudi',  'waktu' => '11:50', 'metode' => 'QRIS',  'items' => [[7, 1], [11, 4], [15, 4]]],
            ['id' => 2, 'nomor' => 'TRX-20261008-07', 'meja' => 'M10', 'kasir' => 'Sinta', 'waktu' => '11:35', 'metode' => 'Tunai', 'items' => [[5, 2], [16, 2]]],
            ['id' => 3, 'nomor' => 'TRX-20261008-06', 'meja' => 'M12', 'kasir' => 'Rudi',  'waktu' => '11:20', 'metode' => 'Debit', 'items' => [[1, 1], [2, 1], [11, 2], [15, 2]]],
            ['id' => 4, 'nomor' => 'TRX-20261008-05', 'meja' => 'M3',  'kasir' => 'Sinta', 'waktu' => '10:55', 'metode' => 'QRIS',  'items' => [[3, 1], [11, 1], [15, 1]]],
            ['id' => 5, 'nomor' => 'TRX-20261008-04', 'meja' => 'M8',  'kasir' => 'Rudi',  'waktu' => '10:30', 'metode' => 'Tunai', 'items' => [[9, 2], [13, 2], [15, 2]]],
            ['id' => 6, 'nomor' => 'TRX-20261008-03', 'meja' => 'M4',  'kasir' => 'Sinta', 'waktu' => '10:05', 'metode' => 'QRIS',  'items' => [[2, 2], [12, 2], [16, 2]]],
            ['id' => 7, 'nomor' => 'TRX-20261008-02', 'meja' => 'M1',  'kasir' => 'Rudi',  'waktu' => '09:40', 'metode' => 'Debit', 'items' => [[1, 1], [11, 1], [17, 1]]],
            ['id' => 8, 'nomor' => 'TRX-20261008-01', 'meja' => 'M7',  'kasir' => 'Sinta', 'waktu' => '09:15', 'metode' => 'Tunai', 'items' => [[8, 1], [11, 1], [15, 1]]],
        ];
    }

    /** Transaksi kasir dengan total terhitung (pajak 10%). */
    public static function transaksis(): array
    {
        $harga = self::hargaMenu();

        return array_map(function ($t) use ($harga) {
            $items = array_map(fn ($it) => [
                'menu_id' => $it[0],
                'qty'     => $it[1],
                'nama'    => $harga[$it[0]]['nama'],
                'harga'   => $harga[$it[0]]['harga'],
            ], $t['items']);
            $subtotal = array_sum(array_map(fn ($it) => $it['harga'] * $it['qty'], $items));
            $pajak    = (int) round($subtotal * 0.10);
            $t['items']        = $items;
            $t['subtotal']     = $subtotal;
            $t['subtotal_rp']  = self::rp($subtotal);
            $t['pajak_rp']     = self::rp($pajak);
            $t['total']        = $subtotal + $pajak;
            $t['total_rp']     = self::rp($subtotal + $pajak);
            $t['status']       = ['label' => 'Lunas', 'tone' => 'success'];
            return $t;
        }, self::transaksiRows());
    }

    /** Ringkasan angka dashboard (dihitung dari data). */
    public static function ringkasan(): array
    {
        $reservasi = array_filter(self::reservasis(), fn ($r) => $r['status']['label'] !== 'Batal');
        $orders    = self::orders();
        $aktif     = array_filter($orders, fn ($o) => in_array($o['status_label']['label'], ['Antri', 'Dimasak', 'Siap'], true));
        $mejaTerisi = count(array_filter(self::mejaRows(), fn ($m) => $m['status'] === 'terisi'));
        $omzet     = array_sum(array_column(self::transaksis(), 'total'));
        $orderBaru = count(array_filter($orders, fn ($o) => $o['status_label']['label'] === 'Antri'));

        return [
            'reservasi_hari_ini' => count($reservasi),
            'order_aktif'        => count($aktif),
            'order_antri'        => $orderBaru,
            'meja_terisi'        => $mejaTerisi,
            'meja_total'         => 20,
            'omzet'              => $omzet,
            'omzet_rp'           => self::rp($omzet),
            'transaksi_hari_ini' => count(self::transaksis()),
        ];
    }

    /** Omzet per jam hari ini (ribu Rp) untuk area chart. */
    public static function omzetPerJam(): array
    {
        $jam   = ['09:00' => 0, '10:00' => 0, '11:00' => 0];
        foreach (self::transaksis() as $t) {
            $h = substr($t['waktu'], 0, 2).':00';
            if (isset($jam[$h])) {
                $jam[$h] += $t['total'];
            }
        }

        return [
            'labels'   => array_keys($jam),
            'datasets' => [['label' => 'Omzet (ribu Rp)', 'data' => array_map(fn ($v) => self::ribu($v), array_values($jam))]],
        ];
    }

    /** 8 menu terlaris dari transaksi hari ini (jumlah porsi). */
    public static function menuTerlaris(): array
    {
        $harga = self::hargaMenu();
        $agg = [];
        foreach (self::transaksiRows() as $t) {
            foreach ($t['items'] as $it) {
                $agg[$it[0]] ??= 0;
                $agg[$it[0]] += $it[1];
            }
        }
        arsort($agg);
        $top = array_slice($agg, 0, 8, true);

        return [
            'labels'   => array_map(fn ($id) => $harga[$id]['nama'], array_keys($top)),
            'datasets' => [['label' => 'Porsi terjual', 'data' => array_values($top)]],
        ];
    }

    /** Distribusi menu per kategori untuk donut chart. */
    public static function distribusiKategori(): array
    {
        $agg = [];
        foreach (self::menuRows() as $m) {
            $agg[$m['kategori']] ??= 0;
            $agg[$m['kategori']]++;
        }

        return [
            'labels'   => array_keys($agg),
            'datasets' => [['label' => 'Menu', 'data' => array_values($agg)]],
        ];
    }

    /** Omzet 7 hari terakhir (ribu Rp) untuk laporan. */
    public static function omzetPerHari(): array
    {
        return [
            'labels'   => ['Kam', 'Jum', 'Sab', 'Min', 'Sen', 'Sel', 'Rab'],
            'datasets' => [['label' => 'Omzet (ribu Rp)', 'data' => [412, 528, 865, 913, 486, 547, self::ribu(array_sum(array_column(self::transaksis(), 'total')))]]],
        ];
    }
}
