import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { AreaChartCard, BarChartCard, DonutChartCard, type ChartData } from '@/components/charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, CalendarCheck, ChefHat, Receipt } from 'lucide-react';

interface Ringkasan {
    omzet_rp: string;
    transaksi_hari_ini: number;
    order_aktif: number;
    reservasi_hari_ini: number;
}

export default function RestoranLaporan({
    ringkasan,
    omzetHarian,
    terlaris,
    kategori,
}: {
    ringkasan: Ringkasan;
    omzetHarian: ChartData;
    terlaris: ChartData;
    kategori: ChartData;
}) {
    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Laporan"
                description="Laporan omzet, menu terlaris, dan distribusi kategori menu."
                breadcrumbs={[{ label: 'Restoran', href: '/restoran' }, { label: 'Laporan' }]}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Omzet Hari Ini" value={ringkasan.omzet_rp} delta="termasuk pajak 10%" trend="up" icon={Banknote} />
                <StatCard label="Transaksi" value={String(ringkasan.transaksi_hari_ini)} delta="transaksi hari ini" trend="flat" icon={Receipt} />
                <StatCard label="Order Aktif" value={String(ringkasan.order_aktif)} delta="di dapur saat ini" trend="flat" icon={ChefHat} />
                <StatCard label="Reservasi" value={String(ringkasan.reservasi_hari_ini)} delta="meja terjadwal" trend="flat" icon={CalendarCheck} />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
                <Card className="shadow-sm xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Omzet 7 Hari Terakhir</CardTitle>
                        <p className="text-muted-foreground text-sm">Dalam ribu rupiah.</p>
                    </CardHeader>
                    <CardContent>
                        <AreaChartCard data={omzetHarian} />
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Menu per Kategori</CardTitle>
                        <p className="text-muted-foreground text-sm">Jumlah menu aktif.</p>
                    </CardHeader>
                    <CardContent>
                        <DonutChartCard data={kategori} />
                    </CardContent>
                </Card>
            </div>
            <Card className="mt-4 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Menu Terlaris Hari Ini</CardTitle>
                    <p className="text-muted-foreground text-sm">Berdasarkan porsi terjual dari transaksi kasir.</p>
                </CardHeader>
                <CardContent>
                    <BarChartCard data={terlaris} />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
