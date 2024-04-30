// nb-detail.js
document.addEventListener('DOMContentLoaded', function() {
  var ptParam = getQueryParam('pt');
  if (ptParam) {
      updateContentTitle(ptParam);
      loadJourneysAndBooths(ptParam);
  } else {
      console.error('No se especificó el área o el parámetro de journey en la URL.');
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
          // iconPath = 'icon_ai.png';
          text = '(Gen)AI Path';
          break;
  }

  // Actualiza el SRC del icono y el texto
  titleIcon.style.backgroundImage = 'url(../../assets/maps/' + iconPath + ')';
  titleText.textContent = text;
}

function cambiarSrcImagen() {
  var parametroNB = getQueryParam('pt');
  if (parametroNB) {
      var imagen = document.querySelector('#interactive-map'); 
      imagen.src = "../../assets/maps/pt_" + parametroNB + ".png"; 
  }
}

window.onload = cambiarSrcImagen;



function loadJourneysAndBooths(ptParam) {
  fetch('../../databases/journeysmap.json')
      .then(response => response.json())
      .then(journeysData => {
          let matchedJourney = journeysData.journeys.find(journey => journey.id === ptParam);
          if (matchedJourney) {
              updateJourneyTitle(matchedJourney.title);  // Actualizar el título del journey
              fetch('../../databases/booths-db.json')
                  .then(response => response.json())
                  .then(boothsData => {
                      let nonSelectableBooths = boothsData.entries.filter(booth =>
                          matchedJourney.booths.some(journeyBooth => journeyBooth.id === booth.id && journeyBooth.type === "nonselectable"));
                      let highlightBooths = boothsData.entries.filter(booth =>
                          matchedJourney.booths.some(journeyBooth => journeyBooth.id === booth.id && journeyBooth.type === "highlight"));
                      let allBooths = boothsData.entries.filter(booth =>
                        matchedJourney.booths.some(journeyBooth => journeyBooth.id === booth.id));
                      
                      displayNonSelectableBooths(allBooths); // Función separada para todos los booths
                      displayHighlightBooths(highlightBooths); // Función separada para highlights
                  })
                  .catch(error => console.error('Error al cargar los booths:', error));
          } else {
              console.error('Journey no encontrado con el id:', ptParam);
          }
      })
      .catch(error => console.error('Error al cargar los journeys:', error));
}

const industryMappings = {
  "Consumer Products & Retail": "pt-journey-double.html?pt=consumer",
  "Energy": "pt-journey-double.html?pt=energy",
  "Financial Institutions": "pt-journey-double.html?pt=financial",
  "Health Care": "pt-journey-double.html?pt=health",
  "Industrial Goods": "pt-journey-double.html?pt=industrial",
  "Insurance": "pt-journey-double.html?pt=insurance",
  "Public Sector": "pt-journey-double.html?pt=public",
  "Tech, Media & Telecom": "pt-journey-double.html?pt=tech",
  "Travel, Cities & Infrastructure": "pt-journey-double.html?pt=travel"
};

function appendBooth(booth, container, isInteractive, isColored) {
  let boothDiv = document.createElement('div');
  boothDiv.className = 'booth-container' + (isInteractive ? ' highlight-class' : '');

  let arrowSVG = isInteractive ? `
    <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
      <path d="M5 7.76367L10 12.76367L15 7.76367" stroke="#21BF61" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>` : '';

  let detailsHTML = isInteractive ? `
    <div class="details-description">${booth.description}</div>
    <div class="details-label">About</div>
    <div class="details-about">${booth.about}</div>
    <div class="details-label">Related Industries</div>
    <div class="details-industries">
      ${booth.relatedIndustries.map(industry => `
        <a href="${industryMappings[industry] || 'pt-journey-single.html'}" class="details-industry">
          ${industry}
        </a>`).join('')}
    </div>
    <div class="details-label">Booth Contacts</div>
    <div class="path-booth-contacts">
      <div class="contact">${booth.boothContacts.map(contact => `${contact.name}${contact.email !== '' ? ' _ ' + contact.email : ''}`).join(', ')}</div>
    </div>` : '';

  let boothNumberHTML = isColored ? `<div class="path-booth-number" style="background-color: ${booth.color}">${booth.number}</div>` : `<div class="path-booth-number" style="background-color: white; color: ${booth.color}">${booth.number}</div>`;

  boothDiv.innerHTML = `
    <div class="path-booth-preview" ${isInteractive ? 'onclick="toggleDetails(this)"' : ''}>
      <div class="path-booth-info">
        ${boothNumberHTML}
        <div class="path-booth-id">${booth.id}</div>
        <div class="path-booth-title">${booth.title}</div>
      </div>
      ${arrowSVG}
    </div>
    <div class="path-booth-details" style="display: none;">
      ${detailsHTML}
    </div>
  `;
  container.appendChild(boothDiv);

  if (isInteractive) {
    let separator = document.createElement('div');
    separator.className = 'path-separator';
    container.appendChild(separator);
  }
}



function displayNonSelectableBooths(booths) {
  booths.forEach(booth => {
      let areaContainerId = `${booth.area}KeyThemes`;
      let areaContainer = document.getElementById(areaContainerId);
      if (!areaContainer) {
          console.warn(`No se encontró el contenedor para la área: ${booth.area}`);
          return;
      }
      let boothsContainer = areaContainer.querySelector('.booths-container');
      appendBooth(booth, boothsContainer, true, false); // Utiliza el formato no interactivo para todos
  });
}

function displayHighlightBooths(booths) {
  const highlightContainer = document.getElementById('highlights');
  booths.forEach(booth => {
      appendBooth(booth, highlightContainer, true, true); // Interactivo
  });
}

function updateJourneyTitle(title) {
  var pathTitleDiv = document.getElementById('path-title');
  if (pathTitleDiv) {
      pathTitleDiv.textContent = title;
  } else {
      console.error('El elemento para el título del journey no fue encontrado.');
  }
}



function toggleDetails(element) {
  var details = element.nextElementSibling;
  var arrow = element.querySelector('.arrow-icon');
  var isExpanded = details.style.display === 'block';

  document.querySelectorAll('.path-booth-details').forEach(detail => {
    detail.style.display = 'none';
    let otherArrow = detail.previousElementSibling.querySelector('.arrow-icon');
    if (otherArrow) {
      otherArrow.style.transform = 'rotate(0deg)'; // Asegúrate de que todas las otras flechas se restablezcan
    }
  });

  details.style.display = isExpanded ? 'none' : 'block';
  arrow.style.transform = isExpanded ? 'rotateX(0deg)' : 'rotateX(180deg)'; // Rota la flecha cuando se expande
}



function showMapPopup() {
  var popup = document.getElementById('map-popup');
  popup.style.visibility = 'visible';
  popup.style.opacity = '1';

  // Iniciar un temporizador para "fade out" después de 2 segundos
  setTimeout(function() {
      // Inicia la transición de opacidad a 0
      popup.style.opacity = '0';

      // Esperar 500 ms para coincidir con la duración de la transición de opacidad
      // y luego cambiar la visibilidad
      setTimeout(function() {
          popup.style.visibility = 'hidden';
      }, 500);
  }, 2000);
}

// Añadir el evento onclick al contenedor
document.getElementById('map-container').onclick = showMapPopup;
