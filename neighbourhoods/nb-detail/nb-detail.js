// nb-detail.js
document.addEventListener('DOMContentLoaded', function() {
  var nbParam = getQueryParam('nb');
  console.log(nbParam)
  if (nbParam) {
      loadBooths(nbParam); // Carga los booths basados en el parámetro de área
      loadServices(nbParam); // Carga los servicios basados en el parámetro de área
      updateContentTitle(nbParam); // Actualiza el título y el icono basado en el parámetro de área
    } else {
    console.error('No se especificó el área en la URL.');
    }

    if (nbParam === "th") {
    loadAuthors(); // Carga la lista de autores si nbParam es igual a "th"
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
  
// Esta función construye el HTML para cada booth y lo agrega al content-container
function displayBooths(booths) {
    var container = document.getElementById('dynamic-content-container');

    booths.forEach(function(booth) {
        var boothLink = document.createElement('a');
        boothLink.className = 'booth-selector simple';
        boothLink.href = `nb-detail/booth.html?id=${booth.id}`;

        var id = document.createElement('div');
        id.className = 'booth-id';
        id.textContent = booth.id;
        boothLink.appendChild(id);

        var title = document.createElement('div');
        title.className = 'booth-title';
        title.textContent = booth.title;
        boothLink.appendChild(title);

        var svgPlaceholder = document.createElement('span');
        svgPlaceholder.className = 'booth-arrow';
        svgPlaceholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> <path d="M9 18L15 12L9 6" stroke="#21BF61" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>';
        boothLink.appendChild(svgPlaceholder);

        container.appendChild(boothLink);

        var separator = document.createElement('div');
        separator.className = 'booth-separator';
        container.appendChild(separator);
    });
} 

function displayServices(services) {
  var container = document.getElementById('static-content-container');
  services.forEach(function(service) {
      var serviceElement = document.createElement('div');
      serviceElement.className = 'service-entry';
      
      var icon = document.createElement('img');
      icon.className = 'service-icon';
      icon.src = '../../assets/services/' + service.icon;
      serviceElement.appendChild(icon);

      var title = document.createElement('div');
      title.className = 'service-title';
      title.textContent = service.title;
      serviceElement.appendChild(title);
      
      container.appendChild(serviceElement);

      var separator = document.createElement('div');
      separator.className = 'booth-separator';
      container.appendChild(separator);
  });
}

// --- Only if Theathre
function displayAuthors(authors) {
    var container = document.getElementById('static-content-container');
    authors.forEach(function(author) {
        var authorElement = document.createElement('div');
        authorElement.className = 'author-entry';

        var timeTitleContainer = document.createElement('div');
        timeTitleContainer.className = 'time-title-container';

        var time = document.createElement('div');
        time.className = 'author-time';
        time.textContent = author.time;
        timeTitleContainer.appendChild(time); 

        var title = document.createElement('div');
        title.className = 'author-title';
        title.textContent = author.title;
        timeTitleContainer.appendChild(title); 

        authorElement.appendChild(timeTitleContainer);

        var description = document.createElement('div');
        description.className = 'author-description';
        description.textContent = author.description;
        authorElement.appendChild(description);

        var authorInfoContainer = document.createElement('div');
        authorInfoContainer.className = 'author-info';

        var picture = document.createElement('img');
        picture.className = 'author-picture';
        picture.src = '../../assets/talkers/' + author.picture;
        authorInfoContainer.appendChild(picture);

        var name = document.createElement('div');
        name.className = 'author-name';
        name.textContent = author.author;
        authorInfoContainer.appendChild(name); 

        
        authorElement.appendChild(authorInfoContainer);

        container.appendChild(authorElement);

        var separator = document.createElement('div');
        separator.className = 'booth-separator';
        container.appendChild(separator);
    });
}

// Función para cargar los booths desde booths-db.json
function loadBooths(nbParam) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '../../databases/booths-db.json', true);
  xhr.onload = function() {
      if (xhr.status === 200) {
          var boothsData = JSON.parse(xhr.responseText);
          var filteredBooths = boothsData.entries.filter(function(booth) {
              return booth.area === nbParam;
          });
          displayBooths(filteredBooths);
          loadHitboxes(filteredBooths);
      } else {
          console.error('No se pudo cargar el archivo JSON de booths.');
      }
  };
  xhr.onerror = function() {
      console.error('Error de conexión al intentar cargar el archivo JSON de booths.');
  };
  xhr.send();
}

function loadServices(nbParam) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '../../databases/services.json', true);
  xhr.onload = function() {
      if (xhr.status === 200) {
          var servicesData = JSON.parse(xhr.responseText);
          var filteredServices = servicesData.entries.filter(function(service) {
              return service.areas.includes(nbParam);
          });
          displayServices(filteredServices);
      } else {
          console.error('No se pudo cargar el archivo JSON de servicios.');
      }
  };
  xhr.onerror = function() {
      console.error('Error de conexión al intentar cargar el archivo JSON de servicios.');
  };
  xhr.send();
}

// --- Only if Theathre
function loadAuthors() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../../databases/talks.json', true); 
    xhr.onload = function() {
        if (xhr.status === 200) {
            var authorsData = JSON.parse(xhr.responseText);
            displayAuthors(authorsData.entries);
        } else {
            console.error('No se pudo cargar el archivo JSON de autores.');
        }
    };
    xhr.onerror = function() {
        console.error('Error de conexión al intentar cargar el archivo JSON de autores.');
    };
    xhr.send();
}
  
function loadHitboxes(booths) {
    var svgElement = document.getElementById('hitbox-map'); // Asegúrate de que este es el ID correcto del SVG en tu HTML
    svgElement.innerHTML = ''; // Limpiar cualquier path existente antes de agregar nuevas
    booths.forEach(function(booth) {
      if (booth.hitbox && booth.id) { // Asegurarse de que el booth tiene hitbox e ID
        var anchor = document.createElementNS('http://www.w3.org/2000/svg', 'a'); // Crear el elemento anchor
        anchor.setAttribute('href', `nb-detail/booth.html?id=${booth.id}`); // Usar el ID del booth para construir la URL
        anchor.setAttribute('xlink:href', `nb-detail/booth.html?id=${booth.id}`); // Para compatibilidad con navegadores más antiguos
  
        var newElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        // Extraer el atributo 'd' del hitbox HTML string usando DOMParser
        newElement.setAttribute('d', new DOMParser().parseFromString(booth.hitbox, 'text/html').body.firstChild.getAttribute('d'));
        newElement.setAttribute('opacity', '0.01');
        newElement.setAttribute('fill', 'white');
  
        anchor.appendChild(newElement); // Agregar el path al anchor
        svgElement.appendChild(anchor); // Agregar el anchor al SVG
      }
    });
  }


  function updateContentTitle(nbParam) {
    var titleIcon = document.getElementById('content-title-icon');
    var titleText = document.getElementById('content-title-text');

    var iconPath = '';
    var text = '';

    switch (nbParam) {
        case 'te':
            iconPath = 'icon_te.svg';
            text = 'Technology';
            break;
        case 'cs':
            iconPath = 'icon_cs.svg';
            text = 'Future of Sustainability';
            break;
        case 'cx':
            iconPath = 'icon_cx.svg';
            text = 'Customer Engagement';
            break;
        case 'pe':
            iconPath = 'icon_pe.svg';
            text = 'Strategy, People and Organization';
            break;
        case 'op':
            iconPath = 'icon_op.svg';
            text = 'Operations';
            break;
        case 'ai': // Assuming this is the (Gen)AI Path from the last screenshot
            iconPath = 'icon_ai.png';
            text = '(Gen)AI Path';
            break;
        case 'th': // Assuming this is the (Gen)AI Path from the last screenshot
        iconPath = 'icon_th.svg';
        text = 'Micro-Theater';
        break;
    }

    // Actualiza el SRC del icono y el texto
    titleIcon.style.backgroundImage = 'url(../../assets/neighbourhoods/' + iconPath + ')'; // Asegúrate de que la ruta es correcta
    titleText.textContent = text;
}
  
function cambiarSrcImagen() {
    var parametroNB = getQueryParam('nb');
    if (parametroNB) {
        var imagen = document.querySelector('#interactive-map'); 
        imagen.src = "../../assets/neighbourhoods/nb_" + parametroNB + ".png"; 
    }
    if (parametroNB === 'th') {
        document.querySelector('.nb-interactive-label').style.display = 'none'
        document.querySelector('.nb-no-interactive-label').style.display = 'flex'
    }
}

window.onload = cambiarSrcImagen;
