<?php
// Start the session at the very beginning
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

$host = "localhost";
$user = "root"; // Use environment variables or a config file for credentials in production
$pass = "";     // Use environment variables or a config file for credentials in production
$dbname = "database"; // Ensure this database exists

$conn = mysqli_connect($host, $user, $pass, $dbname);

if (!$conn) {
    $_SESSION['error_message'] = "Koneksi database gagal! " . mysqli_connect_error();
    header("Location: Login_Unimap.html"); // Redirect back to login page
    exit();
}

// Validate and sanitize inputs
$email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
$password_plain = trim($_POST['password']);

if (empty($email) || empty($password_plain)) {
    $_SESSION['error_message'] = "Email dan password harus diisi.";
    header("Location: Login_Unimap.html");
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $_SESSION['error_message'] = "Format email tidak valid.";
    header("Location: Login_Unimap.html");
    exit();
}

// Use prepared statements
$query = "SELECT id, nama, email, password FROM registrasi WHERE email = ?";
$stmt = mysqli_prepare($conn, $query);
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($user_data = mysqli_fetch_assoc($result)) {
    // Verify the password
    if (password_verify($password_plain, $user_data['password'])) {
        // Password is correct, set session variables
        $_SESSION['user_id'] = $user_data['id'];
        $_SESSION['username'] = $user_data['nama'];
        $_SESSION['user_email'] = $user_data['email'];
        $_SESSION['logged_in'] = true;

        mysqli_stmt_close($stmt);
        mysqli_close($conn);
        // Redirect to a dashboard or home page after successful login
        header("Location: ../index.html"); // Redirect to main homepage
        exit();
    } else {
        // Incorrect password
        $_SESSION['error_message'] = "Email atau password salah.";
    }
} else {
    // Email not found
    $_SESSION['error_message'] = "Email atau password salah.";
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
header("Location: Login_Unimap.html"); // Redirect back to login page with error
exit();
?>