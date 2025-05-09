document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");

    if (!type) {
        document.getElementById("main").innerHTML = "<p>No cake type provided.</p>";
        return;
    }

    fetch(`/cake?type=${type}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || response.statusText);
                });
            }
            return response.json();
        })
        .then(data => {
            generateCards(data);
        })
        .catch(error => {
            document.getElementById("main").innerHTML = `<p>Error: ${error.message}</p>`;
        });
});

function generateCards(list) {
    const container = document.getElementById("main");
    const row = container.querySelector('.row');
    
    // Clear existing content
    row.innerHTML = '';

    list.forEach(cake => {
        const col = document.createElement("div");
        col.className = "col-sm-6 col-lg-4 col-xl-3 col-xxl-2 p-2";

        const card = document.createElement("div");
        card.className = "card h-100 shadow-sm";

        const img = document.createElement("img");
        img.className = "card-img-top";
        img.style.height = "200px";
        img.style.objectFit = "cover";
        img.src = cake.image_url;
        img.alt = cake.name;

        const cardBody = document.createElement("div");
        cardBody.className = "card-body d-flex flex-column";

        const title = document.createElement("h5");
        title.className = "card-title text-center mb-3";
        title.textContent = cake.name;

        const description = document.createElement("p");
        description.className = "card-text flex-grow-1";
        description.style.fontSize = "0.9rem";
        description.textContent = cake.description;

        const price = document.createElement("p");
        price.className = "card-text fw-bold text-primary mt-3 mb-2";
        price.textContent = `$${cake.price.toFixed(2)}`;

        const orderButton = document.createElement("a");
        orderButton.className = "btn btn-warning w-100";
        orderButton.href = "#";
        orderButton.textContent = "Order Now";
        orderButton.addEventListener('click', function(e) {
            e.preventDefault();
            addToCart(cake._id, 1);
        });

        // Build the card structure
        cardBody.appendChild(title);
        cardBody.appendChild(description);
        cardBody.appendChild(price);
        cardBody.appendChild(orderButton);

        card.appendChild(img);
        card.appendChild(cardBody);
        col.appendChild(card);
        row.appendChild(col);
    });
}

function addToCart(cakeId, quantity) {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/html/Login.html';
        return;
    }

    fetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            cake_id: cakeId,
            quantity: quantity
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('Added to cart successfully!');
        }
    })
    .catch(error => {
        alert('Error adding to cart');
    });
} 