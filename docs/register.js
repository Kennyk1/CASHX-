// Elements
const registerForm = document.getElementById('registerForm');
const otpModal = document.getElementById('otpModal');
const otpForm = document.getElementById('otpForm');
const otpInputs = otpModal.querySelectorAll('.otp-inputs input');
const otpBackBtn = document.getElementById('otpBackBtn');
const resendCodeBtn = document.getElementById('resendCode');

// Show OTP modal on register submit instead of immediate registration
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear OTP inputs and show modal
    otpInputs.forEach(input => input.value = '');
    otpModal.classList.remove('hidden');
    otpInputs[0].focus();
});

// Back button closes OTP modal and returns to registration page
otpBackBtn.addEventListener('click', () => {
    otpModal.classList.add('hidden');
    // Optional: redirect or just hide modal
    // window.location.href = 'register.html';
});

// Resend code button placeholder
resendCodeBtn.addEventListener('click', () => {
    alert('A new OTP code has been sent to your phone.');
    otpInputs.forEach(input => input.value = '');
    otpInputs[0].focus();
});

// Auto-focus next input on typing and backspace to previous
otpInputs.forEach((input, idx) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && idx < otpInputs.length - 1) {
            otpInputs[idx + 1].focus();
        }
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '' && idx > 0) {
            otpInputs[idx - 1].focus();
        }
    });
});

// OTP form submission triggers actual registration (no real OTP verification yet)
otpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const otpCode = Array.from(otpInputs).map(input => input.value).join('');
    if (otpCode.length !== otpInputs.length) {
        alert('Please enter the complete 6-digit OTP code.');
        return;
    }

    // Proceed with registration as before
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Gather data from registration form
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        referrer: document.getElementById('referrer').value,
        country: document.getElementById('country').value,
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value,
        couponCode: document.getElementById('couponCode').value,
        packageType: document.getElementById('packageType').value,
        terms: document.getElementById('terms').checked
    };

    // Basic password length check
    if (formData.password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Redirecting to login...');
            // Optionally store token here
            // localStorage.setItem('token', data.token);
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        otpModal.classList.add('hidden'); // Hide OTP modal after attempt
    }
});

// Toggle password visibility
const togglePassword = document.querySelector('#toggleEye');
const password = document.querySelector('#password');

togglePassword.addEventListener('click', () => {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
});

// Add focus effects for inputs
const inputs = document.querySelectorAll('input, select');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
        input.parentElement.parentElement.classList.remove('focused');
    });
});

// Hamburger menu functionality
const hamburgerMenu = document.getElementById('hamburgerMenu');
const navDropdown = document.getElementById('navDropdown');

hamburgerMenu.addEventListener('click', () => {
    navDropdown.classList.toggle('active');
    const lines = hamburgerMenu.querySelectorAll('.hamburger-line');
    if (navDropdown.classList.contains('active')) {
        lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
    }
});

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!navDropdown.contains(event.target) && !hamburgerMenu.contains(event.target)) {
        navDropdown.classList.remove('active');
        const lines = hamburgerMenu.querySelectorAll('.hamburger-line');
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
    }
});
    
