# System Description

## Role & Akses Sistem

Sistem memiliki **3 role utama**:

- **Member**
- **Sales**
- **Admin**

### Deteksi Role Saat Login
- Sistem akan mendeteksi **role user saat login**
- Berdasarkan role:
  - **Member** diarahkan ke Member Area
  - **Sales** diarahkan ke **Sales Dashboard**
  - **Admin** diarahkan ke **Admin (Master) Dashboard**
- Menu **Dashboard** hanya akan muncul untuk **Sales** dan **Admin**, sesuai dengan hak akses masing-masing

---

## 1. User Flow: Landing Page & Member Dashboard

Alur ini menggambarkan perjalanan user dari calon pembeli hingga menjadi member dan mengakses fitur eksklusif.

### A. Registrasi & Membership

**Landing Page**
- User melihat informasi:
  - Akademi
  - Store
  - Event
  - Freebies

**Join Member**
- User mengisi form:
  - Nama
  - KTP
  - Referral Code
  - Data pendukung lainnya

**Payment Gateway**
- User melakukan pembayaran sebesar **Rp99.000**
- Metode pembayaran:
  - Virtual Account
  - E-Wallet
  - Credit Card

**Success State**
- Akun user aktif sebagai **Member**
- Sistem otomatis memberikan **49.000 Poin Myola**
- Sales pemilik referral code menerima notifikasi komisi

---

### B. Belanja di Store (Checkout)

**Non-Member**
- Pilih Produk  
- Masuk Keranjang  
- Checkout  
- Harga Normal  
- Tidak mendapatkan cashback poin  

**Member**
- Pilih Produk  
- Masuk Keranjang  
- Checkout  
- Opsi **Redeem Poin**  
- Melakukan pembayaran  
- Mendapatkan cashback poin (sesuai data produk)  

---

### C. Akademi (Learning Path)

- User masuk ke menu **Akademi**

**Jika Member**
- Klik Course
- Melihat daftar Lesson
- Play Video Module
- Progress tersimpan otomatis di menu **Kelas Saya**

**Jika Bukan Member**
- Video dalam kondisi **Locked**
- Tidak dapat diputar

---

## 2. Master Dashboard (Admin System)

Dashboard khusus **Admin** untuk mengelola seluruh ekosistem konten dan transaksi.

### Menu Utama Master

**Manajemen Produk**
- CRUD Produk
- Pengaturan:
  - Harga
  - Stok
  - Nilai cashback

**Manajemen Akademi**
- Upload:
  - Course
  - Lesson
  - Video Module
- Input metadata:
  - `skillsGained`
  - `whatYouLearn`

**Manajemen Event**
- Kelola:
  - Event
  - Harga tiket
  - Kuota peserta

**Manajemen Order**
- Daftar order masuk (Produk & Event)
- Update status order:
  - `sedang_diproses`
  - `sedang_dikirim`
  - `selesai`
- Upload bukti pengiriman

**Manajemen User & Sales**
- Daftar Member (termasuk data KTP)
- Daftar Sales & Referral Code
- Laporan Komisi:
  - Perhitungan otomatis **7%** dari transaksi member di bawah sales terkait

---

## 3. Sales Dashboard

Dashboard khusus **Sales**, fokus pada performa referral dan komisi.

### Menu Utama Sales

**Profil Sales**
- Nama
- Email
- Nomor HP
- Referral Code aktif

**Daftar Member**
- List user yang mendaftar menggunakan referral code sales

**Detail Komisi**
- Log komisi Join Member (flat rate)
- Log komisi transaksi:
  - **7%** dari nilai belanja member
- Total saldo komisi
- Status penarikan / payout

---

## 4. Akses & Hak Istimewa per Role

| Role   | Akses Utama |
|------|------------|
| Member | Belanja, Akademi, Event, Redeem & Earn Poin |
| Sales  | Sales Dashboard, Referral Tracking, Komisi |
| Admin  | Master Dashboard, Full CRUD & Reporting |

> Prinsip utama: **role menentukan pengalaman**, bukan cuma hak akses, tapi juga alur dan menu yang muncul di sistem.
