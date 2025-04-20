let form = document.getElementById("form");

let email = document.querySelector(".my-email");
let pass = document.querySelector(".my-pass");
let date = document.querySelector(".my-date");
let address = document.querySelector(".my-address");
let size = document.querySelector(".my-size");
let occasion = document.querySelector(".my-occ");
let comments = document.querySelector(".my-comm");

let firstName = document.querySelector(".my-fname");
let lastName = document.querySelector(".my-lname");
//let number = document.querySelector(".my-number");
let pass2 = document.querySelector(".my-pass2");









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
    if(email){
        const emailValue = email.value.trim();

        if(emailValue === '') {
            setError(email, "email is required");
            
        } else if (!isValidEmail(emailValue)) {
            setError(email, 'Provide a valid email address');
        } else {
            setSuccess(email);
        }
    }

    if(pass){
        const passValue = pass.value.trim();

        if(passValue === '') {
            setError(pass, 'Password is required');
        } else if (passValue.length < 8 ) {
            setError(pass, 'Password must be at least 8 character.')
        } else {
            setSuccess(pass);
        }
    }

    if(pass2){
        const pass2Value = pass2.value.trim();

        if(pass2Value === '') {
            setError(pass2, 'Please confirm your password');
        } else if (pass2Value !== passValue) {
            setError(pass2, "Passwords doesn't match");
        } else {
            setSuccess(pass2);
        }
    }


    if(firstName){
        const firstNameValue = firstName.value.trim();
    
        if(firstNameValue === '') {
            setError(firstName, 'first name is required');
        } else if (firstNameValue.length > 20 ) {
            setError(firstName, 'Name must not exceed 20 characters')
        } else {
            setSuccess(firstName);
        }
    }

    if(lastName){
        const firstNameValue = lastName.value.trim();

        if(lastNameValue === '') {
            setError(lastName, 'last name is required');
        } else if (lastNameValue.length > 20 ) {
            setError(lastName, 'Name must not exceed 20 characters')
        } else {
            setSuccess(lastName);
        }
    }

    if(address){
        const addressValue = address.value.trim();
    
        if(addressValue === '') {
            setError(address, 'address is required');
        } else {
            setSuccess(address);
        }
    }

    if(size){
        const sizeValue = size.value.trim();
    
        if(sizeValue === 'n') {
            setError(size, 'must choose number of people');
        } else {
            setSuccess(size);
        }
    }

    if(occasion){
        const occasionValue = occasion.value.trim();
        if(occasionValue === 'occ') {
            setError(occasion, 'must provide an occasion ');
        } else {
            setSuccess(occasion);
        }
    }
    
    if(date){
        const dateValue = date.value.trim();
        var today =new Date();
        var inputDate = new Date(dateValue);

        if(dateValue === '') {
            setError(date, 'must enter a date ');
        } else if (inputDate < today ) {
            setError(date, 'Enter a valid date')
        } else {
            setSuccess(date);
        }
    }
 
}
    