//#region accordion logic

function toggleDescription(event) {
    event.preventDefault();
    
    var keyThemeElement = this.parentNode; // Referencia al elemento padre .keyThemesElement
    var currentDescription = keyThemeElement.querySelector('.keyThemesDescription');
    var currentArrow = this.querySelector('svg'); // Referencia al svg dentro de .keyThemesPreview
    var isCurrentlyOpen = keyThemeElement.classList.contains('active');

    // Cierra todos los elementos excepto el actual (permite que el mismo toggle cierre si está abierto)
    document.querySelectorAll('.keyThemesElement').forEach(function(element) {
        if (element !== keyThemeElement) {
            element.classList.remove('active');
            var arrow = element.querySelector('.keyThemesPreview > svg');
            if (arrow) { // Verifica si la flecha existe antes de intentar cambiar su estilo
                arrow.style.transform = 'rotate(0deg)';
            }
        }
    });

    // Si el elemento actual no estaba abierto, ábrelo
    if (!isCurrentlyOpen) {
        keyThemeElement.classList.add('active');
        currentArrow.style.transform = 'rotateX(180deg)';
    } else {  // Si estaba abierto y se clickea, ciérralo
        keyThemeElement.classList.remove('active');
        currentArrow.style.transform = 'rotateX(0deg)';
    }
}

// Agrega el listener a todos los .keyThemesPreview
var previews = document.querySelectorAll('.keyThemesPreview');
previews.forEach(function(preview) {
    preview.addEventListener('click', toggleDescription);
});



//#endregion
