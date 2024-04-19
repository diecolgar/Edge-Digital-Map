// nb-detail.js
document.addEventListener('DOMContentLoaded', function() {
  var ptParam = getQueryParam('pt');
  console.log(ptParam)
  if (ptParam) {
    //   loadBooths(ptParam); // Carga los booths basados en el parámetro de área
      updateContentTitle(ptParam); // Actualiza el título y el icono basado en el parámetro de área
    } else {
    console.error('No se especificó el área en la URL.');
    }
});

// Esta función obtiene el valor de un parámetro de la URL por su nombre
function getQueryParam(param) {
  var search = window.location.search.substring(1);
  var vars = search.split('&');
  for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0] === param) {
          return decodeURIComponent(pair[1]);
      }
  }
  return null;
}
  
  function updateContentTitle(ptParam) {
    var titleIcon = document.getElementById('content-title-icon');
    var titleText = document.getElementById('content-title-text');

    var iconPath = '';
    var text = '';

    console.log(ptParam)
    switch (ptParam) {
        case 'ai': // Assuming this is the (Gen)AI Path from the last screenshot
            iconPath = 'icon_ai.png';
            text = '(Gen)AI Path';
            break;
    }

    // Actualiza el SRC del icono y el texto
    titleIcon.style.backgroundImage = 'url(../../assets/neighbourhoods/' + iconPath + ')'; // Asegúrate de que la ruta es correcta
    titleText.textContent = text;
}
  
function cambiarSrcImagen() {
    var parametroNB = getQueryParam('pt');
    if (parametroNB) {
        var imagen = document.querySelector('#interactive-map'); 
        imagen.src = "../../assets/neighbourhoods/pt_" + parametroNB + ".png"; 
    }
    if (parametroNB === 'ai') {
        document.querySelector('.nb-interactive-label').style.display = 'none'
        document.querySelector('.nb-no-interactive-label').style.display = 'flex'
    }
}

window.onload = cambiarSrcImagen;


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
//   container.innerHTML = '';  // Limpiar el contenedor antes de agregar nuevo contenido

  // Ordenar booths: primero 'highlight', luego 'nonselectable', finalmente el resto
  booths.sort((a, b) => {
    let aInfo = journeyBooths.find(jb => jb.id === a.id);
    let bInfo = journeyBooths.find(jb => jb.id === b.id);
    let aPriority = aInfo.type === 'highlight' ? 1 : (aInfo.type === 'nonselectable' ? 2 : 3);
    let bPriority = bInfo.type === 'highlight' ? 1 : (bInfo.type === 'nonselectable' ? 2 : 3);
    return aPriority - bPriority;
  });

  // Mostrar cada booth en el orden establecido
  booths.forEach(booth => {
    let boothDiv = document.createElement('div');
    boothDiv.className = 'booth-container';

    let boothInfo = journeyBooths.find(jb => jb.id === booth.id);
    let isHighlight = boothInfo && boothInfo.type === 'highlight';
    let isNonSelectable = boothInfo && boothInfo.type === 'nonselectable';
    
    boothDiv.innerHTML = `
    <div class="path-booth-preview" onclick="${isHighlight ? 'toggleDetails(this)' : ''}">
        <div class="path-booth-info">
            <div class="path-booth-number" style="${isNonSelectable ? 'display: none;' : `background-color: ${booth.color}`}">${booth.number}</div>
            <div class="path-booth-id">${booth.id}</div>
            <div class="path-booth-title">${booth.title}</div>
        </div>
        ${isHighlight ? `<svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
          <path d="M5 7.76367L10 12.7637L15 7.76367" stroke="#21BF61" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>` : ''}
    </div>
    ${!isNonSelectable ? `
    <div class="path-booth-details" style="display: ${isHighlight ? 'none' : 'block'};">
        <div class="details-description">${booth.description}</div>
        <div class="details-label">About</div>
        <div class="details-about">${booth.about}</div>
        <div class="details-label">Related Industries</div>
        <div class="details-industries">
          ${booth.relatedIndustries.map(industry => `<div class="details-industry">${industry}</div>`).join('')}
        </div>
        <div class="details-label">Booth Contacts</div>
        <div class="path-booth-contacts">
        <div class="contact">${booth.boothContacts.map(contact => `${contact.name}`).join(', ')}</div>
        </div>
    </div>` : ''}
    `;
    
    // Agrega clases adicionales basadas en el tipo de booth
    if (isHighlight) {
      boothDiv.classList.add('highlight-class');
    } else if (isNonSelectable) {
      boothDiv.classList.add('nonselectable-class');
    } else {
      boothDiv.classList.add('normal-class');
    }
    
    container.appendChild(boothDiv);


  });
}


// Función para alternar la visibilidad de los detalles de un booth
function toggleDetails(element) {
  var details = element.nextElementSibling;
  var isExpanded = details.style.display === 'block';
  // Cerrar todos los detalles abiertos
  document.querySelectorAll('.path-booth-details').forEach(detail => {
      detail.style.display = 'none';
  });
  // Expandir o colapsar el actual
  details.style.display = isExpanded ? 'none' : 'block';
}

document.addEventListener('DOMContentLoaded', function() {
  var ptParam = getQueryParam('pt');
  if (ptParam) {
    loadJourneysAndBooths(ptParam);
  } else {
    console.error('No se especificó el parámetro de journey en la URL.');
  }
});

