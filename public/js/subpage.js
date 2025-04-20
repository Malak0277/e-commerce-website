document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");

    if (!type) {
      document.getElementById("cake-list").innerHTML = "<p>No cake type provided.</p>";
      return;
    }

    fetch(`/cakes?type=${type}`)
      .then(response => response.json())
      .then(data => {
        generateCards(data);
      })
      .catch(error => {
        document.getElementById("cake-list").innerHTML = "<p>Error loading cakes.</p>";
      });
  });

  function generateCards(list, containerId = '.container') {
    let myContainer = document.querySelector(containerId);
    let myRow = myContainer.querySelector('.row');  // Find existing row
   
    if (!myRow) {  // Create row if it doesn't exist
        myRow = document.createElement("div");
        myRow.className = "row";
        myContainer.appendChild(myRow);
    }
 
    for (let i = 0; i < list.length; i++) {
        const myGrids = document.createElement("div");
        myGrids.className = "col-sm-6 col-lg-4 col-xl-3 col-xxl-2 p-1";

        const myCards = document.createElement("div");
        myCards.className = "card";

        const myImgs = document.createElement("img");
        myImgs.className = "card-img-top";
        myImgs.src = list[i].source;

        const myCardBodies = document.createElement("div");
        myCardBodies.className = "card-body";
     
        const myCardTexts = document.createElement("p");
        myCardTexts.className = "card-text hi";    

        const myOrderButtons = document.createElement("a");
        myOrderButtons.className = "btn btn-warning";
        myOrderButtons.href = "#";
        myOrderButtons.addEventListener('click', function(e) {
            e.preventDefault();
            addToCart(list[i].code, 1);  // Use the cake code as the product ID
        });
        
        const myOrderNowTexts = document.createTextNode("Order Now"); 
        const cakeIds = document.createTextNode(list[i].code); 

        // Build the card structure
        myRow.appendChild(myGrids);
        myGrids.appendChild(myCards);
        myCards.appendChild(myImgs);
        myCards.appendChild(myCardBodies);
        myCardBodies.appendChild(myCardTexts);
        myCardTexts.appendChild(cakeIds);
        myCardBodies.appendChild(myOrderButtons);
        myOrderButtons.appendChild(myOrderNowTexts);    
    }
} 