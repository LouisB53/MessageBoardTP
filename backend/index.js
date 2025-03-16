var express = require('express'); // Import de la bibliothèque Express
var app = express(); // Instanciation d'une application Express

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Route de base
app.get("/", function(req, res) {
  res.send("Hello");
});

// Variable globale pour stocker le compteur
let compteur = 0;

// Route /cpt/query : retourne la valeur du compteur
app.get("/cpt/query", function(req, res) {
  res.json({ compteur: compteur });
});

// Route /cpt/inc : Incrémente de 1 par défaut OU de "v" si fourni
app.get("/cpt/inc", function(req, res) {
  let valeur = parseInt(req.query.v);
  if (req.query.v === undefined) { 
    compteur += 1;
    res.json({ code: 0 });
  } else if (!isNaN(valeur)) { 
    compteur += valeur;
    res.json({ code: 0 });
  } else { 
    res.json({ code: -1 });
  }
});

/* Stockage des messages (avec pseudo et date) */
let allMsgs = [
  { pseudo: "Alice", msg: "Hello World", date: new Date().toLocaleString() },
  { pseudo: "Bob", msg: "Blah Blah", date: new Date().toLocaleString() },
  { pseudo: "Charlie", msg: "I love cats", date: new Date().toLocaleString() }
];

// Route pour récupérer TOUS les messages (corrigée)
app.get("/msg/getAll", function(req, res) {
  res.json(allMsgs);
});

// Route pour récupérer UN message par son numéro
app.get("/msg/get/:num", function(req, res) {
  let num = parseInt(req.params.num);
  if (!isNaN(num) && num >= 0 && num < allMsgs.length) {
    res.json({ code: 1, msg: allMsgs[num] });
  } else {
    res.json({ code: 0 });
  }
});

// Route pour récupérer le nombre total de messages
app.get("/msg/nber", function(req, res) {
  res.json({ count: allMsgs.length });
});

// Route pour ajouter un message (corrigée avec pseudo et date)
app.get("/msg/post/:pseudo/:message", function(req, res) {
  let newMessage = {
    pseudo: decodeURIComponent(req.params.pseudo),
    msg: decodeURIComponent(req.params.message),
    date: new Date().toLocaleString()
  };
  allMsgs.push(newMessage);
  res.json({ code: 1, id: allMsgs.length - 1 });
});

// Route pour supprimer un message
app.get("/msg/del/:num", function(req, res) {
  let num = parseInt(req.params.num);
  if (!isNaN(num) && num >= 0 && num < allMsgs.length) {
    allMsgs.splice(num, 1);
    res.json({ code: 1 });
  } else {
    res.json({ code: 0 });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
console.log("Serveur démarré sur http://localhost:8080");
