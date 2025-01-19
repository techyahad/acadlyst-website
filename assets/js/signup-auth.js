document.getElementById('zubuz-account-btn').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelectorAll('.error-message').forEach((el) => (el.textContent = ''));
    const fullName = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const re_password = document.getElementById('re-password').value.trim();
    const checkbox = document.getElementById('check').checked;
    let isValid = true;
    if (!fullName) {
        isValid = false;
        document.getElementById('fullname-error').textContent = 'Full Name is required.';
    }
    if (!email) {
        isValid = false;
        document.getElementById('email-error').textContent = 'Email is required.';
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|edu|gov|net|co|io)$/;
        if (!emailRegex.test(email)) {
            isValid = false;
            document.getElementById('email-error').textContent = 'Enter a valid email address.';
        } else {
            const domain = email.split('@')[1];
            if (!domain) {
                isValid = false;
                document.getElementById('email-error').textContent = 'Invalid domain in email address.';
            } else {
                document.getElementById('email-error').textContent = '';
            }
        }
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}\S$/;
    if (!password) {
        isValid = false;
        document.getElementById('password-error').textContent = 'Password is required.';
    } else if (!passwordRegex.test(password)) {
        isValid = false;
        document.getElementById('password-error').textContent = 'Password must include at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.';
    }
    if(!re_password){
        isValid = false;
        document.getElementById('re-password-error').textContent = "Re-password is required."
    }
    if (password !== re_password) {
        isValid = false;
        document.getElementById('re-password-error').textContent = 'Passwords do not match.';
    }
    if (!checkbox) {
        isValid = false;
        document.getElementById('checkbox-error').textContent = 'You must accept the terms and conditions.';
    }
    if (!isValid) return;
    const formData = {
        fullName,
        email,
        password
    };
    fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    })
    .then((response) => response.json()).then((data) => {
        if (data.error) {
            alert(data.error);
        } else {
            document.querySelector('form').reset();
            alert(data.message);
            window.location.href = 'sign-in.html';
        }
    }).catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while submitting the survey.');
        });
});
document.querySelectorAll('input').forEach((input) => {
    input.addEventListener('focus', () => {
        const errorId = `${input.id}-error`;
        const errorElement = document.getElementById(errorId);
        if (errorElement) errorElement.textContent = '';
    });
});
document.getElementById('check').addEventListener('change', () => {
        const errorElement = document.getElementById('checkbox-error');
        if (errorElement) errorElement.textContent = '';
});

    