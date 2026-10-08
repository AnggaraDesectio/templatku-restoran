import { useState } from 'react';
import GuestLayout from '@/layouts/guest-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@inertiajs/react';
import { ArrowLeft, MailCheck } from 'lucide-react';

export default function ForgotPassword() {
    const [sent, setSent] = useState(false);

    return (
        <GuestLayout>
            <div className="mb-6">
                <h1 className="text-xl font-semibold tracking-tight">Lupa kata sandi</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Masukkan email Anda, kami kirimkan tautan reset.
                </p>
            </div>
            {sent ? (
                <div className="space-y-4 text-center">
                    <MailCheck className="text-success mx-auto h-10 w-10" />
                    <p className="text-sm">
                        Jika email Anda terdaftar, tautan reset sudah dikirim. Silakan cek kotak
                        masuk (dan folder spam).
                    </p>
                    <p className="text-muted-foreground text-xs">
                        Mode demo, di aplikasi nyata, tautan dikirim oleh backend Laravel Anda.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/login">Kembali ke halaman masuk</Link>
                    </Button>
                </div>
            ) : (
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        setSent(true);
                    }}
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="nama@email.com" required />
                    </div>
                    <Button type="submit" className="w-full">
                        Kirim tautan reset
                    </Button>
                </form>
            )}
            {!sent && (
                <Link
                    href="/login"
                    className="text-muted-foreground mt-6 inline-flex items-center gap-1.5 text-sm hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali ke halaman masuk
                </Link>
            )}
        </GuestLayout>
    );
}
