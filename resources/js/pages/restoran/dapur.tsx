import { useMemo, useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageHeader } from '@/components/page-header';
import { ToneBadge, type ToneLabel } from '@/components/tone-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
    nama: string;
    qty: number;
}

interface Order {
    id: number;
    nomor: string;
    meja: string;
    jam: string;
    catatan: string;
    total_rp: string;
    status_label: ToneLabel;
    items: OrderItem[];
}

interface Stage {
    key: string;
    label: string;
    tone: ToneLabel['tone'];
}

const toneClasses: Record<string, string> = {
    info: 'border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/40',
    warning: 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40',
    success: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40',
    destructive: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40',
};

export default function RestoranDapur({
    stages,
    orders,
}: {
    stages: Stage[];
    orders: Record<string, any>[];
}) {
    const initial: Order[] = orders.map((o) => ({
        id: Number(o.id),
        nomor: String(o.nomor),
        meja: String(o.meja),
        jam: String(o.jam),
        catatan: String(o.catatan ?? ''),
        total_rp: String(o.total_rp),
        status_label: o.status_label as ToneLabel,
        items: (o.items as any[]).map((it) => ({ nama: String(it.nama), qty: Number(it.qty) })),
    }));

    // Peta id order -> key tahap, supaya kasir bisa memajukan order tanpa reload.
    const [stageMap, setStageMap] = useState<Record<number, string>>(
        Object.fromEntries(initial.map((o) => [o.id, o.status_label.label === 'Antri' ? 'antri' : o.status_label.label === 'Dimasak' ? 'dimasak' : o.status_label.label === 'Siap' ? 'siap' : 'disajikan']))
    );

    const byStage = useMemo(() => {
        const grouped: Record<string, Order[]> = {};
        stages.forEach((s) => {
            grouped[s.key] = initial.filter((o) => stageMap[o.id] === s.key);
        });
        return grouped;
    }, [stageMap, stages, initial]);

    const advance = (order: Order) => {
        const idx = stages.findIndex((s) => s.key === stageMap[order.id]);
        if (idx < 0 || idx === stages.length - 1) return;
        const next = stages[idx + 1];
        setStageMap((m) => ({ ...m, [order.id]: next.key }));
        toast.success(`${order.nomor} → ${next.label}`);
    };

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Order Dapur"
                description="Papan order dapur: antri, dimasak, siap, lalu disajikan."
                breadcrumbs={[{ label: 'Restoran', href: '/restoran' }, { label: 'Dapur' }]}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stages.map((stage) => {
                    const list = byStage[stage.key] ?? [];
                    const isLast = stage.key === stages[stages.length - 1].key;
                    return (
                        <Card key={stage.key} className={`shadow-sm ${toneClasses[stage.tone] ?? ''}`}>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center justify-between text-base">
                                    {stage.label}
                                    <span className="tnum bg-background rounded-full px-2.5 py-0.5 text-sm font-semibold">
                                        {list.length}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {list.length === 0 && (
                                    <p className="text-muted-foreground py-6 text-center text-sm">
                                        Tidak ada order di tahap ini.
                                    </p>
                                )}
                                {list.map((o) => (
                                    <div key={o.id} className="bg-background rounded-lg border p-3 shadow-sm">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="font-semibold text-sm">{o.nomor}</p>
                                            <span className="text-muted-foreground text-xs">
                                                {o.meja} · {o.jam}
                                            </span>
                                        </div>
                                        <ul className="mt-2 space-y-0.5">
                                            {o.items.map((it, i) => (
                                                <li key={i} className="text-sm">
                                                    <span className="tnum font-medium">{it.qty}×</span> {it.nama}
                                                </li>
                                            ))}
                                        </ul>
                                        {o.catatan && (
                                            <p className="text-muted-foreground mt-1.5 text-xs italic">
                                                Catatan: {o.catatan}
                                            </p>
                                        )}
                                        <div className="mt-2.5 flex items-center justify-between">
                                            <span className="tnum text-sm font-semibold">{o.total_rp}</span>
                                            {!isLast ? (
                                                <Button size="sm" variant="outline" onClick={() => advance(o)}>
                                                    Lanjut <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                                </Button>
                                            ) : (
                                                <span className="text-success flex items-center gap-1 text-xs font-medium">
                                                    <Check className="h-3.5 w-3.5" /> Selesai
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            <div className="mt-4">
                <ToneBadge label="Tombol Lanjut memajukan order ke tahap berikutnya" tone="info" />
            </div>
        </AuthenticatedLayout>
    );
}
