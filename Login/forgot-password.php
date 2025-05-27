<?php
session_start();
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    
    if (empty($email) || !isValidEmail($email)) {
        echo json_encode(['success' => false, 'message' => 'Email tidak valid']);
        exit;
    }
    
    $pdo = getDBConnection();
    if (!$pdo) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit;
    }
    
    try {
        // Check if email exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            // Generate reset token
            $token = generateSecureToken();
            $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));
            
            // Store token in database
            $stmt = $pdo->prepare("INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)");
            $stmt->execute([$email, $token, $expires]);
            
            // In a real application, you would send an email here
            // For demo purposes, we'll just return success
            echo json_encode([
                'success' => true, 
                'message' => 'Link reset password telah dikirim ke email Anda',
                'token' => $token // Remove this in production
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Email tidak ditemukan']);
        }
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Terjadi kesalahan sistem']);
    }
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - Unity Map</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #f5e6e8 0%, #e8d5d7 100%);
            min-height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .forgot-container {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 25px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            max-width: 400px;
            margin: 2rem auto;
        }
        
        .back-btn {
            color: #6c757d;
            text-decoration: none;
            margin-bottom: 1rem;
            display: inline-block;
        }
        
        .back-btn:hover {
            color: #3490dc;
        }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row justify-content-center align-items-center min-vh-100">
            <div class="col-12 col-sm-8 col-md-6 col-lg-4">
                <div class="forgot-container">
                    <a href="index.html" class="back-btn">
                        <i class="fas fa-arrow-left"></i> Kembali ke Login
                    </a>
                    
                    <h2 class="mb-4">Lupa Password</h2>
                    <p class="text-muted mb-4">Masukkan email Anda untuk menerima link reset password</p>
                    
                    <div id="alertContainer"></div>
                    
                    <form id="forgotForm">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-100">
                            <span class="spinner-border spinner-border-sm d-none" id="spinner"></span>
                            <span id="btnText">Kirim Link Reset</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.getElementById('forgotForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const btnText = document.getElementById('btnText');
            const spinner = document.getElementById('spinner');
            
            btnText.textContent = 'Mengirim...';
            spinner.classList.remove('d-none');
            
            fetch('forgot-password.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert(data.message, 'success');
                } else {
                    showAlert(data.message, 'danger');
                }
            })
            .catch(error => {
                showAlert('Terjadi kesalahan. Silakan coba lagi.', 'danger');
            })
            .finally(() => {
                btnText.textContent = 'Kirim Link Reset';
                spinner.classList.add('d-none');
            });
        });
        
        function showAlert(message, type) {
            const alertContainer = document.getElementById('alertContainer');
            alertContainer.innerHTML = `
                <div class="alert alert-${type} alert-dismissible fade show">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
        }
    </script>
</body>
</html>