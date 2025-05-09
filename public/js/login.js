document.addEventListener('DOMContentLoaded', function() {
    let form = document.getElementById("form");
    let email = document.querySelector(".my-email");
    let pass = document.querySelector(".my-pass");
    
    form.addEventListener('submit', e => {
        e.preventDefault();
        console.log("Validating login form");
        validateInputs();
    });
    
    const setError = (element, message) => {
        const formGroup = element.closest('.form-group');
        const errorDisplay = formGroup.querySelector('.error');
    
        errorDisplay.innerText = message;
        element.style.borderColor = "#ff3860";
        element.style.borderWidth = "2px";
        
        // Also add error class to input group if it exists
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
        
        // Remove error class from input group if it exists
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
        const emailValue = email.value.trim();
        const passValue = pass.value.trim();
        let isValid = true;
        
        if (emailValue === '') {
            setError(email, "Email is required");
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            setError(email, 'Please provide a valid email address');
            isValid = false;
        } else {
            setSuccess(email);
        }
        
        if (passValue === '') {
            setError(pass, 'Password is required');
            isValid = false;
        } else if (passValue.length < 8) {
            setError(pass, 'Password must be at least 8 characters');
            isValid = false;
        } else {
            setSuccess(pass);
        }
        
        if (isValid) {
            // If validation passes, we could redirect or show success message
            console.log("Validation successful!");
            setTimeout(() => {
                window.location.href = "home.html";
            }, 1000);      
            // Simulate login success - you would typically call an API here
           
        }
        
        return isValid;
    };
    
   
});

