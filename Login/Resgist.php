<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $name = sanitizeInput($_POST['name'] ?? '');
    $password = $_POST['password'] ?? '';
    $saveLogin = isset($_POST['save_login']);
    
    // Validation
    $errors = [];
    
    if (empty($email) || !isValidEmail($email)) {
        $errors[] = 'Email tidak valid';
    }
    
    if (empty($name) || strlen($name) < 2) {
        $errors[] = 'Nama minimal 2 karakter';
    }
    
    if (empty($password) || strlen($password) < 6) {
        $errors[] = 'Password minimal 6 karakter';
    }
    
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
        exit;
    }
    
    $pdo = getDBConnection();
    if (!$pdo) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
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
        $verificationToken = generateSecureToken();
        
        // Insert new user
        $stmt = $pdo->prepare("
            INSERT INTO users (name, email, password, verification_token, is_active, created_at) 
            VALUES (?, ?, ?, ?, 0, NOW())
        ");
        
        $stmt->execute([$name, $email, $hashedPassword, $verificationToken]);
        $userId = $pdo->lastInsertId();
        
        // Log registration activity
        $stmt = $pdo->prepare("
            INSERT INTO user_activities (user_id, activity_type, description, created_at) 
            VALUES (?, 'registration', 'User registered', NOW())
        ");
        $stmt->execute([$userId]);
        
        // In a real application, send verification email here
        // For demo purposes, we'll just return success
        
        echo json_encode([
            'success' => true, 
            'message' => 'Registrasi berhasil! Silakan cek email untuk verifikasi.',
            'user_id' => $userId,
            'verification_token' => $verificationToken // Remove this in production
        ]);
        
    } catch(PDOException $e) {
        error_log("Registration error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan sistem']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>