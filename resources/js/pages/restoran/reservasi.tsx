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
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Reservasi {
    id: number;
    nama: string;
    telepon: string;
    meja: string;
    jam: string;
    orang: number;
    status: ToneLabel;
}

const statusTone = (s: string): ToneLabel['tone'] =>
    s === 'Dikonfirmasi' ? 'success' : s === 'Datang' ? 'info' : s === 'Batal' ? 'destructive' : 'warning';

const STATUS = ['Menunggu', 'Dikonfirmasi', 'Datang', 'Batal'];

export default function RestoranReservasi({ reservasis }: { reservasis: Record<string, any>[] }) {
    const [rows, setRows] = useState<Reservasi[]>(
        reservasis.map((r) => ({
            id: Number(r.id),
            nama: String(r.nama),
            telepon: String(r.telepon),
            meja: String(r.meja),
            jam: String(r.jam),
            orang: Number(r.orang),
            status: r.status as ToneLabel,
        })),
    );
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Reservasi | null>(null);
    const [nama, setNama] = useState('');
    const [telepon, setTelepon] = useState('');
    const [meja, setMeja] = useState('');
    const [jam, setJam] = useState('');
    const [orang, setOrang] = useState('2');
    const [status, setStatus] = useState('Menunggu');

    const openAdd = () => {
        setEditing(null);
        setNama('');
        setTelepon('');
        setMeja('');
        setJam('');
        setOrang('2');
        setStatus('Menunggu');
        setOpen(true);
    };

    const openEdit = (row: Reservasi) => {
        setEditing(row);
        setNama(row.nama);
        setTelepon(row.telepon);
        setMeja(row.meja);
        setJam(row.jam);
        setOrang(String(row.orang));
        setStatus(row.status.label);
        setOpen(true);
    };

    const simpan = () => {
        if (!nama.trim() || !meja.trim() || !jam.trim()) {
            toast.error('Lengkapi nama tamu, nomor meja, dan jam kedatangan.');
            return;
        }
        const payload = {
            nama: nama.trim(),
            telepon: telepon.trim(),
            meja: meja.trim(),
            jam: jam.trim(),
            orang: Math.max(1, Number(orang) || 1),
            status: { label: status, tone: statusTone(status) } as ToneLabel,
        };
        if (editing) {
            setRows((rs) => rs.map((r) => (r.id === editing.id ? { ...r, ...payload } : r)));
            toast.success(`Reservasi ${nama.trim()} diperbarui.`);
        } else {
            const id = Math.max(0, ...rows.map((r) => r.id)) + 1;
            setRows((rs) => [{ id, ...payload }, ...rs]);
            toast.success(`Meja ${meja.trim()} dicatat untuk ${nama.trim()} pukul ${jam.trim()}.`);
        }
        setOpen(false);
    };

    const columns: Column<Reservasi>[] = [
        { key: 'nama', header: 'Nama Tamu', sortValue: (r) => r.nama },
        { key: 'telepon', header: 'Telepon', mobileHidden: true },
        { key: 'meja', header: 'Meja', sortValue: (r) => r.meja },
        { key: 'jam', header: 'Jam', sortValue: (r) => r.jam },
        {
            key: 'orang',
            header: 'Orang',
            render: (r) => <span className="tnum">{r.orang} orang</span>,
            sortValue: (r) => r.orang,
        },
        {
            key: 'status',
            header: 'Status',
            render: (r) => <ToneBadge label={r.status.label} tone={r.status.tone} />,
        },
    ];

    const filters: FilterOption[] = [
        {
            key: 'status',
            label: 'Status',
            options: STATUS.map((s) => ({ value: s, label: s })),
            match: (row: any, value: string) => row.status.label === value,
        },
    ];

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Reservasi Meja"
                description="Siapa datang jam berapa, catat reservasi agar meja tidak bentrok."
                breadcrumbs={[{ label: 'Restoran', href: '/restoran' }, { label: 'Reservasi' }]}
                actions={
                    <Button size="sm" onClick={openAdd}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Reservasi
                    </Button>
                }
            />
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Semua Reservasi</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        rows={rows}
                        searchKeys={['nama', 'meja', 'telepon']}
                        filters={filters}
                        pageSize={10}
                        onEdit={openEdit}
                        emptyTitle="Belum ada reservasi"
                        emptyDescription="Catat reservasi pertama lewat tombol Tambah Reservasi, meja dan jam langsung tercatat."
                    />
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Ubah Reservasi' : 'Reservasi Baru'}</DialogTitle>
                        <DialogDescription>
                            Catat tamu yang memesan meja, status awal "Menunggu" konfirmasi.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2 sm:col-span-1">
                            <Label htmlFor="res-nama">Nama tamu</Label>
                            <Input
                                id="res-nama"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder="cth. Ibu Ratna"
                            />
                        </div>
                        <div className="col-span-2 space-y-2 sm:col-span-1">
                            <Label htmlFor="res-telp">Nomor telepon</Label>
                            <Input
                                id="res-telp"
                                inputMode="tel"
                                value={telepon}
                                onChange={(e) => setTelepon(e.target.value)}
                                placeholder="08xx…"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="res-meja">Nomor meja</Label>
                            <Input
                                id="res-meja"
                                value={meja}
                                onChange={(e) => setMeja(e.target.value)}
                                placeholder="cth. A5"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="res-jam">Jam kedatangan</Label>
                            <Input
                                id="res-jam"
                                type="time"
                                value={jam}
                                onChange={(e) => setJam(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="res-orang">Jumlah orang</Label>
                            <Input
                                id="res-orang"
                                inputMode="numeric"
                                value={orang}
                                onChange={(e) => setOrang(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="res-status">Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger id="res-status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={simpan}>{editing ? 'Simpan Perubahan' : 'Catat Reservasi'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
