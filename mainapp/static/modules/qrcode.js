

const startScanner = () => {
    const videoElem = document.querySelector("#scanner video");
    
    const startElem = document.querySelector("#start");
    startElem.style.display = 'none';

    const qrScanner = new QrScanner(videoElem, (result) => {
        qrScanner.stop();
        console.log('Contenu du QR Code :', result);
        document.querySelector("#scanner").style.display = 'none';


        document.querySelector("#results").innerHTML = `<h3>Informations sur le ticket</h3> </h3> <h4> Le ticket est invalide ! </h4> <p> Veuillez scanner un ticket valide. </p>`;

        
        var ticketinfo = getApi('ticket/' + result)[0]["fields"];

        var teams = getApi('teams');
        var stades = getApi('stadiums');
        var events = getApi('events')[ticketinfo["event"]-1];

        var date = new Date(events["fields"]["start"]);
        var date = date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        var stade = stades[events["fields"]["stadium"]]["fields"]["name"];
        var country = stades[events["fields"]["stadium"]]["fields"]["location"];

        team1 = teams[events["fields"]["team_home"]-1]["fields"]["country"];
        team2 = teams[events["fields"]["team_away"]-1]["fields"]["country"];

        document.querySelector("#results").innerHTML = `
        <h3>Informations sur le ticket</h3>
        <p>Le ticket est de catégorie <strong>${ticketinfo["category"]}</strong> (${ticketinfo["price"]} ${ticketinfo["currency"]}).</p>
        <p>Place attribué : ${ticketinfo["seat"]}</p>
        
        <h3>Informations sur le match</h3>
        <p>Le match se déroulera le <strong>${date}</strong> au stade <strong>${stade}</strong> ( ${country} ) .</p>
        <p>Le match opposera <strong>${team1}</strong> à <strong>${team2}</strong>.</p>
`;
    });
    
    qrScanner.setCamera("environment");
    qrScanner.start();
}


document.querySelector("#start").addEventListener("click", () => {
    startScanner();
});

function setResult(result) {
    document.querySelector("#scanner").style.display = 'none';
    document.querySelector("#results").innerHTML = `<h3>Informations sur le ticket</h3> </h3> <h4> Le ticket est invalide ! </h4> <p> Veuillez scanner un ticket valide. </p>`;


    var ticketinfo = getApi('ticket/' + result)[0]["fields"];
    

    var teams = getApi('teams');
    var stades = getApi('stadiums');
    var events = getApi('events')[ticketinfo["event"]-1];

    var date = new Date(events["fields"]["start"]);
    var date = date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    var stade = stades[events["fields"]["stadium"]]["fields"]["name"];
    var country = stades[events["fields"]["stadium"]]["fields"]["location"];

    team1 = teams[events["fields"]["team_home"]-1]["fields"]["country"];
    team2 = teams[events["fields"]["team_away"]-1]["fields"]["country"];

    document.querySelector("#results").innerHTML = `
    <h3>Informations sur le ticket</h3>
    <p>Le ticket est de catégorie <strong>${ticketinfo["category"]}</strong> (${ticketinfo["price"]} ${ticketinfo["currency"]}).</p>
    <p>Place attribué : ${ticketinfo["seat"]}</p>
    
    <h3>Informations sur le match</h3>
    <p>Le match se déroulera le <strong>${date}</strong> au stade <strong>${stade}</strong> ( ${country} ) .</p>
    <p>Le match opposera <strong>${team1}</strong> à <strong>${team2}</strong>.</p>
`;
}


const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', event => {
    const file = fileSelector.files[0];
    if (!file) {
        return;
    }
    QrScanner.scanImage(file)
    .then(result => setResult(result))
    .catch(error => console.log(error || 'No QR code found.'));
});

// result => setResult(fileSelector, result)

function getApi(searchQuery) {
    var apiURL =
        "https://rugby.maublanc.net/api/" + searchQuery;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiURL, false);
    xhr.send();

    if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        return data
    }

    return [];
}
