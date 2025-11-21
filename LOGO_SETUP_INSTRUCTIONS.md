# 📋 Instruksi Setup Logo TopUpKilat

## Langkah 1: Save Logo ke Project

1. **Download/Save** gambar logo yang sudah Anda upload
2. **Rename** file menjadi `logo.png`
3. **Copy** file `logo.png` ke folder:
   ```
   topupkilat/public/logo.png
   ```

## Langkah 2: Update Logo Component

Setelah logo.png tersimpan, edit file:
```
topupkilat/components/Logo.tsx
```

Ubah baris ini:
```typescript
const useFallback = false; // Set to true if logo.png doesn't exist yet
```

Menjadi:
```typescript
const useFallback = false; // Logo sudah tersedia
```

## Langkah 3: Verifikasi

Logo sudah terintegrasi di halaman-halaman berikut:
- ✅ Homepage (navbar & footer)
- ✅ Semua halaman menggunakan layout yang sama

## Ukuran Logo yang Digunakan

- **Navbar:** 24x24px (sm)
- **Footer:** 24x24px (sm)
- **Halaman khusus:** 32x32px (md) atau 48x48px (lg)

## Troubleshooting

Jika logo tidak muncul:
1. Pastikan file `logo.png` ada di folder `public/`
2. Restart dev server: `npm run dev`
3. Clear browser cache (Ctrl + Shift + R)

## Build & Deploy

Setelah logo tersimpan, jalankan:
```bash
npm run build
```

Logo akan otomatis ter-bundle untuk production.
