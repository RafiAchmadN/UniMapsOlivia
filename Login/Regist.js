       // Password toggle functionality
        document.getElementById('togglePassword').addEventListener('click', function() {
            const passwordField = document.getElementById('password');
            const toggleIcon = this.querySelector('i');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
        });

        // Password strength checker
        document.getElementById('password').addEventListener('input', function() {
            const password = this.value;
            const strengthIndicator = document.getElementById('passwordStrength');
            
            if (password.length === 0) {
                strengthIndicator.textContent = '';
                return;
            }
            
            let strength = 0;
            
            // Length check
            if (password.length >= 8) strength++;
            
            // Uppercase check
            if (/[A-Z]/.test(password)) strength++;
            
            // Lowercase check
            if (/[a-z]/.test(password)) strength++;
            
            // Number check
            if (/\d/.test(password)) strength++;
            
            // Special character check
            if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
            
            if (strength <= 2) {
                strengthIndicator.textContent = 'Weak';
                strengthIndicator.className = 'password-strength strength-weak';
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            } else if (strength <= 3) {
                strengthIndicator.textContent = 'Medium';
                strengthIndicator.className = 'password-strength strength-medium';
                this.classList.remove('is-invalid');
                this.classList.remove('is-valid');
            } else {
                strengthIndicator.textContent = 'Strong';
                strengthIndicator.className = 'password-strength strength-strong';
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });

        // Form validation
        const form = document.getElementById('registerForm');
        const emailField = document.getElementById('email');
        const nameField = document.getElementById('name');
        const passwordField = document.getElementById('password');

        // Email validation
        emailField.addEventListener('blur', function() {
            const email = this.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.classList.add('is-invalid');
                this.nextElementSibling.textContent = 'Format email tidak valid';
            } else if (email) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });

        // Name validation
        nameField.addEventListener('blur', function() {
            const name = this.value.trim();
            
            if (name.length < 2) {
                this.classList.add('is-invalid');
                this.nextElementSibling.textContent = 'Nama minimal 2 karakter';
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = document.getElementById('registerText');
            const spinner = document.getElementById('registerSpinner');
            const alertContainer = document.getElementById('alertContainer');
            
            // Show loading state
            submitBtn.textContent = 'Mendaftar...';
            spinner.classList.remove('d-none');
            
            // Clear previous alerts
            alertContainer.innerHTML = '';
            
            // Send AJAX request
            fetch('register.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert('Registrasi berhasil! Silakan cek email untuk verifikasi.', 'success');
                    form.reset();
                    
                    // Redirect after 2 seconds
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    showAlert(data.message || 'Registrasi gagal. Silakan coba lagi.', 'danger');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Terjadi kesalahan. Silakan coba lagi.', 'danger');
            })
            .finally(() => {
                // Reset button state
                submitBtn.textContent = 'Daftar';
                spinner.classList.add('d-none');
            });
        });

        // Show alert function
        function showAlert(message, type) {
            const alertContainer = document.getElementById('alertContainer');
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
            alertDiv.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            alertContainer.appendChild(alertDiv);
            
            // Auto dismiss after 5 seconds
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 5000);
        }

        // Auto-focus on email field
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('email').focus();
        });