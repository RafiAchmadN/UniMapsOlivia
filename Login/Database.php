<?php
// Informasi konfigurasi database
$servername = "localhost";
$usernameDB = "root";
$passwordDB = "";
$dbname   = "webv02_db";  // ganti dengan nama database yang telah dibuat

// Membuat koneksi ke MySQL
$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname);

// Cek koneksi
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
