import GuestLayout from '@/layouts/guest-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, router } from '@inertiajs/react';

export default function Login() {
    return (
        <GuestLayout>
            <div className="mb-6">
                <h1 className="text-xl font-semibold tracking-tight">Masuk</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Selamat datang kembali! Silakan masuk ke akun Anda.
                </p>
            </div>
            <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    // Mode demo: tidak ada backend auth, langsung masuk ke dashboard CMS.
                    router.visit('/dashboard');
                }}
            >
                <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="nama@email.com" required />
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Kata sandi</Label>
                        <Link href="/forgot-password" className="text-primary text-xs hover:underline">
                            Lupa kata sandi?
                        </Link>
                    </div>
                    <Input id="password" type="password" placeholder="••••••••" required />
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox id="ingat" />
                    <Label htmlFor="ingat" className="font-normal">Ingat saya</Label>
                </div>
                <Button type="submit" className="w-full">
                    Masuk
                </Button>
                <p className="text-muted-foreground text-center text-xs">
                    Mode demo, di aplikasi nyata, sambungkan form ini ke auth backend Laravel Anda.
                </p>
            </form>
            <p className="text-muted-foreground mt-6 text-center text-sm">
                Belum punya akun?{' '}
                <Link href="/register" className="text-primary font-medium hover:underline">
                    Daftar
                </Link>
            </p>
        </GuestLayout>
    );
}
