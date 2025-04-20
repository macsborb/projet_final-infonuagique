// Stockage en mémoire du panier (attention : pour un test uniquement, pas en production)
let cart = [];

// Clé Stripe (test) via la variable d'environnement
const stripeSecretKey = process.env.PAYMENT_STRIPE_KEY;
const stripe = require('stripe')(stripeSecretKey);

// Ajouter un article au panier
exports.addItemToCart = (req, res) => {
  const { item } = req.body;
  if (!item || !item.name || !item.price) {
    return res.status(400).json({ message: "Objet invalide. 'name' et 'price' sont requis." });
  }
  // On peut prévoir une propriété quantity (par défaut 1)
  const quantity = item.quantity || 1;
  cart.push({ name: item.name, price: item.price, quantity });
  res.json({ message: "Objet ajouté au panier", cart });
};

// Obtenir le contenu du panier
exports.getCart = (req, res) => {
  res.json(cart);
};

// Procéder au paiement via Stripe en mode test
exports.checkout = async (req, res) => {
  try {
    if (cart.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }
    // Création d'une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100)  // montant en cents
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      // URLs de redirection en cas de succès ou d'annulation
      success_url: process.env.PAYMENT_SUCCESS_URL || 'http://localhost:80/success.html',
      cancel_url: process.env.PAYMENT_CANCEL_URL || 'http://localhost:80/cancel.html'
    });
    
    // Réinitialiser le panier après création de la session
    cart = [];
    
    res.json({ message: "Session de paiement créée", sessionUrl: session.url });
  } catch (error) {
    console.error("Erreur lors du checkout:", error);
    res.status(500).json({ message: "Erreur lors du checkout", error: error.message });
  }
};
