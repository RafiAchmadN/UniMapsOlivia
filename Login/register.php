<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "database";

$conn = mysqli_connect($host, $user, $pass, $dbname);

if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}

$email = $_POST['email'];
$username = $_POST['username'];
$password = md5($_POST['password']);

$cek = "SELECT * FROM registrasi WHERE email='$email'";
$hasil = mysqli_query($conn, $cek);

if (mysqli_num_rows($hasil) > 0) {
    echo "<script>
        alert('Email sudah digunakan. Silakan gunakan email lain.');
        window.location.href='register.php';
    </script>";
} else {
    $query = "INSERT INTO registrasi (nama, email, password) VALUES ('$username', '$email', '$password')";
    if (mysqli_query($conn, $query)) {
        echo "<script>
            alert('Registrasi berhasil! Silakan login.');
            window.location.href='Login_Unimap.html';
        </script>";
    } else {
        echo "<script>
            alert('Gagal registrasi: " . mysqli_error($conn) . "');
            window.location.href='register.php';
        </script>";
    }
}

mysqli_close($conn);
?>
