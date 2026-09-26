const API_BASE_URL = "http://localhost:5000";

function formatPrice(price) {
  if (!price) return "₹0";
  return "₹" + Number(price).toLocaleString('en-IN');
}

function dynamicClothingSection(product) {
  const boxDiv = document.createElement("div");
  boxDiv.id = "box";
  boxDiv.dataset.productId = product._id; // used by index.html's cart/buy buttons

  const boxLink = document.createElement("a");
  boxLink.href = "contentDetails.html?id=" + product._id;

  const imgTag = document.createElement("img");
  imgTag.src = product.image;
  imgTag.alt = product.name;

  const detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  const h3 = document.createElement("h3");
  h3.appendChild(document.createTextNode(product.name));

  const h4 = document.createElement("h4");
  h4.appendChild(document.createTextNode(product.brand || ""));

  const h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode(formatPrice(product.price)));

  boxDiv.appendChild(boxLink);
  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(h2);

  return boxDiv;
}

async function updateCartBadge() {
  const badge = document.getElementById("badge");
  if (!badge) return;

  // NOTE: standardized to 'buybloom_token' to match header.html / index.html
  const token = localStorage.getItem('buybloom_token');
  if (!token) {
    badge.innerHTML = "0";
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/cart`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    if (res.ok && data.success && data.cart) {
      const totalItems = data.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      badge.innerHTML = totalItems;
    }
  } catch (err) {
    console.error('Failed to fetch cart count:', err);
  }
}

async function loadContent() {
  const containerClothing = document.getElementById("containerClothing");
  const containerAccessories = document.getElementById("containerAccessories");

  try {
    const res = await fetch(`${API_BASE_URL}/api/products`);
    const data = await res.json();

    if (!data.success) {
      console.error('Failed to load products');
      return;
    }

    data.products.forEach(product => {
      if (product.type === "accessories") {
        containerAccessories.appendChild(dynamicClothingSection(product));
      } else {
        containerClothing.appendChild(dynamicClothingSection(product));
      }
    });
  } catch (err) {
    console.error('Failed to fetch products:', err);
  }
}

loadContent();
updateCartBadge();