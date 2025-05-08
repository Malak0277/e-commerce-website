document.addEventListener("DOMContentLoaded", () => {

  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const type = card.dataset.type;
      if (type) {
        window.location.href = `subpage.html?type=${type}`;
      }
    });
  });
  
  // Update cart count from localStorage if available
  updateCartCount();
});