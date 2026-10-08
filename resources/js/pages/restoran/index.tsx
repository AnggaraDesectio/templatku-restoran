import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { AreaChartCard, type ChartData } from '@/components/charts';
import { DataTable, type Column } from '@/components/data-table';
import { ToneBadge, type ToneLabel } from '@/components/tone-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { CalendarCheck, ChefHat, Armchair, Banknote, ShoppingCart } from 'lucide-react';

interface OrderItem {
    nama: string;
    qty: number;
}

interface Order {
    id: number;
    nomor: string;
    meja: string;
    jam: string;
    total_rp: string;
    status_label: ToneLabel;
    items: OrderItem[];
}

interface Ringkasan {
    reservasi_hari_ini: number;
    order_aktif: number;
    order_antri: number;
    meja_terisi: number;
    meja_total: number;
    omzet_rp: string;
    transaksi_hari_ini: number;
}

export default function RestoranIndex({
    ringkasan,
    omzet,
    orders,
}: {
    ringkasan: Ringkasan;
    omzet: ChartData;
    orders: Record<string, any>[];
}) {
    const rows: Order[] = orders.map((o) => ({
        id: Number(o.id),
        nomor: String(o.nomor),
        meja: String(o.meja),
        jam: String(o.jam),
        total_rp: String(o.total_rp),
        status_label: o.status_label as ToneLabel,
        items: (o.items as any[]).map((it) => ({ nama: String(it.nama), qty: Number(it.qty) })),
    }));

    const columns: Column<Order>[] = [
        { key: 'nomor', header: 'Order', sortValue: (r) => r.nomor },
        { key: 'meja', header: 'Meja', sortValue: (r) => r.meja },
        {
            key: 'items',
            header: 'Pesanan',
            render: (r) => (
                <span className="text-sm">{r.items.map((i) => `${i.qty}× ${i.nama}`).join(', ')}</span>
            ),
        },
        { key: 'jam', header: 'Jam', mobileHidden: true, sortValue: (r) => r.jam },
        {
            key: 'total_rp',
            header: 'Total',
            render: (r) => <span className="tnum font-medium">{r.total_rp}</span>,
            sortValue: (r) => r.total_rp,
        },
        {
            key: 'status_label',
            header: 'Status',
            render: (r) => <ToneBadge label={r.status_label.label} tone={r.status_label.tone} />,
        },
    ];

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Restoran DapurKu"
                description="Operasional restoran hari ini: reservasi, dapur, meja, dan omzet."
                breadcrumbs={[{ label: 'Restoran' }]}
                actions={
                    <Button size="sm" asChild>
                        <Link href="/restoran/kasir">
                            <ShoppingCart className="mr-2 h-4 w-4" /> Buka Kasir
                        </Link>
                    </Button>
                }
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Reservasi Hari Ini"
                    value={String(ringkasan.reservasi_hari_ini)}
                    delta="tamu terjadwal"
                    trend="flat"
                    icon={CalendarCheck}
                    hint="Meja yang sudah dipesan tamu untuk hari ini."
                />
                <StatCard
                    label="Order Aktif"
                    value={String(ringkasan.order_aktif)}
                    delta={`${ringkasan.order_antri} menunggu dimasak`}
                    trend="up"
                    icon={ChefHat}
                    hint="Order yang sedang berjalan di dapur saat ini."
                />
                <StatCard
                    label="Meja Terisi"
                    value={`${ringkasan.meja_terisi}/${ringkasan.meja_total}`}
                    delta="meja sedang terisi"
                    trend="flat"
                    icon={Armchair}
                    hint="Okupansi lantai: meja terisi dari total meja tersedia."
                />
                <StatCard
                    label="Omzet Hari Ini"
                    value={ringkasan.omzet_rp}
                    delta={`${ringkasan.transaksi_hari_ini} transaksi`}
                    trend="up"
                    icon={Banknote}
                    hint="Total penjualan kasir sejak buka sampai sekarang."
                />
            </div>
            <div className="mt-4">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Omzet per Jam</CardTitle>
                        <p className="text-muted-foreground text-sm">Omzet hari ini dalam ribu rupiah.</p>
                    </CardHeader>
                    <CardContent>
                        <AreaChartCard data={omzet} />
                    </CardContent>
                </Card>
            </div>
            <div className="mt-4">
                <DataTable
                    columns={columns}
                    rows={rows}
                    searchKeys={['nomor', 'meja']}
                    emptyTitle="Belum ada order"
                    emptyDescription="Order dapur akan tampil di sini setelah masuk."
                />
            </div>
        </AuthenticatedLayout>
    );
}
