<?php
// 1. Koneksi ke database
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "mitra";

$conn = mysqli_connect($host, $user, $pass, $dbname);
if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

// 2. Ambil data dari form
$nama_organisasi   = $_POST['nama_organisasi'];
$jenis             = $_POST['jenis_organisasi'];
$nama_pj           = $_POST['penanggung_jawab'];
$no_telp           = $_POST['nomor_telepon'];
$email             = $_POST['email'];
$kecamatan         = $_POST['kecamatan'];
$jenis_pelatihan   = $_POST['jenis_pelatihan'];
$deskripsi         = $_POST['deskripsi_program'];
$jadwal            = $_POST['jadwal_pelatihan'];
$kapasitas         = $_POST['kapasitas_peserta'];

// 3. Simpan ke database
$query = "INSERT INTO datab (
    nama_organisasi, jenis_organisasi, penanggung_jawab, nomor_telepon, email, kecamatan,
    jenis_pelatihan, deskripsi_program, jadwal_pelatihan, kapasitas_peserta) 
    VALUES (
    '$nama_organisasi', '$jenis', '$nama_pj', '$no_telp', '$email', 
    '$kecamatan', '$jenis_pelatihan', '$deskripsi', '$jadwal', '$kapasitas'
)";

if (mysqli_query($conn, $query)) {
    echo "<script>alert('Terima kasih! Proposal kemitraan Anda telah dikirim. Tim kami akan menghubungi Anda dalam 2-3 hari kerja.'); window.location.href='/web/Halaman/contact.html';</script>";
} else {
    echo "Terjadi kesalahan: " . mysqli_error($conn);
}

// 4. Tutup koneksi
mysqli_close($conn);
?>
