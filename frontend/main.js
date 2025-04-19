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
  const supportBtn = document.getElementById('supportBtn');
  const supportSection = document.getElementById('supportSection');
  const supportForm = document.getElementById('supportForm');
  const supportFeedback = document.getElementById('supportFeedback');

  function showMessage(message, isError = false) {
    authMessage.textContent = message;
    authMessage.className = isError ? 'text-danger' : 'text-success';
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
      const response = await fetch('/api/auth/login', {
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

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    try {
      const response = await fetch('/api/auth/register', {
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

  async function displayCatalog() {
    authSection.classList.add('d-none');
    catalogSection.classList.remove('d-none');
    logoutBtn.classList.remove('d-none');
    viewCartBtn.classList.remove('d-none');
    checkoutBtn.classList.remove('d-none');
    supportBtn.classList.remove('d-none');

    try {
      const response = await fetch('/api/catalog/products');
      const products = await response.json();
      renderProducts(products);
    } catch (error) {
      console.error("Erreur lors du chargement des produits", error);
    }
  }

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
      const addBtn = col.querySelector('.add-to-cart-btn');
      addBtn.addEventListener('click', () => addToCart(product));
      productList.appendChild(col);
    });
  }

  async function addToCart(product) {
    try {
      const response = await fetch('/api/payment/cart', {
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

  viewCartBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/payment/cart');
      const cart = await response.json();
      alert("Contenu du panier :\n" + JSON.stringify(cart, null, 2));
    } catch (error) {
      alert("Erreur lors de la récupération du panier.");
      console.error(error);
    }
  });

  checkoutBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (response.ok && data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        alert(data.message || "Erreur lors du checkout.");
      }
    } catch (error) {
      alert("Erreur lors du checkout.");
      console.error(error);
    }
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    authSection.classList.remove('d-none');
    catalogSection.classList.add('d-none');
    logoutBtn.classList.add('d-none');
    viewCartBtn.classList.add('d-none');
    checkoutBtn.classList.add('d-none');
    supportBtn.classList.add('d-none');
    supportSection.classList.add('d-none');
    authMessage.textContent = '';
    supportFeedback.textContent = '';
  });

  // Bouton pour afficher la section support
  supportBtn.addEventListener('click', () => {
    supportSection.classList.toggle('d-none');
  });

  // Envoi du ticket de support
  supportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const subject = document.getElementById('supportSubject').value;
    const message = document.getElementById('supportMessage').value;
    const token = localStorage.getItem('token');

      try {
        const response = await fetch('/api/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ subject, message })
        });
    
        // Afficher la réponse HTTP (code, headers, etc.)
        console.log('Response Status:', response.status);
        console.log('Response Headers:', response.headers);
    
        // Vérifier si la réponse est en JSON
        const data = await response.json();
        console.log('Response Body:', data); // Affiche le corps de la réponse
    
        if (response.ok) {
            supportFeedback.textContent = "Ticket envoyé avec succès.";
            supportFeedback.className = "text-success";
            supportForm.reset();
        } else {
            supportFeedback.textContent = data.message || "Erreur lors de l'envoi du ticket.";
            supportFeedback.className = "text-danger";
        }
    } catch (error) {
        supportFeedback.textContent = "Erreur réseau.";
        supportFeedback.className = "text-danger";
        console.error('Network Error:', error); // Affiche l'erreur dans la console
    }
    
  });
});


const loadTicketsBtn = document.getElementById('loadTicketsBtn');
const ticketList = document.getElementById('ticketList');

// Charger les tickets de l'utilisateur
loadTicketsBtn.addEventListener('click', async () => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('/api/tickets/my-tickets', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const tickets = await response.json();

    if (response.ok) {
      ticketList.innerHTML = '';
      if (tickets.length === 0) {
        ticketList.innerHTML = '<li class="list-group-item">Aucun ticket trouvé.</li>';
      } else {
        tickets.forEach(ticket => {
          const item = document.createElement('li');
          item.className = 'list-group-item';
          item.innerHTML = `
            <strong>${ticket.subject}</strong> <br>
            ${ticket.message} <br>
            <small class="text-muted">Statut: ${ticket.status || 'En attente'}</small>
          `;
          ticketList.appendChild(item);
        });
      }
    } else {
      ticketList.innerHTML = `<li class="list-group-item text-danger">${tickets.message || 'Erreur lors du chargement des tickets.'}</li>`;
    }
  } catch (error) {
    console.error('Erreur réseau lors de la récupération des tickets', error);
    ticketList.innerHTML = '<li class="list-group-item text-danger">Erreur réseau.</li>';
  }
});
