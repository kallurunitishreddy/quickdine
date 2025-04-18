window.onload = () => {
  // --- Loader functionality ---
  function loader() {
    document.querySelector('.loader-container').classList.add('fade-out');
  }

  function fadeOut() {
    setTimeout(loader, 2000);
  }
  fadeOut();

  // --- Scroll to top visibility ---
  window.onscroll = () => {
    const scrollBtn = document.querySelector('#scroll-top');
    if (scrollBtn) {
      scrollBtn.classList.toggle('active', window.scrollY > 60);
    }
  };

  // --- Initialize User Profile ---
  const username = localStorage.getItem("username") || "User";
  document.getElementById("display-name").textContent = username;
  document.getElementById("login-details").textContent = username;

  // --- Profile Dropdown ---
  window.toggleDropdown = function() {
    const dropdown = document.getElementById("dropdown-content");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  };

  window.logout = function() {
    localStorage.removeItem("username");
    window.location.href = "login.html";
  };

  // Close dropdown when clicking outside
  window.addEventListener("click", function(event) {
    const dropdown = document.getElementById("dropdown-content");
    const wrapper = document.querySelector(".profile-wrapper");
    if (!wrapper.contains(event.target)) {
      dropdown.style.display = "none";
    }
  });

  // --- RESTAURANT MENU SYSTEM ---
  const restaurantMenus = {
    "Andhra Spice": [
      { name: "Andhra Meals", price: 160 },
      { name: "Gongura Chicken", price: 220 },
      { name: "Prawns Fry", price: 270 }
    ],
    "Zaitoon": [
      { name: "Shawarma", price: 120 },
      { name: "Arabian Rice", price: 200 },
      { name: "Grilled Chicken", price: 250 }
    ],
    "Cream Stone": [
      { name: "Brownie Fudge", price: 160 },
      { name: "Ferrero Rocher", price: 200 },
      { name: "Nutella Blast", price: 220 }
    ],
    // Add all other restaurants similarly...
  };

  // Initialize restaurant dropdown
  const dropdown = document.getElementById("restaurantDropdown");
  const menuContainer = document.getElementById("menu-container");
  
  // Initially hide menu container
  menuContainer.style.display = "none";
  
  dropdown.addEventListener("change", function() {
    const selectedRestaurant = this.value;
    menuContainer.innerHTML = ""; // Clear previous menu
    
    if (!selectedRestaurant) {
      menuContainer.style.display = "none";
      return;
    }
    
    // Show loading state
    menuContainer.innerHTML = "<p>Loading menu...</p>";
    menuContainer.style.display = "block";
    
    // Simulate loading delay
    setTimeout(() => {
      showRestaurantMenu(selectedRestaurant);
    }, 300);
  });

  function showRestaurantMenu(restaurantName) {
    const menu = restaurantMenus[restaurantName];
    
    if (!menu) {
      menuContainer.innerHTML = "<p>Menu not available for this restaurant</p>";
      return;
    }
    
    let menuHTML = `
      <h3 style="font-size: 1.8rem; margin-bottom: 1rem; color: #333;">
        ${restaurantName} Menu
      </h3>
      <div style="display: grid; gap: 1rem;">
    `;
    
    menu.forEach(item => {
      menuHTML += `
        <div style="display: flex; align-items: center; gap: 1rem;">
          <input type="checkbox" 
                 value="${item.name}" 
                 data-price="${item.price}"
                 onchange="updateOrder()"
                 style="transform: scale(1.3); cursor: pointer;">
          <label style="flex-grow: 1; font-size: 1.2rem;">
            ${item.name} - ₹${item.price}
          </label>
          <input type="number" 
                 min="1" 
                 value="1" 
                 class="qty" 
                 style="width: 60px;"
                 onchange="updateOrder()">
        </div>
      `;
    });
    
    menuHTML += `</div>`;
    menuContainer.innerHTML = menuHTML;
  }

  // --- TABLE RESERVATION ---
  const tableCounts = { "4": 10, "5": 8, "6": 6 };

  window.reserveTable = function(size) {
    if (tableCounts[size] > 0) {
      tableCounts[size]--;
      document.getElementById(`count${size}`).textContent = `Available: ${tableCounts[size]}`;
      alert(`✅ Reserved a ${size}-seater table!`);
    } else {
      alert(`❌ No ${size}-seater tables available!`);
    }
  };

  // --- ORDER HANDLING ---
  window.updateOrder = function() {
    const selectedItems = [];
    let total = 0;
    
    document.querySelectorAll('#menu-container input[type="checkbox"]:checked').forEach(cb => {
      const qty = parseInt(cb.nextElementSibling.nextElementSibling.value) || 1;
      const price = parseInt(cb.dataset.price);
      selectedItems.push(`${cb.value} x${qty}`);
      total += price * qty;
    });
    
    document.getElementById("foodItems").value = selectedItems.join(", ");
    document.getElementById("total-price").value = `₹${total}`;
    document.getElementById("total").textContent = `Total: ₹${total}`;
  };

  window.saveOrderData = function(event) {
    event.preventDefault();
    
    // Validate form
    const phone = document.querySelector('.inputBox input[type="number"]').value;
    if (!phone || phone.length !== 10) {
        alert("Please enter a valid 10-digit phone number");
        return;
    }

    // Collect all selected items with prices and quantities
    const orderItems = [];
    document.querySelectorAll('.menu-item:checked').forEach(checkbox => {
        const qtyInput = checkbox.parentElement.querySelector('.food-qty');
        orderItems.push({
            name: checkbox.value,
            price: parseInt(checkbox.dataset.price),
            quantity: parseInt(qtyInput.value) || 1
        });
    });

    const orderData = {
        restaurant: document.getElementById("restaurantDropdown").value,
        items: orderItems,
        subtotal: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        tax: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.05,
        total: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.05,
        customer: document.querySelector('input[placeholder="Name"]')?.value || "Guest",
        phone: phone,
        allergies: document.querySelector('input[placeholder="Allergies"]').value,
        instructions: document.querySelector('textarea').value,
        timestamp: new Date().toISOString(),
        status: "pending"
    };

    // Save to admin view
    let allOrders = JSON.parse(localStorage.getItem('quickdine_orders')) || [];
    allOrders.push(orderData);
    localStorage.setItem('quickdine_orders', JSON.stringify(allOrders));

    // Save to restaurant-specific storage
    const restaurantKey = `restaurant_${orderData.restaurant.replace(/\s+/g, '_')}`;
    let restaurantOrders = JSON.parse(localStorage.getItem(restaurantKey)) || [];
    restaurantOrders.push(orderData);
    localStorage.setItem(restaurantKey, JSON.stringify(restaurantOrders));

    // Save for payment page
    localStorage.setItem('currentOrder', JSON.stringify(orderData));
    window.location.href = "payment.html";
  };
  
};