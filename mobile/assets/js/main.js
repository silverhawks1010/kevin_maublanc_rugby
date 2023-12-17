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
    getApi('events').forEach((event) => {
        loadMatch(event);
    });
};

function loadAccueil() 
{
    var events = getApi('events')[0];
    var date = new Date(events["start"]);
    var date = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric' });

    document.querySelector('#teamOneImg').src = `assets/img/flags/${events["team_home_id"]["country_alpha2"]}.svg`;
    document.querySelector('#teamTwoImg').src = `assets/img/flags/${events["team_away_id"]["country_alpha2"]}.svg`;
    document.querySelector('#teamOne').innerHTML = events["team_home_id"]["country"];
    document.querySelector('#teamTwo').innerHTML = events["team_away_id"]["country"];
    document.querySelector('#teamSurnameOne').innerHTML = nickname = events["team_home_id"]["nickname"];
    document.querySelector('#teamSurnameTwo').innerHTML = nickname2 = events["team_away_id"]["nickname"];

    document.querySelector('#date').innerHTML = date;
    document.querySelector('#stadium').innerHTML = events["stadium_id"]["name"];
}

function loadMatch(event) {
    const getTeamInfo = (teamId) => {
        if (teamId == null) {
            return {
                team: '?',
                countryalpha: 'xx',
                nickname: '?'
            };
        }
        const teamInfo = teamId;
        return {
            team: teamInfo.country,
            countryalpha: teamInfo.country_alpha2,
            nickname: teamInfo.nickname
        };
    };

    const team1Info = getTeamInfo(event.team_home_id);
    const team2Info = getTeamInfo(event.team_away_id);

    const date = new Date(event.start).toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric' });
    const stade = event.stadium_id.name;

    if (document.querySelector(`#coupenvoie${event.id}`)) {
        matchBlock = document.querySelector(`#coupenvoie${event.id}`);
        setTimeout(function () {
            matchBlock.onclick = () => { frameTicket(event.id) };
            matchBlock.className = "match separator flip";
        }, 2000);
    }else {
        matchBlock = document.createElement("div");
        matchBlock.id = `coupenvoie${event.id}`;
        matchBlock.className = "match separator";
        matchBlock.onclick = () => frameTicket(event.id);
    }
    
    matchBlock.innerHTML = `
        <div class="teaminfo">
            <img class="tielements" id="teamOneImg" src="assets/img/flags/${team1Info.countryalpha}.svg" alt="">
            <p class="tielements" id="teamOne">${team1Info.team}</p>
            <p class="tielements" id="teamSurnameOne">${team1Info.nickname}</p>
        </div>
        <div class="teaminfo"> 
            <h2 class="versus">VS</h2>
            <p class="tielements" id="date">${date}</p> 
            <p class="tielements"  id="stadium">${stade}</p>
        </div>
        <div class="teaminfo">
            <img class="tielements" id="teamTwoImg" src="assets/img/flags/${team2Info.countryalpha}.svg" alt="">
            <p class="tielements" id="teamTwo">${team2Info.team}</p>
            <p class="tielements" id="teamSurnameTwo">${team2Info.nickname}</p>
        </div>`;
    if (document.querySelector(`#coupenvoie${event.id}`)) {
        return;
    }else {
        document.getElementById("matchsCont").appendChild(matchBlock);
    }

}

function loadStadiums() {
    getApi('stadiums').forEach((item, _) => {
        var longitude = item["fields"]["longitude"];
        var latitude = item["fields"]["latitude"];

        var nouveauBloc = document.createElement("div");
        nouveauBloc.innerHTML =
            `<div class="col-md-6 mb-5">
                <h3>${item["fields"]["name"]}</h3>
                <p>Retrouvez ce stade à <strong>${item["fields"]["location"]}</strong>.</p>
                <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude},${latitude},${longitude},${latitude}&layer=mapnik" width="90%" height="500" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                <br>
                <a class="btn btn-primary" href="https://www.openstreetmap.org/#map=16/${latitude}/${longitude}" target="_blank" rel="noopener noreferrer">
                    Agrandir la carte
                </a>
            </div>`;
            
        var conteneurBloc = document.getElementById("getstadiums");
        conteneurBloc.appendChild(nouveauBloc);
    })
}

function loadTeams() 
{
    getApi('teams').forEach((item, _) => {

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
    try {
        
        const selectorelement = document.querySelector(`#select${id}`);
        const category = selectorelement.options[selectorelement.selectedIndex].value;
        const response = await fetch(`http://127.0.0.1:8000/qrcode/${id}${category}/`);
        const result = await response.json();


        const resultElement = document.querySelector(`#coupenvoie${id}`);
        resultElement.innerHTML = `<button class="btn btn-primary" onclick="window.location.href='${result.qrurl}'">Télécharger l'image</button>`;
        resultElement.className = "match separator qrcode";

    } catch (error) {
        console.error('Erreur lors de la génération du QR code :', error);
    }
}

function frameTicket(id) {
    const frame = document.querySelector(`#coupenvoie${id}`)
    if (frame.classList.contains("qrcode")) {
        loadMatch(getApi('events')[id-1])
        return;
    }

    frame.innerHTML = `
        <div class="qrcard">
            <button class="btn btn-primary" onclick="frameTicket(${id})">X</button>
            <select id="select${id}" class="form-control">
                <option value="none">Choisissez votre place</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinium">Platinium</option>
            </select>
            <button class="btn btn-primary" onclick="qrcodeGenerate(${id})">Demander Ticket</button>
        </div>
    `;
    frame.className = "match separator qrcode flip";
    frame.onclick = "";
}

function getApi(searchQuery) 
{
    var apiURL =
        "http://127.0.0.1:8000/api/" + searchQuery + "/";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiURL, false);
    xhr.send();

    if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        return data
    }

    return [];
}
