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
