//#region accordion logic

function toggleDescription(event) {
    event.preventDefault(); // Previene la navegación del enlace
  
    // Encuentra la descripción y la flecha del elemento actual
    var currentDescription = this.querySelector('.keyThemesDescription');
    var currentArrow = this.querySelector('.keyThemesPreview > svg');
    var isCurrentlyOpen = currentDescription.style.display === 'flex';

    // Cierra todos los elementos
    document.querySelectorAll('.keyThemesElement').forEach(function(element) {
        var description = element.querySelector('.keyThemesDescription');
        var arrow = element.querySelector('.keyThemesPreview > svg');

        description.style.display = 'none'; // Cierra la descripción
        arrow.style.transform = 'rotate(0deg)'; // Reinicia la rotación de la flecha
    });

    // Si la descripción actual estaba cerrada, la abre y rota la flecha
    // Si estaba abierta y se clickea, se cierra
    if (!isCurrentlyOpen) {
        currentDescription.style.display = 'flex';
        currentArrow.style.transform = 'rotate(180deg)';
    }
}

// Agrega el listener a todos los .keyThemesElement
var elements = document.querySelectorAll('.keyThemesElement');
elements.forEach(function(element) {
    element.addEventListener('click', toggleDescription);
});

//#endregion
