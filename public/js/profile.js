document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        window.location.href = 'login.html';
        return;
    }

    // Fetch user profile data
    fetch('/user/profile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Failed to fetch profile');
            });
        }
        return response.json();
    })
    .then(data => {
        // Populate form fields with user data
        document.getElementById('name').value = data.first_name + ' ' + data.last_name || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('address').value = data.address || '';

        // Handle profile image
        if (data.profileImage) {
            localStorage.setItem('profileImage', data.profileImage);
            document.querySelector('.profile-picture img').src = data.profileImage;
        } else {
            const defaultImage = '../images/profil.jpg';
            document.querySelector('.profile-picture img').src = defaultImage;
        }
    })
    .catch(error => {
        console.error('Error loading profile:', error);
        alert('Error loading profile data'+ error.messag);
    });
});

// Profile picture handling
document.querySelector('.edit-icon').addEventListener('click', function() {
    document.getElementById('profile-pic-input').click();
});

document.getElementById('profile-pic-input').addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            // Store the new image in localStorage
            localStorage.setItem('profileImage', imageData);
            // Update the image on the page
            document.querySelector('.profile-picture img').src = imageData;
        }
        reader.readAsDataURL(e.target.files[0]);
    }
});

// Handle form submission
document.getElementById('profile-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim()
    };

    fetch('/user/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Failed to update profile');
            });
        }
        return response.json();
    })
    .then(data => {
        alert('Profile updated successfully!');
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        alert(error.message || 'Failed to update profile');
    });
});

//verification 
