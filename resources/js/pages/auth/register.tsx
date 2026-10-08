import GuestLayout from '@/layouts/guest-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, router } from '@inertiajs/react';

export default function Register() {
    return (
        <GuestLayout>
            <div className="mb-6">
                <h1 className="text-xl font-semibold tracking-tight">Buat akun</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Daftar untuk mulai memakai dashboard.
                </p>
            </div>
            <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    // Mode demo: tidak ada backend auth, langsung masuk ke dashboard.
                    router.visit('/');
                }}
            >
                <div className="space-y-1.5">
                    <Label htmlFor="nama">Nama lengkap</Label>
                    <Input id="nama" placeholder="cth: Budi Santoso" required />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="nama@email.com" required />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="password">Kata sandi</Label>
                    <Input id="password" type="password" placeholder="Minimal 8 karakter" required />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="password2">Konfirmasi kata sandi</Label>
                    <Input id="password2" type="password" placeholder="Ulangi kata sandi" required />
                </div>
                <Button type="submit" className="w-full">
                    Daftar
                </Button>
                <p className="text-muted-foreground text-center text-xs">
                    Mode demo, di aplikasi nyata, sambungkan form ini ke auth backend Laravel Anda.
                </p>
            </form>
            <p className="text-muted-foreground mt-6 text-center text-sm">
                Sudah punya akun?{' '}
                <Link href="/login" className="text-primary font-medium hover:underline">
                    Masuk
                </Link>
            </p>
        </GuestLayout>
    );
}
