const auth = "563492ad6f91700001000001778f92c8b16a4f459e2b25eaf5eece96";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
const scrollUp = document.querySelector(".scroll-up");
const header = document.querySelector("header");
let page = 1;
let fetchLink;
let searchValue;
let currentSearch;

scrollUp.style.opacity = "0";

searchInput.addEventListener("input", updateInput);

window.addEventListener("scroll", (event) => {
    let scroll = this.scrollY;
    if(scroll >= 1000) scrollUp.style.opacity = "1";
    else scrollUp.style.opacity = "0";
    if(scroll >= 100) header.style.position = "fixed";
    else header.style.position = "initial";
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    searchPhotos(searchValue);
});

more.addEventListener("click", loadMore);

scrollUp.addEventListener("click", () => {
    scrollTo(0, 0);
});

function updateInput(e) {
    searchValue = e.target.value;
    currentSearch = searchValue;
}

async function fetchApi(url) {
    const dataFetch = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: auth
        }
    });
    const data = await dataFetch.json();
    return data;
}

function generatePhotos(data) {
    data.photos.forEach(photo => {
        const galleryImg = document.createElement("div");
        galleryImg.classList.add("gallery-img");
        galleryImg.innerHTML = 
        `  
        <div class="gallery-info">
            <p>${photo.photographer}</p>
            <a href="${photo.src.original}" target="_blank">Download</a>
        </div>
        <img src=${photo.src.large}>
        `;
        gallery.appendChild(galleryImg);
    });
}

async function curatedPhotos() {
    fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";
    const data = await fetchApi(fetchLink);
    generatePhotos(data);
}

async function searchPhotos(query) {
    clear();
    fetchLink = `https://api.pexels.com/v1/search?query=${query}+query&per_page=15&page=1`;
    const data = await fetchApi(fetchLink);
    generatePhotos(data);
}

function clear() {
    gallery.innerHTML = "";
    searchInput.value = "";
}

async function loadMore() {
    page++;
    if(currentSearch) fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`;
    else fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
    const data = await fetchApi(fetchLink);
    generatePhotos(data);
}

curatedPhotos();