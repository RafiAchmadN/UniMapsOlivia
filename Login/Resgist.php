<?php
session_start();
require_once 'config.php'; // Path ini sudah benar jika Resgist.php dan config.php ada di direktori Login/

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $name = sanitizeInput($_POST['name'] ?? ''); // Menggunakan sanitizeInput dari config.php
    $password = $_POST['password'] ?? '';
    // $saveLogin = isset($_POST['save_login']); // Variabel ini tidak digunakan di backend

    // Validation
    $errors = [];

    if (empty($email) || !isValidEmail($email)) { // Menggunakan isValidEmail dari config.php
        $errors[] = 'Email tidak valid';
    }

    if (empty($name) || strlen($name) < 2) {
        $errors[] = 'Nama minimal 2 karakter';
    }

    // Validasi panjang password menggunakan konstanta dari config.php
    if (empty($password) || strlen($password) < PASSWORD_MIN_LENGTH) {
        $errors[] = 'Password minimal ' . PASSWORD_MIN_LENGTH . ' karakter';
    }

    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
        exit;
    }

    $pdo = getDBConnection();
    if (!$pdo) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed from config']);
        exit;
    }

    try {
        // Check if email already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);

        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Email sudah terdaftar']);
            exit;
        }

        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Generate verification token
        $verificationToken = generateSecureToken(); // Menggunakan generateSecureToken dari config.php

        // Insert new user, is_active di set ke 0 (inactive) menunggu verifikasi
        $stmt = $pdo->prepare("
            INSERT INTO users (name, email, password, verification_token, is_active, created_at)
            VALUES (?, ?, ?, ?, 0, NOW())
        ");

        $stmt->execute([$name, $email, $hashedPassword, $verificationToken]);
        $userId = $pdo->lastInsertId();

        // Log registration activity
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;

        $stmt = $pdo->prepare("
            INSERT INTO user_activities (user_id, activity_type, description, ip_address, user_agent, created_at)
            VALUES (?, 'registration', 'User registered', ?, ?, NOW())
        ");
        $stmt->execute([$userId, $ipAddress, $userAgent]);

        // Di aplikasi production, kirim email verifikasi di sini menggunakan $verificationToken
        // Contoh: sendVerificationEmail($email, $verificationToken);
        // Fungsi sendVerificationEmail perlu dibuat dan menggunakan setting SMTP dari config.php

        echo json_encode([
            'success' => true,
            'message' => 'Registrasi berhasil! Silakan cek email untuk verifikasi (fitur email belum diimplementasikan).',
            'user_id' => $userId
            // 'verification_token' => $verificationToken // Sebaiknya tidak dikirim ke client di production
        ]);

    } catch(PDOException $e) {
        error_log("Registration error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan sistem saat registrasi']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>