<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "database";

$conn = mysqli_connect($host, $user, $pass, $dbname);

if (!$conn) {
    die("Koneksi gagal! " . mysqli_connect_error());
}

$email = $_POST['email'];
$password = md5($_POST['password']);

$query = "SELECT * FROM registrasi WHERE email='$email' AND Password='$password'";
$result = mysqli_query($conn, $query) or die("Query error: " . mysqli_error($conn));

if (mysqli_num_rows($result) > 0) {
    echo "<div class='notif success'>Login berhasil. Selamat datang!</div>";
} else {
    echo "<div class='notif error'>Email atau password salah.</div>";
}

mysqli_close($conn);
?>
