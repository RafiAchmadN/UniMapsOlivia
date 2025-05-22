<?php
$host = "localhost";
$user = "root";
$pass = ""; // ganti sesuai password root kamu
$db   = "Registrasi";     // ganti sesuai nama database kamu

// Buat koneksi
$conn = new mysqli($host, $user, $pass, $db);

// Cek koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
echo "Koneksi berhasil!";
?>
