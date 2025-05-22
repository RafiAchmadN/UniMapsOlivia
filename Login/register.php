<?php
// register.php

// Sertakan file koneksi database
require 'db_connect.php';

// Periksa apakah form telah disubmit
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Ambil nilai form
    $username = $_POST['username'];
    $email    = $_POST['email'];
    $password = $_POST['password'];

    // Validasi dasar: cek input tidak kosong
    if (empty($username) || empty($email) || empty($password)) {
        echo "Error: Semua kolom harus diisi.";
        exit();  // hentikan script jika validasi gagal
    }

    // (Opsional) Validasi format email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Error: Format email tidak valid.";
        exit();
    }

    // Enkripsi password sebelum disimpan
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    // password_hash akan menghasilkan hash 60 karakter dengan algoritma BCRYPT:contentReference[oaicite:5]{index=5}

    // Siapkan pernyataan SQL untuk insert data user baru
    $sql = "INSERT INTO users (username, email, password) 
            VALUES ('$username', '$email', '$passwordHash')";

    if ($conn->query($sql) === TRUE) {
        // Jika insert sukses
        echo "Registrasi berhasil! Silakan <a href='login.html'>login</a>.";
    } else {
        // Jika terjadi error (misal email sudah ada, dll)
        echo "Registrasi gagal: " . $conn->error;
    }
}
?>
