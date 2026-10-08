import GuestLayout from '@/layouts/guest-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, router } from '@inertiajs/react';

export default function ResetPassword({ token }: { token: string }) {
    return (
        <GuestLayout>
            <div className="mb-6">
                <h1 className="text-xl font-semibold tracking-tight">Reset kata sandi</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Buat kata sandi baru untuk akun Anda.
                </p>
            </div>
            <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    // Mode demo: tidak ada backend auth, kembali ke halaman masuk.
                    router.visit('/login');
                }}
            >
                <input type="hidden" name="token" value={token} />
                <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="nama@email.com" required />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="password">Kata sandi baru</Label>
                    <Input id="password" type="password" placeholder="Minimal 8 karakter" required />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="password2">Konfirmasi kata sandi baru</Label>
                    <Input id="password2" type="password" placeholder="Ulangi kata sandi" required />
                </div>
                <Button type="submit" className="w-full">
                    Reset kata sandi
                </Button>
                <p className="text-muted-foreground text-center text-xs">
                    Mode demo, di aplikasi nyata, form ini memvalidasi token reset di backend.
                </p>
            </form>
            <p className="text-muted-foreground mt-6 text-center text-sm">
                <Link href="/login" className="text-primary font-medium hover:underline">
                    Kembali ke halaman masuk
                </Link>
            </p>
        </GuestLayout>
    );
}
