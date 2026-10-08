import { useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageHeader } from '@/components/page-header';
import { DataTable, type Column, type FilterOption } from '@/components/data-table';
import { ToneBadge, type ToneLabel } from '@/components/tone-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Menu {
    id: number;
    nama: string;
    kategori: string;
    harga: number;
    harga_rp: string;
    tersedia: boolean;
    gambar?: string;
    status: ToneLabel;
}

const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

export default function RestoranMenu({ menus }: { menus: Record<string, any>[] }) {
    const [rows, setRows] = useState<Menu[]>(
        menus.map((m) => ({
            id: Number(m.id),
            nama: String(m.nama),
            kategori: String(m.kategori),
            harga: Number(m.harga),
            harga_rp: String(m.harga_rp),
            tersedia: Boolean(m.tersedia),
            gambar: m.gambar ? String(m.gambar) : undefined,
            status: m.status as ToneLabel,
        })),
    );
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Menu | null>(null);
    const [nama, setNama] = useState('');
    const [kategori, setKategori] = useState('');
    const [harga, setHarga] = useState('');
    const [tersedia, setTersedia] = useState(true);

    const kategoris = Array.from(new Set(rows.map((r) => r.kategori)));

    const openAdd = () => {
        setEditing(null);
        setNama('');
        setKategori(kategoris[0] ?? '');
        setHarga('');
        setTersedia(true);
        setOpen(true);
    };

    const openEdit = (row: Menu) => {
        setEditing(row);
        setNama(row.nama);
        setKategori(row.kategori);
        setHarga(String(row.harga));
        setTersedia(row.tersedia);
        setOpen(true);
    };

    const simpan = () => {
        const hargaNum = Number(harga.replace(/[^0-9]/g, ''));
        if (!nama.trim() || !kategori.trim() || !hargaNum) {
            toast.error('Lengkapi nama, kategori, dan harga menu.');
            return;
        }
        const status: ToneLabel = tersedia
            ? { label: 'Tersedia', tone: 'success' }
            : { label: 'Habis', tone: 'destructive' };
        if (editing) {
            setRows((rs) =>
                rs.map((r) =>
                    r.id === editing.id
                        ? { ...r, nama: nama.trim(), kategori: kategori.trim(), harga: hargaNum, harga_rp: rupiah(hargaNum), tersedia, status }
                        : r,
                ),
            );
            toast.success(`Menu "${nama.trim()}" diperbarui.`);
        } else {
            const id = Math.max(0, ...rows.map((r) => r.id)) + 1;
            setRows((rs) => [
                {
                    id,
                    nama: nama.trim(),
                    kategori: kategori.trim(),
                    harga: hargaNum,
                    harga_rp: rupiah(hargaNum),
                    tersedia,
                    status,
                },
                ...rs,
            ]);
            toast.success(`Menu "${nama.trim()}" ditambahkan ke daftar.`);
        }
        setOpen(false);
    };

    const columns: Column<Menu>[] = [
        {
            key: 'gambar',
            header: '',
            render: (r) =>
                r.gambar ? (
                    <img
                        src={r.gambar}
                        alt={r.nama}
                        className="h-10 w-10 rounded-md object-cover"
                        loading="lazy"
                    />
                ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                ),
        },
        { key: 'nama', header: 'Nama Masakan', sortValue: (r) => r.nama },
        { key: 'kategori', header: 'Kategori', mobileHidden: true, sortValue: (r) => r.kategori },
        {
            key: 'harga_rp',
            header: 'Harga',
            render: (r) => <span className="tnum font-medium">{r.harga_rp}</span>,
            sortValue: (r) => r.harga,
        },
        {
            key: 'status',
            header: 'Ketersediaan',
            render: (r) => <ToneBadge label={r.status.label} tone={r.status.tone} />,
        },
    ];

    const filters: FilterOption[] = [
        {
            key: 'kategori',
            label: 'Kategori',
            options: kategoris.map((k) => ({ value: k, label: k })),
            match: (row: any, value: string) => row.kategori === value,
        },
        {
            key: 'status',
            label: 'Ketersediaan',
            options: [
                { value: 'Tersedia', label: 'Tersedia' },
                { value: 'Habis', label: 'Habis' },
            ],
            match: (row: any, value: string) => row.status.label === value,
        },
    ];

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Menu"
                description="Daftar menu masakan beserta harga dan ketersediaan hari ini."
                breadcrumbs={[{ label: 'Restoran', href: '/restoran' }, { label: 'Menu' }]}
                actions={
                    <Button size="sm" onClick={openAdd}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Menu
                    </Button>
                }
            />
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Semua Menu</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        rows={rows}
                        searchKeys={['nama', 'kategori']}
                        filters={filters}
                        pageSize={12}
                        onEdit={openEdit}
                        emptyTitle="Belum ada menu"
                        emptyDescription="Tambahkan menu pertama lewat tombol Tambah Menu, menu baru langsung tampil di kasir."
                    />
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Ubah Menu' : 'Tambah Menu Baru'}</DialogTitle>
                        <DialogDescription>
                            {editing
                                ? 'Perbarui nama, harga, atau ketersediaan menu.'
                                : 'Isi detail menu, langsung tersimpan di daftar ini.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="menu-nama">Nama masakan</Label>
                            <Input
                                id="menu-nama"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder="cth. Ayam Goreng Mentega"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="menu-kategori">Kategori</Label>
                            <Select value={kategori} onValueChange={setKategori}>
                                <SelectTrigger id="menu-kategori">
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kategoris.map((k) => (
                                        <SelectItem key={k} value={k}>
                                            {k}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="menu-harga">Harga (Rp)</Label>
                                <Input
                                    id="menu-harga"
                                    inputMode="numeric"
                                    value={harga}
                                    onChange={(e) => setHarga(e.target.value)}
                                    placeholder="25000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tersedia hari ini</Label>
                                <div className="flex h-10 items-center gap-2">
                                    <Switch checked={tersedia} onCheckedChange={setTersedia} />
                                    <span className="text-sm">{tersedia ? 'Tersedia' : 'Habis'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={simpan}>{editing ? 'Simpan Perubahan' : 'Tambah Menu'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
