// Función para obtener el valor de un parámetro específico de la URL
function getQueryParameter(nombre) {
    var search = window.location.search.substring(1);
    var vars = search.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] === nombre) {
            return decodeURIComponent(pair[1]);
        }
    }
    // Si no se encuentra el parámetro, retorna null
    return null;
}

  
// Función para cargar los journeys desde un JSON y luego buscar los booths
function loadJourneysAndBooths(ptParam) {
    fetch('../../databases/journeysmap.json')
      .then(response => response.json())
      .then(journeysData => {
        let matchedJourney = journeysData.journeys.find(journey => journey.id === ptParam);
        if (matchedJourney) {
          fetch('../../databases/booths-db.json')
            .then(response => response.json())
            .then(boothsData => {
              let matchedBooths = boothsData.entries.filter(booth => 
                matchedJourney.booths.some(journeyBooth => journeyBooth.id === booth.id));
              // Pasar tanto los booths como la información de los booths en el journey para usar el tipo
              displayPathBooths(matchedBooths, matchedJourney.booths);
            })
            .catch(error => console.error('Error al cargar los booths:', error));
        } else {
          console.error('Journey no encontrado con el id:', ptParam);
        }
      })
      .catch(error => console.error('Error al cargar los journeys:', error));
  }
  
  
// Función para mostrar los booths en el contenedor
function displayPathBooths(booths, journeyBooths) {
    var container = document.getElementById('path-content-container');
    container.innerHTML = '';  // Limpiar el contenedor antes de agregar nuevo contenido

    booths.forEach(booth => {
      let boothDiv = document.createElement('div');
      boothDiv.className = 'booth-container';  // Nombre genérico nuevo para el contenedor del booth

      // Encuentra el tipo de booth desde journeyBooths
      let boothInfo = journeyBooths.find(jb => jb.id === booth.id);
      let typeClass = boothInfo && boothInfo.type === 'highlight' ? 'highlight-class' : 'normal-class';

      // Construcción del contenido interno con nombres de clases nuevos
      boothDiv.innerHTML = `
        <div class="booth-preview">
            <div class="booth-info">
                <img class="booth-icon" src="/assets/neighbourhoods/icon_${booth.area}.svg" alt="">
                <div class="booth-label">${booth.title}</div>
            </div>
        </div>
        <div class="booth-details">
            <div class="details-title">${booth.title}</div>
            <div class="details-description">${booth.description}</div>
            <div class="details-summary">${booth.about.summary}</div>
            <ul class="details-benefits">
                ${booth.about.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
            <div class="details-industries">Related Industries: ${booth.relatedIndustries.join(', ')}</div>
            <div class="booth-contacts">
                <h3>Contacts:</h3>
                ${booth.boothContacts.map(contact => `<div class="contact"><strong>${contact.name}</strong>, ${contact.role}</div>`).join('')}
            </div>
            <a class="details-link" href="nb-detail/nb-detail.html?nb=${booth.area}">
                Explore the theme
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                    <path d="M5.25 10.5527L8.75 7.05273L5.25 3.55273" stroke="white" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </a>
        </div>
      `;
      
      // Aplicar la clase basada en el tipo de booth
      boothDiv.classList.add(typeClass);
      
      container.appendChild(boothDiv);
    });
}


  // Evento que se dispara cuando se carga la página
  document.addEventListener('DOMContentLoaded', function() {
    var ptParam = getQueryParameter('pt');
    if (ptParam) {
      loadJourneysAndBooths(ptParam);
    } else {
      console.error('No se especificó el parámetro de journey en la URL.');
    }
  });
  