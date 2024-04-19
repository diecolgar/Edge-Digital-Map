document.addEventListener("DOMContentLoaded", function() {
    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    const boothId = getParameterByName('id');

    // Carga el archivo JSON de los datos del booth
    fetch('../../../databases/booths-db.json')
        .then(response => response.json())
        .then(data => {
            const booths = data.entries;
            const booth = booths.find(b => b.id === boothId);

            if (booth) {
                const contentTitleText = document.getElementById('content-title-text');
                const dynamicContentContainer = document.getElementById('dynamic-content-container');
                const imagen = document.querySelector('#interactive-map');
                const hitboxMap = document.querySelector('#hitbox-map');
                const highlightMap = document.querySelector('#highlight-map');
                const mapLabel = document.querySelector('#map-label'); 

                // Configurando el título y la descripción del booth
                contentTitleText.textContent = booth.title;
                dynamicContentContainer.innerHTML = `
                    <p>${booth.description}</p>
                    <p><strong>Área:</strong> ${booth.area} ${booth.number ? ', Stand Número: ' + booth.number : ''}</p>
                    <p><strong>Contactos:</strong></p>
                    <ul>
                        ${booth.boothContacts.map(contact => `<li>${contact.name} - ${contact.role}</li>`).join('')}
                    </ul>
                `;

                // Configura el src de la imagen basada en el área del booth
                if (booth.area) {
                    imagen.src = `../../../assets/neighbourhoods/bt_${booth.area.toLowerCase()}.png`;
                    mapLabel.setAttribute('href', `../nb-detail.html?nb=${booth.area}`); // Ajusta el href con la área del booth
                }

                // Estableciendo el highlight específico para este booth
                highlightMap.innerHTML = booth.highlight;

                // Estableciendo todos los hitboxes del mismo área con enlaces
                hitboxMap.innerHTML = ''; // Limpia cualquier hitbox existente
                booths.filter(b => b.area === booth.area).forEach(b => {
                    if (b.hitbox && b.id) { // Asegúrate de que cada booth tiene hitbox e ID
                        const anchor = document.createElementNS('http://www.w3.org/2000/svg', 'a');
                        anchor.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `booth.html?id=${b.id}`);
                        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        const hitboxElement = new DOMParser().parseFromString(b.hitbox, 'text/html').body.querySelector('path');
                        pathElement.setAttribute('d', hitboxElement.getAttribute('d'));
                        pathElement.setAttribute('opacity', '0'); // Establece la opacidad según necesites
                        pathElement.setAttribute('fill', 'white'); // El color del fill
                        anchor.appendChild(pathElement);
                        hitboxMap.appendChild(anchor);
                    }
                });
            } else {
                contentTitleText.textContent = 'Booth no encontrado';
                mapLabel.setAttribute('href', '../nb-detail.html'); // O cualquier URL predeterminada que desees
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos del booth:', error);
            document.getElementById('content-title-text').textContent = 'Error al cargar la información';
        });
});
