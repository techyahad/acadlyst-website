document.getElementById('zubuz-account-btn').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelectorAll('.error-message').forEach((el) => (el.textContent = ''));
    const name = document.getElementById('name').value.trim();
    const schoolName = document.getElementById('school-name').value.trim();
    const schoolEmail = document.getElementById('school-email').value.trim();
    const noOfStudents = document.getElementById('no_of_students').value.trim();
    const designation = document.getElementById('designation').value.trim();
    const mobileNumber = document.getElementById('mobile-number').value.trim();
    const city = document.getElementById('city').value.trim();
    const website = document.getElementById('website').value.trim() || 'no website';
    const address = document.getElementById('address').value.trim();
    const description = document.getElementById('description').value.trim();
    const checkbox = document.getElementById('check').checked;
    let isValid = true;
    if (!name) {
        isValid = false;
        document.getElementById('name-error').textContent = 'Name is required.';
    }
    if (!schoolName) {
        isValid = false;
        document.getElementById('school-name-error').textContent = 'School name is required.';
    }
    if (!schoolEmail) {
        isValid = false;
        document.getElementById('school-email-error').textContent = 'School email is required.';
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|edu|gov|net|co|io)$/;
        if (!emailRegex.test(schoolEmail)) {
            isValid = false;
            document.getElementById('school-email-error').textContent = 'Enter a valid email address.';
        } else {
            const domain = schoolEmail.split('@')[1];
            if (!domain) {
                isValid = false;
                document.getElementById('school-email-error').textContent = 'Invalid domain in email address.';
            } else {
                document.getElementById('school-email-error').textContent = '';
            }
        }
    }
    if (!noOfStudents) {
        isValid = false;
        document.getElementById('no_of_students-error').textContent = 'Please select the number of students.';
    }
    if (!designation) {
        isValid = false;
        document.getElementById('designation-error').textContent = 'Please select your designation.';
    }
    if (!mobileNumber) {
        isValid = false;
        document.getElementById('mobile-number-error').textContent = 'Mobile number is required.';
    } else {
        const mobileRegex = /^03[0-9]{2}-?[0-9]{7}$/;
        if (!mobileRegex.test(mobileNumber)) {
        isValid = false;
        document.getElementById('mobile-number-error').textContent =
            'Enter a valid mobile number in the format 0321-1234567 or 03211234567.';
        }
    }
    if (!city) {
        isValid = false;
        document.getElementById('city-error').textContent = 'City is required.';
    }
    if (!address) {
        isValid = false;
        document.getElementById('address-error').textContent = 'Address is required.';
    }
    if (!checkbox) {
        isValid = false;
        document.getElementById('checkbox-error').textContent = 'You must accept the terms and conditions.';
    }
    if (description.split(/\s+/).length < 50) {
        isValid = false;
        document.getElementById('description-error').textContent = 'Description must be at least 10 words.';
    }
    if (!isValid) return;
    const formData = {
        name,
        school_name: schoolName,
        school_email: schoolEmail,
        number_of_students: noOfStudents,
        designation,
        mobile_number: mobileNumber,
        city,
        website,
        address,
        description,
        status: 'pending',
    };
    fetch('http://127.0.0.1:5000/submit-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    })
        .then((response) => response.json())
        .then((data) => {
        if (data.error) {
            alert(data.error);
        } else {
            document.querySelector('form').reset();
            alert(data.message);
        }
        })
        .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while submitting the survey.');
        });
    });
    document.querySelectorAll('input, select, textarea').forEach((input) => {
    input.addEventListener('focus', () => {
        const errorId = `${input.id}-error`;
        const errorElement = document.getElementById(errorId);
        if (errorElement) errorElement.textContent = '';
    });
    input.addEventListener('input', () => {
        const errorId = `${input.id}-error`;
        const errorElement = document.getElementById(errorId);
        if (errorElement) errorElement.textContent = '';
    });
    });
    document.getElementById('description').addEventListener('input', function () {
    const wordCount = this.value.trim().split(/\s+/).length;
    document.getElementById('word-counter').textContent = wordCount;
    });