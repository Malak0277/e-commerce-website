document.addEventListener('DOMContentLoaded', function() {
    let form = document.getElementById("form");
    let firstName = document.querySelector(".my-fname");
    let lastName = document.querySelector(".my-lname");
    let email = document.querySelector(".my-email");
    let pass = document.querySelector(".my-pass");
    let pass2 = document.querySelector(".my-pass2");
    
    form.addEventListener('submit', e => {
        e.preventDefault();
        console.log("Validating signup form");
        if (validateInputs()) {
            fetch('/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: firstName.value.trim(),
                    last_name: lastName.value.trim(),
                    email: email.value.trim(),
                    password: pass.value.trim()
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        alert(err.message || 'Signup failed');
                        throw new Error(err.message || 'Signup failed');
                    });
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('token', data.token);
                window.location.href = "/html/home.html";
            })
            .catch(error => {
                console.error('Error during signup:', error);
                setError(email, error.message || 'Signup failed');
            });
        }
    });
    
    const setError = (element, message) => {
        const formGroup = element.closest('.form-group');
        const errorDisplay = formGroup.querySelector('.error');
    
        errorDisplay.innerText = message;
        element.style.borderColor = "#ff3860";
        element.style.borderWidth = "2px";
        
        const inputGroup = element.closest('.input-group');
        if (inputGroup) {
            inputGroup.classList.add('is-invalid');
        }
    };
    
    const setSuccess = element => {
        const formGroup = element.closest('.form-group');
        const errorDisplay = formGroup.querySelector('.error');
    
        errorDisplay.innerText = '';
        element.style.borderColor = "#09c372";
        element.style.borderWidth = "2px";
        
        const inputGroup = element.closest('.input-group');
        if (inputGroup) {
            inputGroup.classList.remove('is-invalid');
        }
    };
    
    const isValidEmail = email => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
    
    const validateInputs = () => {
        const firstNameValue = firstName.value.trim();
        const lastNameValue = lastName.value.trim();
        const emailValue = email.value.trim();
        const passValue = pass.value.trim();
        const pass2Value = pass2.value.trim();
        let isValid = true;
        
        // First Name validation
        if (firstNameValue === '') {
            setError(firstName, "First name is required");
            isValid = false;
        } else {
            setSuccess(firstName);
        }
        
        // Last Name validation
        if (lastNameValue === '') {
            setError(lastName, "Last name is required");
            isValid = false;
        } else {
            setSuccess(lastName);
        }
        
        // Email validation
        if (emailValue === '') {
            setError(email, "Email is required");
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            setError(email, 'Please provide a valid email address');
            isValid = false;
        } else {
            setSuccess(email);
        }
        
        // Password validation
        if (passValue === '') {
            setError(pass, 'Password is required');
            isValid = false;
        } else if (passValue.length < 8) {
            setError(pass, 'Password must be at least 8 characters');
            isValid = false;
        } else {
            setSuccess(pass);
        }
        
        // Confirm Password validation
        if (pass2Value === '') {
            setError(pass2, 'Please confirm your password');
            isValid = false;
        } else if (pass2Value !== passValue) {
            setError(pass2, 'Passwords do not match');
            isValid = false;
        } else {
            setSuccess(pass2);
        }
        
        return isValid;
    };
}); 