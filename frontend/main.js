document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments de l'interface
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authMessage = document.getElementById('authMessage');
    const authSection = document.getElementById('authSection');
    const catalogSection = document.getElementById('catalogSection');
    const logoutBtn = document.getElementById('logoutBtn');
    const viewCartBtn = document.getElementById('viewCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const productList = document.getElementById('productList');
  
    // Fonction d'affichage d'un message d'information ou d'erreur
    function showMessage(message, isError = false) {
      authMessage.textContent = message;
      authMessage.className = isError ? 'text-danger' : 'text-success';
    }
  
    // Connexion
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token);
          showMessage("Connexion réussie");
          displayCatalog();
        } else {
          showMessage(data.message || "Erreur lors de la connexion", true);
        }
      } catch (error) {
        showMessage("Erreur lors de la connexion", true);
        console.error(error);
      }
    });
  
    // Inscription
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('registerUsername').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      try {
        const response = await fetch('http://localhost:3001/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token);
          showMessage("Inscription réussie");
          displayCatalog();
        } else {
          showMessage(data.message || "Erreur lors de l'inscription", true);
        }
      } catch (error) {
        showMessage("Erreur lors de l'inscription", true);
        console.error(error);
      }
    });
  
    // Afficher le catalogue et activer les boutons de paiement/déconnexion
    async function displayCatalog() {
      authSection.classList.add('d-none');
      catalogSection.classList.remove('d-none');
      logoutBtn.classList.remove('d-none');
      viewCartBtn.classList.remove('d-none');
      checkoutBtn.classList.remove('d-none');
      try {
        const response = await fetch('http://localhost:3002/api/products');
        const products = await response.json();
        renderProducts(products);
      } catch (error) {
        console.error("Erreur lors du chargement des produits", error);
      }
    }
  
    // Rendu des produits dans le catalogue
    function renderProducts(products) {
      productList.innerHTML = '';
      if (!products || products.length === 0) {
        productList.innerHTML = '<p>Aucun produit trouvé</p>';
        return;
      }
      products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-3';
        col.innerHTML = `
          <div class="card h-100">
            <img src="${product.image_url || 'https://via.placeholder.com/300x200'}" class="card-img-top" alt="${product.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <p class="card-text"><strong>Prix :</strong> ${product.price} €</p>
              <button class="btn btn-warning mt-auto add-to-cart-btn">Ajouter au panier</button>
            </div>
          </div>
        `;
        // Bouton d'ajout au panier
        const addBtn = col.querySelector('.add-to-cart-btn');
        addBtn.addEventListener('click', () => addToCart(product));
        productList.appendChild(col);
      });
    }
  
    // Ajouter un produit au panier via le service de paiement
    async function addToCart(product) {
      try {
        const response = await fetch('http://localhost:3003/api/payment/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item: { name: product.name, price: product.price, quantity: 1 } })
        });
        const data = await response.json();
        if (response.ok) {
          alert(`"${product.name}" a été ajouté au panier.`);
        } else {
          alert(data.message || "Erreur lors de l'ajout au panier.");
        }
      } catch (error) {
        alert("Erreur lors de l'ajout au panier.");
        console.error(error);
      }
    }
  
    // Voir le contenu du panier
    viewCartBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('http://localhost:3003/api/payment/cart');
        const cart = await response.json();
        alert("Contenu du panier :\n" + JSON.stringify(cart, null, 2));
      } catch (error) {
        alert("Erreur lors de la récupération du panier.");
        console.error(error);
      }
    });
  
    // Procéder au paiement (checkout)
    checkoutBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('http://localhost:3003/api/payment/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (response.ok && data.sessionUrl) {
          // Redirection vers la session de paiement Stripe (mode test)
          window.location.href = data.sessionUrl;
        } else {
          alert(data.message || "Erreur lors du checkout.");
        }
      } catch (error) {
        alert("Erreur lors du checkout.");
        console.error(error);
      }
    });
  
    // Déconnexion
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      authSection.classList.remove('d-none');
      catalogSection.classList.add('d-none');
      logoutBtn.classList.add('d-none');
      viewCartBtn.classList.add('d-none');
      checkoutBtn.classList.add('d-none');
      authMessage.textContent = '';
    });
  });
  