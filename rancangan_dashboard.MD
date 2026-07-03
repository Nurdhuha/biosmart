# Rancangan UI/UX Dashboard: BIOSMART Command Center (Edisi Standar Premium - Award-Winning Website)

Dokumen ini memuat spesifikasi antarmuka pengguna (UI) dan pengalaman pengguna (UX) untuk *dashboard monitoring* hibrida BIOSMART. Rancangan ini disusun menggunakan standar kegagahan visual, tata letak *grid* asimetris modern, serta detail interaksi mikro (*micro-interactions*) yang terinspirasi oleh standar situs web pemenang penghargaan tingkat dunia (*Award-Winning Websites* seperti Awwwards, CSS Design Awards, dan FWA) dengan implementasi berbasis **React + Vite**.

---

## 1. Identitas Visual, Tipografi & Desain Ambient

Untuk mencapai standar estetika premium kelas dunia, antarmuka tidak hanya menggunakan warna gelap statis, melainkan menerapkan sistem pencahayaan ambient dinamis (*Dynamic Ambient Lighting*) dan kedalaman visual berlapis (*Layered Depth*).

### A. Palet Warna Sensoris (Curated High-Contrast Palettes)
Menggunakan perpaduan gradasi warna neon yang terkalibrasi untuk mencegah tabrakan visual dan memaksimalkan keterbacaan data:

```css
:root {
  /* Obsidian Surface System */
  --bg-primary: #030406;         /* Obsidian Black (Latar belakang pekat ultra-gelap) */
  --bg-surface: #0a0c10;         /* Midnight Tint (Warna dasar komponen) */
  --bg-surface-glass: rgba(10, 12, 16, 0.7); /* Transparansi untuk blur efek kaca */
  --border-glass: rgba(255, 255, 255, 0.04); /* Border ultra-tipis untuk outline elegan */
  --border-glass-focus: rgba(255, 255, 255, 0.12);
  
  /* Gradien Status Dinamis (Dual-Tone Gradients) */
  --grad-primary: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);  /* Biru - Grid Daya */
  --grad-success: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);  /* Cyber Cyan/Emerald - Aman */
  --grad-warning: linear-gradient(135deg, #f83600 0%, #fe8c00 100%);  /* Amber/Kuning - Pengisian/Peringatan */
  --grad-danger: linear-gradient(135deg, #ff0844 0%, #ffb199 100%);   /* Merah Crimson - Kritis */
  --grad-info: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);     /* Cyan Alga */
  --grad-slurry: linear-gradient(180deg, #d97706 0%, #78350f 100%);   /* Gradasi Slurry Pupuk */
  
  /* Glow Effects (Neon Glow Drop-Shadows) */
  --glow-success: drop-shadow(0 0 8px rgba(0, 242, 254, 0.4));
  --glow-warning: drop-shadow(0 0 8px rgba(248, 54, 0, 0.4));
  --glow-danger: drop-shadow(0 0 12px rgba(255, 8, 68, 0.6));
}
```

### B. Pencahayaan Ambient Latar Belakang (Backdrop Ambient Glow)
*   **Spesifikasi:** Menempatkan dua elemen lingkaran blur besar di belakang dashboard (`filter: blur(120px); opacity: 0.15; pointer-events: none`).
*   **Perilaku Dinamis:** 
    *   *Kondisi Normal:* Lingkaran memancarkan warna biru lembut (`#3b82f6`) dan hijau (`#00f2fe`) secara perlahan berpindah koordinat.
    *   *Kondisi Terisi Baterai Penuh / Pengisian:* Berubah memancarkan warna oranye hangat (`#fe8c00`).
    *   *Kondisi Darurat:* Berubah menjadi denyut warna merah crimson (`#ff0844`) lambat di seluruh latar belakang dashboard.

### C. Skala Tipografi & Hirarki Visual
*   **Font Utama (Interface & UI):** `Outfit` (Sangat bersih, geometris, modern).
*   **Font Monospace (Data Telemetri):** `JetBrains Mono` dengan pengaturan kerning (`letter-spacing: -0.02em`).
*   **Rasio Skala Teks:**
    *   *Nilai Sensor Utama:* Ukuran font `2.5rem` - `3rem` (Outfit Bold) untuk impresi pertama yang kuat saat mata operator memindai layar.
    *   *Metadata & Unit:* Ukuran font `0.85rem` (JetBrains Mono Semibold, warna `--text-muted`), dipisahkan secara tegas agar tidak mengaburkan nilai numerik utama.

---

## 2. Arsitektur Tata Letak & Strategi Mobile-First

Untuk menjamin kenyamanan operator di lapangan yang mengakses dashboard menggunakan *smartphone*, arsitektur tata letak dikembangkan menggunakan pendekatan **Mobile-First**. Gaya bawaan dasar dioptimalkan untuk layar kecil, kemudian ditingkatkan menggunakan *Media Queries* ke layar desktop.

### A. Strategi Layout Seluler (Mobile-First Layout Viewport)
Pada layar seluler (`< 768px`), tata letak beralih menjadi kolom tunggal vertikal murni dengan penataan urutan komponen berdasarkan tingkat kepentingan operasional di lapangan:

1.  **Top Bar (Header Ringkas):** Hanya menampilkan status koneksi dan tombol alih bahasa. Widget cuaca dan waktu diringkas ke dalam ikon minimalis untuk menghemat ruang vertikal (*above the fold*).
2.  **Status Keamanan Terpaku (Sticky Security Status Card):** KPI Keamanan diletakkan paling atas. Jika status berada dalam kondisi `ALERT: LEAK DETECTED`, kartu ini akan menutupi 30% layar bagian atas dengan warna merah menyala yang berkedip, memaksa operator segera bertindak.
3.  **KPI Vital Bertumpuk (Stacked Vital KPIs):** Urutan pembacaan disederhanakan: Tekanan Gas Metana -> Kapasitas Baterai -> Output Genset.
4.  **Log Aktivitas Ringkas:** Menampilkan 3 baris log kritis terakhir saja secara bergulir untuk menghemat ruang gulir (*scroll area*).
5.  **Pengendalian Darurat Taktil:** Action Panel ditempatkan di bagian bawah dekat jangkauan jempol operator (*Thumb Zone*).
6.  **Bottom Navigation Bar (Tinggi 60px):** Menggantikan sidebar statis dengan 5 tombol ikon besar yang mudah ditekan jempol operator saat berkeliling di lapangan.

### B. Optimalisasi Sentuhan & Ergonomi Seluler (Mobile Usability)
*   **Ukuran Target Ketukan (Touch-Target Sizing):** Semua elemen interaktif (tombol kontrol, log filter, tab bahasa) memiliki target ketukan minimum **48px x 48px** dengan margin minimal **8px** untuk mencegah salah klik (*fat-finger prevention*).
*   **Swipe Gestures:** Panel informasi detail topologi dapat dibuka/tutup di seluler menggunakan gerakan sapuan layar (*swipe up* untuk membuka detail komponen, *swipe down* untuk menutup).
*   **Optimasi GPU & Baterai Mobile:** Pada perangkat seluler, efek grafik berat seperti blur kaca (`backdrop-filter`) dan pendaran lampu neon (`drop-shadow`) dinonaktifkan secara otomatis jika sistem mendeteksi mode hemat daya atau menggunakan media query `@media (max-width: 768px)` untuk mencegah perlambatan rendering (*UI lagging*).
*   **Interval Telemetri Adaptif:** Pembaruan data via WebSocket diturunkan dari 1 detik sekali (Desktop) menjadi 3 detik sekali pada koneksi seluler guna menghemat bandwidth dan daya baterai ponsel operator lapangan.

### C. Bento Grid Desktop (Asymmetric Bento Layout - >= 1200px)
Menggunakan sistem `grid-template-columns: repeat(12, 1fr)` saat layar lebar terdeteksi untuk susunan visual yang megah:

```
+----------------------------------------------------------------------------------------------------+
| SIDEBAR |  TOPBAR: Header Informasi Global (Weather & Time widget terintegrasi mulus)               |
| (1 col) |------------------------------------------------------------------------------------------|
|         |  BENTO ROW 1: KPI CARDS                                                                  |
|         |  [ Card Baterai: Col-Span 3 ] [ Card Tekanan: Col-Span 3 ] [ Card Keamanan: Col-Span 6 ] |
|         |  (Detail Grafik Mini Sparkline Terintegrasi di dalam background)                         |
|         |------------------------------------------------------------------------------------------|
|         |  BENTO ROW 2: VISUALISASI UTAMA & AI                                                     |
|         |  [                                                     ] [                               ]  |
|         |  [                                                     ] [ Card Output Listrik & Genset  ]  |
|         |  [                                                     ] [ (Col-Span 4)                  ]  |
|         |  [                                                     ] [-------------------------------]  |
|         |  [ Card Topologi Hibrida 2.5D Isometric                ] [ Card Prediksi AI Line Chart   ]  |
|         |  [ (Col-Span 8)                                        ] [ (Col-Span 4)                  ]  |
|         |  [                                                     ] [                               ]  |
|         |  [                                                     ] [-------------------------------]  |
|         |  [                                                     ] [ Insight AI (Col-Span 4)       ]  |
|         |  [                                                     ] [                               ]  |
|         |------------------------------------------------------------------------------------------|
|         |  BENTO ROW 3: EKONOMI SIRKULAR & PENGENDALIAN                                            |
|         |  [ Carbon Capture ] [ Level Slurry Tank ] [ Log Sensor & Aktivitas ] [ Override Control ]  |
|         |  [ (Col-Span 3)   ] [ (Col-Span 3)      ] [ (Col-Span 4)           ] [ (Col-Span 2)       ]  |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. Komponen Utama & Spesifikasi Fungsional

### Baris 1: KPI Cards (Indikator Vital)
Setiap card dilengkapi dengan grafik mini (*sparkline*) 1 jam terakhir tanpa sumbu X/Y untuk menangkap tren pergerakan data jangka pendek secara cepat.

#### Matriks Ambang Batas Sensor (Thresholds Matrix)
Sistem UI wajib mengubah warna visual card dan memicu event berdasarkan batas parameter berikut:

| Nama Sensor | Satuan | Rentang Aman (Hijau) | Peringatan / Warning (Kuning) | Darurat / Critical (Merah) | Failsafe Action (Otomatis) |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Tekanan Gas** | Bar | `1.0` - `2.5` | `< 1.0` (Bocor) / `2.5` - `2.8` | `> 2.8` (Overpressure) / `< 0.5` | Tutup Katup Solenoid jika > 2.8 Bar |
| **Kapasitas Baterai** | % | `20` - `95` | `10` - `20` (Low SoC) | `< 10` (Kritis) / `> 98` | Isolasi Panel Surya jika baterai > 98% |
| **Suhu Biodigester** | °C | `35` - `38` | `30` - `35` (Lambat) / `38` - `42` | `< 30` (Mati) / `> 42` (Kritis) | Aktifkan pemanas/pendingin internal |
| **Kadar Metana (CH₄)**| % | `55` - `75` | `45` - `55` (Kualitas Rendah) | `< 45` (Campuran Udara Bahaya) | Hentikan pasokan gas ke Genset |

#### Heartbeat & Indikator Sensor Offline
*   Setiap kartu KPI wajib menampilkan status **"Heartbeat"** berupa titik kecil hijau di sudut kanan bawah.
*   Jika data sensor tidak terbarui dalam waktu **> 10 detik** (indikasi kegagalan koneksi IoT / LoRA), kartu tersebut akan berubah warna menjadi abu-abu pudar (`--color-offline`), grafik sparkline dibekukan, dan teks nilai sensor menampilkan `OFFLINE` atau `NaN` untuk menghindari salah baca oleh operator.

---

## 4. Animasi, Transisi & Motion Design (Award-Winning Standard)

Semua pergerakan UI menggunakan kurva perlambatan eksponensial untuk meniru gerakan fisika alami:
```css
--transition-expo: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
```

### Detail Gerakan Interaktif
*   **Staggered Entrance:** Saat dashboard dimuat, kartu Bento Grid meluncur ke atas secara bertahap dengan penundaan *transition-delay* kelipatan `50ms` tiap kartu.
*   **Genset Rotation:** Ikon generator berputar 3D secara perlahan (`transform: rotateY(360deg)`) saat genset aktif menyalurkan daya.
*   **Slurry Wave Simulation:** Gelombang cairan pupuk menggunakan dua kurva sinus SVG dengan kecepatan rotasi berlawanan (`8s` dan `5s`) untuk menciptakan efek visual cairan organik yang realistis.

---

## 5. Visualisasi Topologi 2.5D Isometric & Efek Glow SVG

Desain topologi ditingkatkan dari skema 2D datar menjadi tampilan **2.5D Isometric** yang memberikan dimensi kedalaman spasial yang kaya.

```
                  [ Smart Grid Desa ]
                         ^
                         | (Aliran Daya Hibrida - Biru Neon)
                         |
      [ Bank Baterai ]---+---[ Genset Biogas ] <==== (Emisi CO2) ====> [ FBR Mikroalga ]
             ^                      ^
             |                      | (Pasokan Gas Metana - Hijau Neon)
      (Daya Panel Surya)            |
             |             [ Solenoid Safety Valve ]
             |                      ^
      [ Panel Surya ]               |
                                    |
                           [ Penampung Gas ]
                                    ^
                                    | (Biogas Mentah)
                                    |
                             [ Biodigester ]
                                    |
                                    v (Residu Slurry - Cokelat)
                           [ Tangki Slurry ]
```

### Detil Implementasi SVG Premium:
1.  **Isometric Grid Alignment:** Semua node digambar pada sudut proyeksi isometrik (30 derajat).
2.  **Animasi Partikel Aliran (Flow Particles):** Garis pipa/kabel SVG menggunakan efek penanda partikel berjalan (`feGaussianBlur` gabungan dengan *dasharray* bergerak) yang menunjukkan arah dan kecepatan aliran energi.
3.  **Visualisasi Node Aktif/Mati:** Node terputus akan meredup, jalur aliran terputus, dan outline menampilkan efek garis merah putus-putus berkedip lambat.

---

## 6. Keamanan Kontrol Eksklusif & Umpan Balik Akustik (Auditory Feedback)

Meningkatkan kedalaman pengalaman pengguna menggunakan sensasi fisik taktil dan bunyi presisi tinggi:

### A. Slide-to-Confirm Physics (Solenoid Valve)
*   Tombol geser penutup katup solenoid dilengkapi dengan tahanan visual (*drag resistance*). Jika diseret kurang dari 90% panjang lintasan, tombol akan memantul kembali ke posisi semula dengan efek animasi pegas (*elastic bounce transition*).
*   Gagang geser berubah warna secara dinamis dari **Biru Neon** saat mulai digeser menjadi **Merah Crimson** saat mendekati batas konfirmasi 100%.

### B. Umpan Balik Akustik (Subtle High-Tech Sounds)
Dashboard memicu bunyi sintesis pendek menggunakan **Web Audio API** untuk memberikan konfirmasi aksi:
*   *Click/Toggle:* Suara klik berfrekuensi tinggi yang sangat pendek dan sunyi (*clean micro-click*, `800Hz` selama `0.02`设备).
*   *Acknowledge Alarm:* Suara nada menurun yang menenangkan (*low-frequency sweep*, `400Hz` ke `200Hz` selama `0.3` detik).
*   *Critical Alarm:* Sirene frekuensi ganda bergelombang (*dual-tone warning*, `440Hz` & `880Hz` berselingan setiap `0.5` detik).

---

## 7. Arsitektur Proyek Frontend (React + Vite)

Dashboard ini diimplementasikan menggunakan **React** sebagai UI library dan **Vite** sebagai bundler/build tool yang cepat dan efisien.

### A. Struktur Direktori Proyek (React Directory Tree)
Struktur diorganisasikan agar komponen dapat dipakai ulang secara deklaratif (*declarative component-based*):

```
biosmart-dashboard/
│
├── package.json                # Daftar dependensi & script build (Vite)
├── vite.config.js              # Konfigurasi bundling Vite
├── index.html                  # Berkas HTML entry point utama
│
└── src/                        # Direktori utama kode sumber React
    ├── main.jsx                # Entry point rendering React DOM ke root
    ├── App.jsx                 # Kontainer utama & Pengatur State Global Dashboard
    ├── index.css               # Gaya global, variabel warna, tipografi, & animasi base
    │
    ├── context/                # Pengelola State Global (React Context API)
    │   └── DashboardContext.jsx # Mengelola state: isEmergency, currentLanguage, userRole, telemetryLogs
    │
    ├── components/             # Komponen UI Reusable
    │   ├── Sidebar.jsx         # Menu navigasi kiri (Desktop) & bottom navigation (Mobile)
    │   ├── Topbar.jsx          # Header: Jam, ramalan cuaca, toggle bahasa, profil pengguna, & Test Alarm
    │   ├── KpiCard.jsx         # Cetakan kartu KPI dengan grafik mini sparkline terintegrasi
    │   ├── Topology2D5.jsx     # Komponen SVG interaktif topologi aliran hibrida 2.5D
    │   ├── AiPredictor.jsx     # Visualisasi Chart.js untuk aktual vs prediksi AI biogas
    │   ├── CarbonGauge.jsx     # Radial gauge chart sensor penyerapan CO₂
    │   ├── SlurryTank.jsx      # visualisasi 3D tangki slurry dengan gelombang canvas cairan
    │   ├── LogsTable.jsx       # Tabel log real-time dengan filter & pencarian instan
    │   └── ControlPanel.jsx    # Override kontrol: Slide-to-confirm valve & tombol cutoff genset
    │
    ├── hooks/                  # Hooks React Kustom (Custom Hooks)
    │   ├── useAudioSynth.js    # Mengatur bunyi akustik UI & alarm menggunakan Web Audio API
    │   ├── useTelemetry.js     # Menangani koneksi WebSocket & simulator data sensor
    │   └── useTranslation.js   # Mempermudah lokalisasi bahasa (ID/EN) di setiap komponen
    │
    └── assets/                 # Aset non-code statis
        └── brand/              # Logo BIOSMART & Logo BUMDes
```

### B. Aliran Data & State Management (Data Flow Architecture)
*   **DashboardContext:** Bertindak sebagai pusat data tunggal (*Single Source of Truth*). Data telemetri sensor yang masuk dari WebSocket atau simulator didistribusikan ke komponen visual anak melalui Context Provider.
*   **useTelemetry Hook:** Secara berkala menerima data JSON dari sensor, mengevaluasi matriks batas aman (Thresholds Matrix), dan memicu flag `isEmergency = true` jika mendeteksi anomali kritis.
*   **useAudioSynth Hook:** Mendengarkan perubahan state `isEmergency` dari context global. Jika bernilai `true`, hook akan mensintesis sirene audio secara otomatis. Bunyi sirene dapat dibungkam (*muted*) secara lokal dengan memanipulasi parameter internal *gain node*.

---

## 8. Lokalisasi Bahasa (Internationalization - i18n)

Glosarium istilah untuk menjaga konsistensi istilah teknis antara Bahasa Indonesia dan Inggris:

| Istilah Bahasa Inggris (EN) | Terjemahan Bahasa Indonesia (ID) | Catatan Penggunaan |
| :--- | :--- | :--- |
| **Solenoid Valve** | Katup Solenoid | Istilah katup pengontrol gas |
| **State of Charge (SoC)** | Kapasitas Baterai | Persentase sisa daya baterai |
| **Slurry Tank** | Tangki Pupuk Cair / Residu | Tangki pembuangan biodigester |
| **Photobioreaktor (FBR)** | Fotobioreaktor Mikroalga | Reaktor penangkap CO2 |
| **Smart Grid** | Jaringan Cerdas Desa | Jaringan listrik terintegrasi hibrida |
| **Acknowledge Alarm** | Tanggapi Alarm | Aksi konfirmasi operator atas bahaya |
| **Remote Override** | Kendali Jarak Jauh | Pengambilalihan kendali manual dari dashboard |