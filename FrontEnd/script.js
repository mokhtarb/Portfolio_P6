const gallery = document.querySelector(".gallery");
//Requete HTTP pour récupérer les données au format JSon
fetch("http://localhost:5678/api/works/")
  .then((response) => response.json())
  .then((data) => {
    //parcourir les données Json et afficher chaque image
    data.forEach((work) => {
      const figure = document.createElement("figure");
      const image = document.createElement("img");
      image.src = work.imageUrl;
      const caption = document.createElement("figcaption");
      caption.textContent = work.title;
      //Ajouter l'image a la gallerie
      gallery.appendChild(figure);
      figure.appendChild(image);
      figure.appendChild(caption);
    });
  });
// Récupérer le conteneur des éléments à trier
const itemsContainer = document.querySelector(".gallery");

async function afficherToutesLesImages() {
  // Effacer les éléments actuels dans le conteneur
  itemsContainer.innerHTML = "";

  // Effectuer une requête Fetch pour obtenir toutes les données de l'API
  const response = await fetch("http://localhost:5678/api/works/");
  const data = await response.json();

  // Parcourir tous les éléments et les ajouter au conteneur
  data.forEach((element) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = element.imageUrl;
    const caption = document.createElement("figcaption");
    caption.textContent = element.title;

    figure.appendChild(image);
    figure.appendChild(caption);
    itemsContainer.appendChild(figure);
  });
}

// Fonction de tri par catégorie
async function trierParCategorie(categorie) {
  // Effacer les éléments actuels dans le conteneur
  itemsContainer.innerHTML = "";

  // Effectuer une requête Fetch pour obtenir les données de l'API
  const response = await fetch("http://localhost:5678/api/works/");
  const data = await response.json();

  // Filtrer les éléments en fonction de la catégorie sélectionnée
  const elementsFiltres = data.filter(
    (element) => element.category.name === categorie
  );

  // Parcourir les éléments filtrés et les ajouter au conteneur
  elementsFiltres.forEach((element) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = element.imageUrl;
    const caption = document.createElement("figcaption");
    caption.textContent = element.title;

    figure.appendChild(image);
    figure.appendChild(caption);
    itemsContainer.appendChild(figure);
  });
}

// Ajouter des écouteurs d'événements pour les boutons de tri
const tousBtn = document.createElement("button");
tousBtn.textContent = "Tous";
tousBtn.addEventListener("click", afficherToutesLesImages);
document.querySelector(".filters").appendChild(tousBtn);

const objetsBtn = document.createElement("button");
objetsBtn.textContent = "Objets";
objetsBtn.addEventListener("click", () => trierParCategorie("Objets"));
document.querySelector(".filters").appendChild(objetsBtn);

const appartementsBtn = document.createElement("button");
appartementsBtn.textContent = "Appartements";
appartementsBtn.addEventListener("click", () =>
  trierParCategorie("Appartements")
);
document.querySelector(".filters").appendChild(appartementsBtn);

const hotelsBtn = document.createElement("button");
hotelsBtn.textContent = "Hotels & restaurants";
hotelsBtn.addEventListener("click", () =>
  trierParCategorie("Hotels & restaurants")
);
document.querySelector(".filters").appendChild(hotelsBtn);