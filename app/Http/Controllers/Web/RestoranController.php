<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Support\Demo\RestoranData;
use Inertia\Inertia;
use Inertia\Response;

/** Halaman-halaman Restoran DapurKu (Inertia). */
class RestoranController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('restoran/index', [
            'ringkasan' => RestoranData::ringkasan(),
            'omzet'     => RestoranData::omzetPerJam(),
            'orders'    => array_slice(RestoranData::orders(), 0, 6),
        ]);
    }

    public function reservasi(): Response
    {
        return Inertia::render('restoran/reservasi', [
            'reservasis' => RestoranData::reservasis(),
        ]);
    }

    public function dapur(): Response
    {
        return Inertia::render('restoran/dapur', [
            'stages' => RestoranData::dapurStages(),
            'orders' => RestoranData::orders(),
        ]);
    }

    public function menu(): Response
    {
        return Inertia::render('restoran/menu', [
            'menus' => RestoranData::menus(),
        ]);
    }

    public function kasir(): Response
    {
        return Inertia::render('restoran/kasir', [
            'ringkasan'   => RestoranData::ringkasan(),
            'menus'       => RestoranData::menus(),
            'transaksis'  => RestoranData::transaksis(),
        ]);
    }

    public function laporan(): Response
    {
        return Inertia::render('restoran/laporan', [
            'ringkasan'   => RestoranData::ringkasan(),
            'omzetHarian' => RestoranData::omzetPerHari(),
            'terlaris'    => RestoranData::menuTerlaris(),
            'kategori'    => RestoranData::distribusiKategori(),
        ]);
    }
}
