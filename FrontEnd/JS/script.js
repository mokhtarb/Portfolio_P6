
getCategory();
getWorks();

// Récupération des catégories via l'API


function getCategory() {
    const catUrl = 'http://localhost:5678/api/categories';
    fetch(catUrl)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const fragment = document.createDocumentFragment();
            let categoryies = data;

            localStorage.setItem('categoryies', JSON.stringify(data));
            categoryies.forEach((category) => {
                const link = document.createElement('a');
                link.textContent = category.name;
                link.onclick = function () {
                    findByCategory(category.id);
                    link.className.replace('active', '');
                };
                link.classList.add("subcat");
                link.setAttribute("tabindex", "0");
                fragment.appendChild(link);
            });
            const categorie = document.getElementById('category');
            categorie.appendChild(fragment);
        })
}

function findByCategory(id) {
    const works = JSON.parse(localStorage.getItem('worksedit'));
    let worksList = [];

    works.forEach((work) => {
        if(work.categoryId == id) {
            worksList.push(work);
        }
    });
    console.log(worksList);
    createDocumentWorks(worksList);
}

// Pour afficher tout les projets sur le filtre "Tous"


function showAllWorks() {
    const works = JSON.parse(localStorage.getItem('worksedit'));
    createDocumentWorks(works);
}

// Récupération des projets de l'API

function getWorks() {
    const worksUrl = 'http://localhost:5678/api/works';

    fetch(worksUrl)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const fragment = document.createDocumentFragment();
            let works = data;
            localStorage.setItem('worksedit', JSON.stringify(data));
            createDocumentWorks(works);
        })
}

function createDocumentWorks(works) {
    const fragment = document.createDocumentFragment();
    const gallery = document.getElementsByClassName('gallery')[0];

    gallery.innerHTML = ''; 
    works.forEach((work) => {
        const figure = document.createElement('figure');
        const div = document.createElement('div');
        const img = document.createElement('img');

        img.src = work.imageUrl;
        img.crossOrigin = 'anonymous';

        const caption = document.createElement('figcaption')
        caption.textContent = work.title;
        fragment.appendChild(figure);
        figure.appendChild(div);
        div.appendChild(img);
        div.appendChild(caption);
    })
    gallery.appendChild(fragment);
}

// Ajout des projets sur la boite modale
function addWorkModal() {
    const fragment = document.createDocumentFragment();
    const galleryModal = document.getElementsByClassName('gallerymodal')[0];
    galleryModal.innerHTML='';

    const works = JSON.parse(localStorage.getItem('worksedit'));

    works.forEach((work) => {
    const div = document.createElement('div');
    div.id = "gallery_edit_img";

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.crossOrigin = 'anonymous';
    div.appendChild(img);

    const i = document.createElement('i');
    i.setAttribute("class", "fa fa-trash");
    i.setAttribute("data-id", work.id);
    i.setAttribute("onclick", "deleteWork(this, " + work.id + ")");
    div.appendChild(i);

    const p = document.createElement('p');
    p.textContent = 'éditer';
    p.setAttribute("data-id", work.id);
    div.appendChild(p);

    fragment.appendChild(div);
    });
  
    galleryModal.appendChild(fragment);
}

  // Variable à afficher pour le mode éditeur

const modeEdition = document.querySelector(".mode-edition");
const editBtn = document.querySelectorAll(".modifier");
const logout = document.querySelector('[href="login.html"]');
const filters = document.querySelectorAll("#category");

// Si nous avons récupéré le token

if (isConnected()) {
    modeEdition.style.display = "flex";

    const logo = document.querySelector("#logo");
    logo.style.paddingTop = "25px";
    logo.style.fontSize = "17px";

    const navHeader = document.querySelector("#navHeader");
    navHeader.style.paddingTop = "25px";

    for (let i = 0; i < filters.length; i++) {
        filters[i].style.display = "none";
    }
    
    for (let i = 0; i < editBtn.length; i++) {
        editBtn[i].style.display = "flex";
    }

    // Changer login en logout

    logout.textContent = "logout";
    logout.setAttribute("href", "#");

    // Lorque l'on clic sur logout cela déconnecte l'utilisateur

    logout.addEventListener("click", event => {
        event.preventDefault();

        localStorage.removeItem("userId");
        localStorage.removeItem("auth");
        window.location.reload();
    });
}  


// fonction pour récuperer l'id utilisateur et le token

function getAuthorization() {
  const token = JSON.parse(localStorage.getItem('auth')).token;
  return 'Bearer ' + token;
}

// Fonction pour voir si l'utilisateur est connecté

function isConnected() {
  const connecting = getAuthorization() ? true : false;
  return connecting;
}



// Variables pour la modal suppression de projets

const modalDeleteWork = document.querySelector("#modalsSuppr");
const openGalleryModalBtn = document.querySelector("#projectEdit");
const closeGalleryModalBtn = document.querySelector("#fermer-suppr");

// Variables pour la modal ajout de projets

const modalAddWork = document.querySelector("#modalsAjout");
const openAddWork = document.querySelector("#AjoutPhoto");
const previousBtn = document.querySelector(".precedent");
const closeAddWorkModalBtn = document.querySelector("#fermer-ajout")

// Variables pour upload une image

const uploadImageInput = document.querySelector("#imageUpload");
const projectUpload = document.querySelector("#previewImage");
const uploadContent = document.querySelector("#previewdetails");
const submitProjet = document.querySelector("#validerAjout");
const backgroundPreview = document.querySelector(".AjoutPhotoContainer");

const addProjectForm = document.querySelector("#ajout-form");

// Variable pour background modal

const backgroundModal = document.querySelector("#modals");

// Fonction pour ouvrir modal galerie pour supprimer un projet et celle pour ajouter un projet

function openGalleryModal() {
    modalDeleteWork.style.display = "flex";
    backgroundModal.style.display = "block";
    addWorkModal();
}

function openAddWorkModal() {
    modalAddWork.style.display = "flex";
    backgroundModal.style.display = "block";
}

// Fonction pour fermeture des modals


function closeGalleryModal() {
    modalDeleteWork.style.display = "none";
    backgroundModal.style.display = "none";
}

function closeAddWorkModal() {
    modalAddWork.style.display = "none";
    backgroundModal.style.display = "none";
}

// Ouvrir les modals

if (openGalleryModalBtn) openGalleryModalBtn.addEventListener("click", openGalleryModal);
if (openAddWork) openAddWork.addEventListener("click", function() {
    closeGalleryModal();
    openAddWorkModal();
})

// Fermer les modals et précédent

closeGalleryModalBtn.addEventListener("click", closeGalleryModal);
closeAddWorkModalBtn.addEventListener("click", closeAddWorkModal);

previousBtn.addEventListener("click", function() {
    closeAddWorkModal();
    openGalleryModal();
    addWorkModal();
});

window.onclick = function (event) {
    if (event.target == backgroundModal) {
        closeAddWorkModal();
        closeGalleryModal();
    }
}


// Supprimer des photos

function deleteWork(event, id) {
    fetch('http://localhost:5678/api/works/' + id, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Authorization': getAuthorization(),
            'Content-Type': 'application/json',
        },
        params: {
            'id': id
        },
    })
    .then(() => {
        const parentDiv = event.parentNode;
        parentDiv.remove();
         const alert = document.getElementById('alert');
         alert.innerHTML = "Votre photo a été supprimé avec succès";
         alert.style.display = "block";
         setTimeout(() => { alert.style.display = "none"; }, 5000);
        
    })
    .catch((error) => {
     console.error('Error:', error);
    });
}

// Fonctions pour ajouter des projets


async function sendWorkData(data) {
   const postWorkUrl = 'http://localhost:5678/api/works';

    const response = await fetch(postWorkUrl, {
        method: "POST",
        headers: {
            'Authorization': getAuthorization()
        },
        body: data,
    });

    return response.json();
}

// Fonction pour gérer l'envoi du formulaire

async function handleFormSubmit(event) {
    event.preventDefault();

    // Vérifier que tous les champs obligatoires sont remplis

    if (!addProjectForm.checkValidity()) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    // Récupérer les valeurs du formulaire

    const title = addProjectForm.querySelector("#titreAjout").value;
    const category = addProjectForm.querySelector("#selectCategorie").value;
    const file = uploadImageInput.files[0];

    // Créer un objet FormData pour envoyer les données

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);

    // Envoyer les données et afficher la réponse

    try {
        const response = await sendWorkData(formData);
        console.log(response);
        
        const alert = document.getElementById('alert');
        alert.innerHTML = "Votre photo a été ajouté avec succès";
        alert.style.display = "block";
        setTimeout(function(){ alert.style.display = "none"; }, 5000);
        
    } catch (error) {
        console.error("Erreur :", error);
    }
}

// Ajout des événements pour gérer l'upload de photos

uploadImageInput.addEventListener("change", function () {
    uploadImage();
});

addProjectForm.addEventListener("submit", handleFormSubmit);

// Fonction pour afficher l'aperçu de l'image

function uploadImage() {
    if (uploadImageInput.files && uploadImageInput.files[0]) {
        const reader = new FileReader();
        const image = new Image();
        const fileName = uploadImageInput.files[0].name;

        reader.onload = event => {
            image.src = event.target.result;
            image.alt = fileName.split(".")[0];
        };

        uploadContent.style.display = "none";
        submitProjet.style.backgroundColor = "#1D6154";
        projectUpload.style.display = "block";
        backgroundPreview.style.backgroundColor = "#FFFFFF";
        reader.readAsDataURL(uploadImageInput.files[0]);
        projectUpload.appendChild(image);
    }
}