
function toggleNav() {
    const sidebar = document.getElementById("Sidebar");
    if (sidebar.style.width === "250px") {
      closeNav();
    } else {
      openNav();
    }
  }
  
  function openNav() {
    document.getElementById("Sidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.getElementById("Sidebar").style.display = "block"; 
  }
  
  function closeNav() {
    document.getElementById("Sidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.getElementById("Sidebar").style.display = "none"; 
  }
  
  
  document.querySelector('.edit-icon').addEventListener('click', function() {
    document.getElementById('profile-pic-input').click();
  });
  
  document.getElementById('profile-pic-input').addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.querySelector('.profile-picture img').src = e.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
    }
  });
  

  document.getElementById('profile-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Profile updated successfully!');
    // Here we shouild send the form data to the DB
  });


