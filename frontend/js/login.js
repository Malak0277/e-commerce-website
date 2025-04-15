let form = document.getElementById("form");
let email = document.querySelector(".my-email");
let pass = document.querySelector(".my-pass");



form.addEventListener('submit', e=> {
    e.preventDefault();
    console.log("OK");
    validateInputs();
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    element.style.borderColor="#ff3860";
    element.style.borderWidth="2px";
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    element.style.borderColor="#09c372";
    element.style.borderWidth="2px";
};



const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateInputs = () => {
    const emailValue = email.value.trim();
    const passValue = pass.value.trim();
    
    if(emailValue === '') {
        setError(email, "email is required");
        
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
    } else {
        setSuccess(email);
    }
    
    if(passValue === '') {
        setError(pass, 'Password is required');
    } else if (passValue.length < 8 ) {
        setError(pass, 'Password must be at least 8 character.')
    } else {
        setSuccess(pass);
    }
    
}
    