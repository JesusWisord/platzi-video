import '../css/css_dev.css'

const BASE_API = 'https://yts.lt/api/v2/list_movies.json';

// Constantes de contenedores con selectores

console.log("hola")

const $actionContainer = document.querySelector("#action-list")
const $terrorContainer = document.querySelector("#terror-list")
const $animationContainer = document.querySelector("#animation-list")
const $modalContainer = document.getElementById("modal-container");
const $modalImage = $modalContainer.querySelector('img');
const $modalTitle = $modalContainer.querySelector('h1');
const $modalDescription = $modalContainer.querySelector('p');
const $formSearchBar = document.querySelector('.search-form')

$modalContainer.addEventListener("click", () => 
      $modalContainer.style.animation='modalOut .9s forwards'
      )

load()

// Función asíncrona de carga

async function load (){

  // Funcion para obtener data de una url
  async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  $formSearchBar.addEventListener('submit', async (event) =>{
    event.preventDefault();
    const data = new FormData($formSearchBar)
      try {
        const {
          data: {
            movies: foundMovie
          }
        } = await getData(`${BASE_API}?limit=1&query_term=${data.get('name')}`)
        if (foundMovie){
          $modalContainer.style.animation='modalIn .9s forwards';
          $modalTitle.textContent = foundMovie[0].title;
          $modalImage.setAttribute('src', foundMovie[0].medium_cover_image);
          $modalDescription.textContent = foundMovie[0].description_full;
        }
        else
        {
          alert("Pelicula no encontrada")
        }
      }
      catch(error){
        alert(error.message);
      }
    
    })

  // function para añadir el evento click
  function addEventClick($element, list){
    $element.addEventListener("click", () =>{
    showModal($element, list);
  } );
  }

  // funcion para mostrar el modal
  function showModal($element, list){
    const pelicula = list.find(pelicula => {
      return pelicula.id===parseInt($element.dataset.id, 10);
    })
    $modalContainer.style.animation='modalIn .9s forwards';
    $modalTitle.textContent = pelicula.title;
    $modalImage.setAttribute('src', pelicula.medium_cover_image);
    $modalDescription.textContent = pelicula.description_full;
  }


// Funcion que checa si existe caché en memoria con modificaciones
// para correr en navegadores tipo brave
  async function cacheExist(category){
    var cacheData=null;
    var categoryList= `${category}List`;
    try {
      cacheData = window.localStorage.getItem(categoryList);
    } catch (error) {
      const {data: {
        movies: dataList } } = await getData(`${BASE_API}?genre=${category}`);
    }
    if (cacheData){
      return JSON.parse(cacheData);
    }
    const {data: {
      movies: dataList } } = await getData(`${BASE_API}?genre=${category}`);
    try{
      window.localStorage.setItem(categoryList, JSON.stringify(dataList));  }
    catch{
      console.log("No se puere")
    }
    return dataList;

  }

  var actionList=await cacheExist('action');

  var terrorList = await cacheExist('horror');

  var animationList = await cacheExist('animation');

    function itemTemplate(movie){
        return `<div class="item" data-id="${movie.id}">
        <div class="image">
          <img src="${movie.medium_cover_image}" alt="">
        </div>
        <p class="title">
            ${movie.title}
          </p>
      </div>`
    }

    function HTMLTemplate(HTMLString) {
      const html = document.implementation.createHTMLDocument();
      html.body.innerHTML = HTMLString;
      return html.body.children[0];
    }

    function renderList(list, $container) {
      // actionList.data.movies
      $container.children[0].remove();
      list.forEach((movie) => {
        const HTMLString = itemTemplate(movie);
        const movieElement = HTMLTemplate(HTMLString);
        $container.append(movieElement);
        addEventClick(movieElement, list);
      })
    }

    renderList(actionList, $actionContainer);
    renderList(terrorList, $terrorContainer);
    renderList(animationList, $animationContainer);

}