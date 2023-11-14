var actualId = document.querySelector('#accueil');

function switchToId(id)
{
    actualId.style.display = 'none';
    actualId = document.querySelector(id);
    actualId.style.display = 'block';
}

window.onload = function ()
{
    loadStadiums();
    document.querySelector('#stades').style = 'opacity: 255;';
    document.querySelector('#stades').style.display = 'none';

    loadAccueil();
    loadTeams();

    // redirect if width < 768px
    if (window.innerWidth > 1000) {
        // redirect url
        window.location.replace('/#');
    }
}

function loadAccueil() 
{
    var teams = getApi('teams');
    var stades = getApi('stadiums');
    var events = getApi('events')[0];
    var date = new Date(events["fields"]["start"]);
    var date = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric' });
    var stade = stades[events["fields"]["stadium"]]["fields"]["name"];

    team1 = teams[events["fields"]["team_home"]-1]["fields"]["country"];
    team2 = teams[events["fields"]["team_away"]-1]["fields"]["country"];
    countryalpha = teams[events["fields"]["team_home"]-1]["fields"]["country_alpha2"];
    countryalpha2 = teams[events["fields"]["team_away"]-1]["fields"]["country_alpha2"];
    nickname = teams[events["fields"]["team_home"]-1]["fields"]["nickname"];
    nickname2 = teams[events["fields"]["team_away"]-1]["fields"]["nickname"];


    document.querySelector('#teamOneImg').src = `../static/flags/${countryalpha}.svg`;
    document.querySelector('#teamTwoImg').src = `../static/flags/${countryalpha2}.svg`;
    document.querySelector('#teamOne').innerHTML = team1;
    document.querySelector('#teamTwo').innerHTML = team2;
    document.querySelector('#teamSurnameOne').innerHTML = nickname;
    document.querySelector('#teamSurnameTwo').innerHTML = nickname2;
    document.querySelector('#date').innerHTML = date;
    document.querySelector('#stadium').innerHTML = stade;

    document.querySelector('#coupenvoie').onclick = function() { qrcodeGenerate(events['pk']) };
}

function loadStadiums() 
{
    var stades = getApi('stadiums');

    stades.forEach((item, index) => {
        var longitude = item["fields"]["longitude"];
        var latitude = item["fields"]["latitude"];

        var nouveauBloc = document.createElement("div");
        nouveauBloc.innerHTML = 
`<div class="col-md-6 mb-5">
    <h3>${item["fields"]["name"]}</h3>
    <p>Retrouvez ce stade à <strong></strong> ${item["fields"]["location"]}.</p>
    <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik" width="90%" height="500" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
    <br>
    <a class="btn btn-primary" href="https://www.openstreetmap.org/#map=16/${latitude}/${longitude}" target="_blank" rel="noopener noreferrer">
        Agrandir la carte
    </a>
</div>;
`     
    var conteneurBloc = document.getElementById("getstadiums");
    conteneurBloc.appendChild(nouveauBloc);   
    })
}

function loadTeams() 
{
    var teams = getApi('teams');

    teams.forEach((item, index) => {

        var nouveauBloc = document.createElement("div");
        nouveauBloc.innerHTML = `
<div class="team col-md-6 mb-5">
    <h3 style="background: linear-gradient(to right, #${item["fields"]["color_first"]}, #${item["fields"]["color_second"]});">
        <span>${item["fields"]["country"]}</span>
    </h3>
    <div clconteneurBlocass="desc">
        <ul>
            <li><strong>Surnom :</strong> ${item["fields"]["nickname"]}</li>
        </ul>
    </div>
</div>
`     
    var conteneurBloc = document.getElementById("getteams");
    conteneurBloc.appendChild(nouveauBloc);   
    })
}

async function qrcodeGenerate(id) {
    fetch(`http://127.0.0.1:8000/qrcode/${id}`)
        .then(response => response.json())
        .then(result => {
            const resultElement = document.querySelector("#coupenvoie");
            resultElement.innerHTML = `<img width="50%" src="${result["qrurl"]}" alt=""/>`;
    }) 
}


function getApi(searchQuery) 
{
    var apiURL =
        "http://127.0.0.1:8000/api/" + searchQuery;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiURL, false);
    xhr.send();

    if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        return data
    }

    return [];
}
