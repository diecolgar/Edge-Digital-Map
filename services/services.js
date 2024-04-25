document.addEventListener('DOMContentLoaded', function() {
    fetch('../databases/services.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('services-container');

            data.entries.forEach(entry => {
                const element = document.createElement('div');
                element.className = 'service-entry';
                element.innerHTML = `
                    <div class="services-entry-container">
                        <img class="services-icon" src="../assets/services/${entry.icon}" alt="${entry.title} icon">
                        <h3 class="services-title">${entry.title}</h3>
                    </div>
                    <div class="services-separator"></div>
                `;

                container.appendChild(element);
            });
        })
        .catch(error => {
            console.error('Error fetching the services data:', error);
            const container = document.getElementById('services-container');
            container.innerHTML = `<p>Error loading services. Please try again later.</p>`;
        });
});


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