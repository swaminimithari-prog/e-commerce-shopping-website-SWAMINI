const API_BASE = "http://localhost:5000/api"; // update to your deployed backend URL

const token = localStorage.getItem("buybloom_token"); // JWT auth token only — not app data

async function loadOrderDetails() {
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Try to get orderId passed via URL (?orderId=xxxx) from checkout redirect
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");

    try {
        let order;

        if (orderId) {
            const res = await fetch(`${API_BASE}/orders/${orderId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            order = data.order;
        } else {
            // Fallback: fetch most recent order for this user
            const res = await fetch(`${API_BASE}/orders/myorders`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (!data.success || data.orders.length === 0) throw new Error("No orders found");
            order = data.orders[0]; // most recent (sorted by createdAt desc)
        }

        renderOrder(order);
    } catch (err) {
        console.error("Failed to load order:", err);
    }
}

function renderOrder(order) {
    const aboutCheck = document.getElementById("aboutCheck");
    if (!aboutCheck) return;

    const orderIdEl = document.createElement("p");
    orderIdEl.textContent = `Order ID: ${order._id}`;

    const totalEl = document.createElement("p");
    totalEl.textContent = `Total: ₹${order.totalPrice}`;

    aboutCheck.appendChild(orderIdEl);
    aboutCheck.appendChild(totalEl);
}

loadOrderDetails();