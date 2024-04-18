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
  
// Esta función construye el HTML para cada booth y lo agrega al content-container
function displayBooths(booths) {
    var container = document.getElementById('dynamic-content-container');
    // container.innerHTML = ''; // Comentado para evitar limpiar el contenedor cada vez que se llama a esta función

    booths.forEach(function(booth) {
        var boothLink = document.createElement('a');
        boothLink.className = 'booth-selector simple';
        // Actualizamos el href para apuntar a la URL deseada con el id del booth
        boothLink.href = `booths/booth?id=${booth.id}`;

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

// Función para construir el HTML para cada servicio y agregarlo al static-content-container
function displayServices(services) {
  var container = document.getElementById('static-content-container');
  services.forEach(function(service) {
      var serviceElement = document.createElement('div');
      serviceElement.className = 'service-entry';
      
      var icon = document.createElement('img');
      icon.className = 'service-icon';
      icon.src = '../../assets/services/' + service.icon; // Asegúrate de que la ruta es correcta
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

// Función para construir el HTML para cada autor y agregarlo al static-content-container
function displayAuthors(authors) {
    var container = document.getElementById('static-content-container');
    authors.forEach(function(author) {
        var authorElement = document.createElement('div');
        authorElement.className = 'author-entry';

        // Crear un contenedor para el tiempo y el título
        var timeTitleContainer = document.createElement('div');
        timeTitleContainer.className = 'time-title-container';

        var time = document.createElement('div');
        time.className = 'author-time';
        time.textContent = author.time;
        timeTitleContainer.appendChild(time); // Añadir tiempo al contenedor de tiempo y título

        var title = document.createElement('div');
        title.className = 'author-title';
        title.textContent = author.title;
        timeTitleContainer.appendChild(title); // Añadir título al contenedor de tiempo y título

        // Añadir el contenedor de tiempo y título al elemento del autor
        authorElement.appendChild(timeTitleContainer);

        var description = document.createElement('div');
        description.className = 'author-description';
        description.textContent = author.description;
        authorElement.appendChild(description);

        // Crear un contenedor para la imagen y el nombre del autor
        var authorInfoContainer = document.createElement('div');
        authorInfoContainer.className = 'author-info';

        var picture = document.createElement('img');
        picture.className = 'author-picture';
        picture.src = '../../assets/talkers/' + author.picture;
        authorInfoContainer.appendChild(picture); // Añadir imagen al contenedor de información del autor

        var name = document.createElement('div');
        name.className = 'author-name';
        name.textContent = author.author;
        authorInfoContainer.appendChild(name); // Añadir nombre al contenedor de información del autor

        // Añadir el contenedor de información del autor al elemento del autor
        authorElement.appendChild(authorInfoContainer);

        // Añadir el elemento del autor al contenedor principal
        container.appendChild(authorElement);

        // Añadir un separador entre elementos del autor
        var separator = document.createElement('div');
        separator.className = 'booth-separator';
        container.appendChild(separator);
    });
}

// Función para cargar los booths desde booths-db.json
function loadBooths(nbParam) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'booths/booths-db.json', true);
  xhr.onload = function() {
      if (xhr.status === 200) {
          var boothsData = JSON.parse(xhr.responseText);
          // Asegúrate de que utilizas 'area' en lugar de 'areas' si ese es el nombre de tu propiedad en el JSON
          var filteredBooths = boothsData.entries.filter(function(booth) {
              return booth.area === nbParam;
          });
          displayBooths(filteredBooths);
          loadHitboxes(filteredBooths); // Si necesitas cargar hitboxes
      } else {
          console.error('No se pudo cargar el archivo JSON de booths.');
      }
  };
  xhr.onerror = function() {
      console.error('Error de conexión al intentar cargar el archivo JSON de booths.');
  };
  xhr.send();
}

// Función para cargar los servicios desde services.json
function loadServices(nbParam) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'booths/services.json', true);
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

// Función para cargar la lista de autores y mostrarlos en el contenedor
function loadAuthors() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'booths/talks.json', true); // Asegúrate de que la URL es correcta
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
  
// Función para agregar los hitboxes al SVG y envolverlos en un anchor con href que contiene el ID del booth
function loadHitboxes(booths) {
    var svgElement = document.getElementById('hitbox-map'); // Asegúrate de que este es el ID correcto del SVG en tu HTML
    svgElement.innerHTML = ''; // Limpiar cualquier path existente antes de agregar nuevas
    booths.forEach(function(booth) {
      if (booth.hitbox && booth.id) { // Asegurarse de que el booth tiene hitbox e ID
        var anchor = document.createElementNS('http://www.w3.org/2000/svg', 'a'); // Crear el elemento anchor
        anchor.setAttribute('href', `booth/booth.html?id=${booth.id}`); // Usar el ID del booth para construir la URL
        anchor.setAttribute('xlink:href', `booths/booth.html?id=${booth.id}`); // Para compatibilidad con navegadores más antiguos
  
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


// Función para obtener el valor de un parámetro específico de la URL
function obtenerParametroURL(nombre) {
    nombre = nombre.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + nombre + '(=([^&#]*)|&|#|$)'),
        resultados = regex.exec(window.location.href);
    if (!resultados) return null;
    if (!resultados[2]) return '';
    return decodeURIComponent(resultados[2].replace(/\+/g, ' '));
}

// Función para cambiar el 'src' de la imagen basada en el parámetro 'nb'
function cambiarSrcImagen() {
    var parametroNB = obtenerParametroURL('nb'); // Obtiene el valor del parámetro 'nb'
    if (parametroNB) {
        var imagen = document.querySelector('#interactive-map'); // Selecciona la imagen que quieres cambiar
        imagen.src = "../../assets/neighbourhoods/nb_" + parametroNB + ".png"; // Cambia el src de la imagen
    }
}

// Ejecutar la función al cargar la página
window.onload = cambiarSrcImagen;
