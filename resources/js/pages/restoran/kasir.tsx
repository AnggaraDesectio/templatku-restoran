import { useMemo, useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageHeader } from '@/components/page-header';
import { DataTable, type Column } from '@/components/data-table';
import { ToneBadge, type ToneLabel } from '@/components/tone-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Menu {
    id: number;
    nama: string;
    kategori: string;
    harga: number;
    harga_rp: string;
    tersedia: boolean;
}

interface TransaksiItem {
    nama: string;
    qty: number;
    harga: number;
}

interface Transaksi {
    id: number;
    nomor: string;
    meja: string;
    kasir: string;
    waktu: string;
    metode: string;
    total_rp: string;
    status: ToneLabel;
    items: TransaksiItem[];
}

interface Ringkasan {
    omzet_rp: string;
    transaksi_hari_ini: number;
}

const rupiah = (n: number) => 'Rp' + n.toLocaleString('id-ID');

export default function RestoranKasir({
    ringkasan,
    menus,
    transaksis,
}: {
    ringkasan: Ringkasan;
    menus: Record<string, any>[];
    transaksis: Record<string, any>[];
}) {
    const menuList: Menu[] = menus.map((m) => ({
        id: Number(m.id),
        nama: String(m.nama),
        kategori: String(m.kategori),
        harga: Number(m.harga),
        harga_rp: String(m.harga_rp),
        tersedia: Boolean(m.tersedia),
    }));

    const [cart, setCart] = useState<Record<number, number>>({});

    const addToCart = (id: number) => {
        const menu = menuList.find((m) => m.id === id);
        if (!menu?.tersedia) {
            toast.error('Menu sedang habis.');
            return;
        }
        setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
    };

    const decQty = (id: number) =>
        setCart((c) => {
            const next = { ...c };
            if ((next[id] ?? 0) <= 1) delete next[id];
            else next[id] -= 1;
            return next;
        });

    const cartLines = useMemo(
        () =>
            Object.entries(cart)
                .map(([id, qty]) => {
                    const menu = menuList.find((m) => m.id === Number(id))!;
                    return { ...menu, qty };
                })
                .filter(Boolean),
        [cart, menuList]
    );

    const subtotal = cartLines.reduce((s, l) => s + l.harga * l.qty, 0);
    const pajak = Math.round(subtotal * 0.1);
    const total = subtotal + pajak;

    const bayar = () => {
        if (cartLines.length === 0) {
            toast.error('Keranjang masih kosong.');
            return;
        }
        toast.success(`Pembayaran ${rupiah(total)} berhasil.`);
        setCart({});
    };

    const rows: Transaksi[] = transaksis.map((t) => ({
        id: Number(t.id),
        nomor: String(t.nomor),
        meja: String(t.meja),
        kasir: String(t.kasir),
        waktu: String(t.waktu),
        metode: String(t.metode),
        total_rp: String(t.total_rp),
        status: t.status as ToneLabel,
        items: (t.items as any[]).map((it) => ({
            nama: String(it.nama),
            qty: Number(it.qty),
            harga: Number(it.harga),
        })),
    }));

    const columns: Column<Transaksi>[] = [
        { key: 'nomor', header: 'Nomor', sortValue: (r) => r.nomor },
        { key: 'waktu', header: 'Waktu', sortValue: (r) => r.waktu },
        { key: 'meja', header: 'Meja', sortValue: (r) => r.meja },
        {
            key: 'items',
            header: 'Item',
            render: (r) => (
                <span className="text-sm">{r.items.map((i) => `${i.qty}× ${i.nama}`).join(', ')}</span>
            ),
        },
        { key: 'metode', header: 'Metode', mobileHidden: true, sortValue: (r) => r.metode },
        {
            key: 'total_rp',
            header: 'Total',
            render: (r) => <span className="tnum font-medium">{r.total_rp}</span>,
            sortValue: (r) => r.total_rp,
        },
        {
            key: 'status',
            header: 'Status',
            render: (r) => <ToneBadge label={r.status.label} tone={r.status.tone} />,
        },
    ];

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Kasir"
                description={`Point of sale: ${ringkasan.transaksi_hari_ini} transaksi hari ini, omzet ${ringkasan.omzet_rp}.`}
                breadcrumbs={[{ label: 'Restoran', href: '/restoran' }, { label: 'Kasir' }]}
            />
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <Card className="shadow-sm xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Pilih Menu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {menuList.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => addToCart(m.id)}
                                    disabled={!m.tersedia}
                                    className="rounded-lg border p-3 text-left transition hover:border-primary hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-medium">{m.nama}</p>
                                        {!m.tersedia && <Badge variant="destructive">Habis</Badge>}
                                    </div>
                                    <p className="text-muted-foreground mt-0.5 text-xs">{m.kategori}</p>
                                    <p className="tnum mt-1.5 font-semibold">{m.harga_rp}</p>
                                    {cart[m.id] > 0 && (
                                        <p className="text-primary mt-1 text-xs font-medium">
                                            {cart[m.id]} di keranjang
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <ShoppingCart className="h-4 w-4" /> Keranjang
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {cartLines.length === 0 && (
                            <p className="text-muted-foreground py-6 text-center text-sm">
                                Ketuk menu untuk menambah ke keranjang.
                            </p>
                        )}
                        {cartLines.map((l) => (
                            <div key={l.id} className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">{l.nama}</p>
                                    <p className="tnum text-muted-foreground text-xs">{l.harga_rp}</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => decQty(l.id)}>
                                        <Minus className="h-3.5 w-3.5" />
                                    </Button>
                                    <span className="tnum w-6 text-center text-sm font-semibold">{l.qty}</span>
                                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => addToCart(l.id)}>
                                        <Plus className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {cartLines.length > 0 && (
                            <>
                                <div className="space-y-1 border-t pt-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="tnum">{rupiah(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Pajak 10%</span>
                                        <span className="tnum">{rupiah(pajak)}</span>
                                    </div>
                                    <div className="flex justify-between text-base font-bold">
                                        <span>Total</span>
                                        <span className="tnum">{rupiah(total)}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button className="flex-1" onClick={bayar}>
                                        Bayar
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => setCart({})}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
            <Card className="mt-4 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Transaksi Hari Ini</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        rows={rows}
                        searchKeys={['nomor', 'meja', 'metode']}
                        pageSize={10}
                        emptyTitle="Belum ada transaksi"
                        emptyDescription="Transaksi kasir hari ini akan tampil di sini."
                    />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
