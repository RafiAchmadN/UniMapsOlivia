<?php
session_start();
// Path ke config.php disesuaikan berdasarkan lokasi Login2.php relatif terhadap Login/config.php
require_once 'Login/config.php'; // Menggunakan config.php dari direktori Login

header('Content-Type: application/json');

// Hapus detail koneksi database yang hardcoded
// $host = 'localhost';
// $dbname = 'uni_map';
// $username = 'root';
// $password = '';

// Gunakan fungsi getDBConnection dari config.php
$pdo = getDBConnection();

if (!$pdo) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed from config']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitasi email menggunakan fungsi dari config.php jika diinginkan,
    // namun filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL) sudah cukup baik.
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'] ?? '';

    // Validation
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Email dan password harus diisi']);
        exit;
    }

    if (!isValidEmail($email)) { // Menggunakan isValidEmail dari config.php
        echo json_encode(['success' => false, 'message' => 'Format email tidak valid']);
        exit;
    }

    try {
        // Check user credentials
        $stmt = $pdo->prepare("SELECT id, email, password, name, is_active FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            if ($user['is_active'] == 0) {
                // Pesan ini dari Resgist.php mengindikasikan akun perlu verifikasi
                // Di sini kita bisa berikan pesan yang lebih spesifik jika itu kasusnya
                echo json_encode(['success' => false, 'message' => 'Akun Anda belum aktif atau perlu verifikasi.']);
                exit;
            }

            // Set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['logged_in'] = true;

            // Update last login
            $updateStmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
            $updateStmt->execute([$user['id']]);

            echo json_encode([
                'success' => true,
                'message' => 'Login berhasil',
                'redirect' => 'dashboard.php' // Pastikan dashboard.php ada
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Email atau password salah']);
        }
    } catch(PDOException $e) {
        error_log("Login error: " . $e->getMessage()); // Tambahkan logging error
        echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan sistem']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>