<?php
// Start the session at the very beginning of your script
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

$host = "localhost";
$user = "root"; // Use environment variables or a config file for credentials in production
$pass = "";     // Use environment variables or a config file for credentials in production
$dbname = "database"; // Ensure this database exists

$conn = mysqli_connect($host, $user, $pass, $dbname);

if (!$conn) {
    // Store error message in session and redirect
    $_SESSION['error_message'] = "Koneksi database gagal! " . mysqli_connect_error();
    header("Location: Register_Unimap.html"); // Redirect back to registration page
    exit();
}

// Validate and sanitize inputs
$email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
$username = filter_var(trim($_POST['username']), FILTER_SANITIZE_STRING);
$password_plain = trim($_POST['password']); // Get plain password

if (empty($email) || empty($username) || empty($password_plain)) {
    $_SESSION['error_message'] = "Semua field harus diisi.";
    header("Location: Register_Unimap.html");
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $_SESSION['error_message'] = "Format email tidak valid.";
    header("Location: Register_Unimap.html");
    exit();
}

// Check password strength (basic example, enhance as needed)
if (strlen($password_plain) < 8) {
    $_SESSION['error_message'] = "Password minimal harus 8 karakter.";
    header("Location: Register_Unimap.html");
    exit();
}

// Hash the password securely
$password_hashed = password_hash($password_plain, PASSWORD_DEFAULT);

// Use prepared statements to prevent SQL injection
$cek = "SELECT email FROM registrasi WHERE email = ?";
$stmt_cek = mysqli_prepare($conn, $cek);
mysqli_stmt_bind_param($stmt_cek, "s", $email);
mysqli_stmt_execute($stmt_cek);
$hasil_cek = mysqli_stmt_get_result($stmt_cek);

if (mysqli_num_rows($hasil_cek) > 0) {
    $_SESSION['error_message'] = "Email sudah digunakan. Silakan gunakan email lain.";
    mysqli_stmt_close($stmt_cek);
    mysqli_close($conn);
    header("Location: Register_Unimap.html");
    exit();
}
mysqli_stmt_close($stmt_cek);

$query = "INSERT INTO registrasi (nama, email, password) VALUES (?, ?, ?)";
$stmt_insert = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param($stmt_insert, "sss", $username, $email, $password_hashed);

if (mysqli_stmt_execute($stmt_insert)) {
    $_SESSION['success_message'] = "Registrasi berhasil! Silakan login.";
    mysqli_stmt_close($stmt_insert);
    mysqli_close($conn);
    header("Location: Login_Unimap.html"); // Redirect to login page
    exit();
} else {
    $_SESSION['error_message'] = "Gagal registrasi: " . mysqli_error($conn);
    mysqli_stmt_close($stmt_insert);
    mysqli_close($conn);
    header("Location: Register_Unimap.html");
    exit();
}
?>