var actualId = document.querySelector('#accueil');

function switchToId(id) {
    actualId.style.display = 'none';
    actualId = document.querySelector(id);
    actualId.style.display = 'block';
}

function initialLoad() {
    document.querySelector('#stades').style = 'opacity: 255;';
    document.querySelector('#stades').style.display = 'none';

}

