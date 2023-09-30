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
    loadStadiums()
    loadTeams() 

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
    var date = date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    var stade = stades[events["fields"]["stadium"]]["fields"]["name"];
    team1 = teams[events["fields"]["team_home"]-1]["fields"]["country"];
    team2 = teams[events["fields"]["team_away"]-1]["fields"]["country"];

    document.querySelector('#coupenvoie').innerHTML = `Le premier match de la compétition se déroulera le <strong> ${date} </strong>
                        au stade <strong> ${stade} </strong> : ${team1} vs ${team2}.`;
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


function getApi(searchQuery) 
{
    var apiURL =
        "https://rugby.maublanc.net/api/" + encodeURIComponent(searchQuery);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiURL, false);
    xhr.send();

    if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        return data
    }

    return [];
}
