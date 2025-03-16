// Fonction fact et applique (non modifiées)
function fact(n) {
  return (n === 0 || n === 1) ? 1 : n * fact(n - 1);
}

console.log(fact(6));

function applique(f, tab) {
  return tab.map(f);
}

console.log(applique(fact, [1,2,3,4,5,6]));
console.log(applique(n => n + 1, [1,2,3,4,5,6]));


/* ---- Frontend ----  */

// Récupération de l'URL du serveur depuis localStorage ou valeur par défaut
let serverUrl = localStorage.getItem("serverUrl") || "https://088d31aa-9783-4fb6-beda-384447760bc3-00-2ysjlhn94291i.janeway.replit.dev";

// Met à jour le champ input avec l'URL actuelle
document.getElementById("server-url").value = serverUrl;

// Fonction pour enregistrer une nouvelle URL du serveur
document.getElementById("save-server-url").addEventListener("click", function () {
  let newUrl = document.getElementById("server-url").value.trim();
  if (newUrl !== "") {
    serverUrl = newUrl;
    localStorage.setItem("serverUrl", serverUrl);
    let status = document.getElementById("server-status");
    status.classList.add("show");
    setTimeout(() => {
      status.classList.remove("show");
    }, 3000);
  }
});

// Fonction pour mettre à jour l'affichage des messages depuis le serveur
function update() {
  console.log("Mise à jour des messages demandée depuis :", serverUrl);

  fetch(`${serverUrl}/msg/getAll`)
    .then(response => response.json())
    .then(data => {
      console.log("Messages récupérés :", data);
      let ul = document.getElementById("message-list");
      ul.innerHTML = ""; // Efface les anciens messages

      data.forEach((message) => {
        let li = document.createElement("li");
        li.innerHTML = `<strong>${message.pseudo}</strong>: ${message.msg} <br><small>${message.date}</small>`;
        ul.appendChild(li);
      });

      // Affiche le message de mise à jour
      let updateStatus = document.getElementById("update-status");
      updateStatus.textContent = "✔️ Mise à jour effectuée";
      updateStatus.style.color = "green";
      updateStatus.classList.add("show");

      // Retire la classe "show" après 3 secondes pour cacher le message
      setTimeout(() => {
        updateStatus.classList.remove("show");
      }, 3000);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des messages :", error);
      let updateStatus = document.getElementById("update-status");
      updateStatus.textContent = "❌ Erreur lors de la mise à jour !";
      updateStatus.style.color = "red";
      updateStatus.classList.add("show");

      setTimeout(() => {
        updateStatus.classList.remove("show");
      }, 3000);
    });
}

// Fonction pour envoyer un nouveau message avec pseudo
document.getElementById("send-button").addEventListener("click", function() {
  let pseudoInput = document.getElementById("pseudo-input").value.trim();
  let messageInput = document.getElementById("message-input").value.trim();

  if (pseudoInput === "" || messageInput === "") {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  let pseudoEncoded = encodeURIComponent(pseudoInput);
  let messageEncoded = encodeURIComponent(messageInput);

  fetch(`${serverUrl}/msg/post/${pseudoEncoded}/${messageEncoded}`)
    .then(response => response.json())
    .then(data => {
      if (data.code === 1) {
        console.log("Message ajouté avec succès !");
        document.getElementById("pseudo-input").value = "";
        document.getElementById("message-input").value = "";
        update(); // Mise à jour après ajout
      } else {
        console.error("Erreur lors de l'ajout du message !");
      }
    })
    .catch(error => console.error("Erreur lors de l'envoi du message :", error));
});

// Bouton "Mettre à jour" pour rafraîchir les messages
document.getElementById("update-button").addEventListener("click", function() {
  update();
});

// Fonction pour basculer en mode sombre
document.getElementById("toggle-theme").addEventListener("click", function() {
  document.body.classList.toggle("dark-mode");
  this.textContent = document.body.classList.contains("dark-mode") ? "Mode Clair" : "Mode Sombre";
});

// Charger les messages au démarrage
document.addEventListener("DOMContentLoaded", function() {
  update();
});
