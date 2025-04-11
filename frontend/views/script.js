// Gérer le dépôt
document.getElementById('deposit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const accountId = document.getElementById('deposit-account').value;
    const amount = document.getElementById('deposit-amount').value;
  
    try {
      const response = await fetch('/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ account_id: accountId, amount: amount })
      });
      if (response.ok) {
        alert('Dépôt effectué avec succès');
      } else {
        alert('Erreur lors du dépôt');
      }
    } catch (error) {
      alert('Erreur réseau');
    }
  });
  
  // Gérer le retrait
  document.getElementById('withdraw-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const accountId = document.getElementById('withdraw-account').value;
    const amount = document.getElementById('withdraw-amount').value;
  
    try {
      const response = await fetch('/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ account_id: accountId, amount: amount })
      });
      if (response.ok) {
        alert('Retrait effectué avec succès');
      } else {
        alert('Erreur lors du retrait');
      }
    } catch (error) {
      alert('Erreur réseau');
    }
  });
  
  // Consulter le solde
  document.getElementById('balance-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const accountId = document.getElementById('balance-account').value;
  
    try {
      const response = await fetch(`/balance/${accountId}`);
      if (response.ok) {
        const data = await response.text();
        document.getElementById('balance-result').textContent = data;
      } else {
        document.getElementById('balance-result').textContent = 'Compte non trouvé';
      }
    } catch (error) {
      document.getElementById('balance-result').textContent = 'Erreur réseau';
    }
  });

  // Gérer la création de compte
  document.getElementById('create-account-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const accountId = document.getElementById('create-account-id').value;
    const initialBalance = document.getElementById('create-account-balance').value;
  
    try {
      const response = await fetch('/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ account_id: accountId, initial_balance: initialBalance })
      });
      if (response.ok) {
        alert('Compte créé avec succès');
      } else {
        alert('Erreur lors de la création du compte');
      }
    } catch (error) {
      alert('Erreur réseau');
    }
  });
  
  