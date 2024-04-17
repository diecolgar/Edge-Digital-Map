// nb-detail.js
document.addEventListener('DOMContentLoaded', function() {
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
        var container = document.getElementById('content-container');
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

            var separator = document.createElement('div');
            separator.className = 'booth-separator';
            container.appendChild(separator);

            container.appendChild(boothLink);
        });
    }
  
    // Función para cargar y procesar el JSON de booths
    function loadBooths() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'booths/booths-db.json', true);
      xhr.onload = function() {
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          var area = getQueryParam('nb'); // Obten el parámetro de la URL
          if (area) {
            var filteredBooths = data.entries.filter(function(entry) {
              return entry.area === area;
            });
            displayBooths(filteredBooths);
          } else {
            // Manejar el caso en que no se especifique el área en la URL
            console.error('No se especificó el área en la URL.');
          }
        } else {
          // Manejar errores al cargar el JSON
          console.error('No se pudo cargar el archivo JSON.');
        }
      };
      xhr.onerror = function() {
        // Manejar errores de conexión
        console.error('Error de conexión al intentar cargar el archivo JSON.');
      };
      xhr.send();
    }
  
    // Carga los booths cuando la página está lista
    loadBooths();
});
