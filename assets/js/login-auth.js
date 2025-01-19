// auth-login.js
document.getElementById('zubuz-account-btn').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelectorAll('.error-message').forEach((el) => (el.textContent = ''));
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    let isValid = true;
    if (!email) {
      isValid = false;
      document.getElementById('email-error').textContent = 'Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|edu|gov|net|co|io)$/;
      if (!emailRegex.test(email)) {
        isValid = false;
        document.getElementById('email-error').textContent = 'Enter a valid email address.';
      }
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!password) {
      isValid = false;
      document.getElementById('password-error').textContent = 'Password is required.';
    } else if (!passwordRegex.test(password)) {
      isValid = false;
      document.getElementById('password-error').textContent = 'Password must include at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.';
    }
    if (!isValid) return;
    const formData = { email, password };
    fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
            const userInfo = { name: data.name, email: formData.email };
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            document.querySelector('form').reset();
            alert('Login successful!');
            window.location.href = 'index.html';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while logging in.');
      });
  });


  
  