fetch("http://localhost:5000/products")
  .then((res) => res.json())
  .then((data) => {
    let container = document.getElementById("products");

    data.forEach((product) => {
      container.innerHTML += `
      <div style="border:1px solid black;padding:10px;margin:10px;width:200px">

        <img src="http://localhost:5000/images/${product.image}" width="150">

        <h3>${product.name}</h3>

        <p>₹${product.price}</p>

        <p>${product.description}</p>

        <button onclick="addToCart(${product.id})">
          Add to Cart
        </button>

      </div>
      `;
    });
  });

// Add to cart function

function addToCart(productId) {
  let userId = localStorage.getItem("userId");

  fetch("http://localhost:5000/add-cart", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      user_id: userId,
      product_id: productId,
      quantity: 1,
    }),
  })
    .then((res) => res.text())
    .then((data) => {
      alert("Product Added to Cart");
    });
}
