const gameStarted = localStorage.getItem('gameStarted') !== null && localStorage.getItem('gameStarted') == 'true';
const teamsJson = JSON.parse(localStorage.getItem('kingTeams'));
const hasTeams = teamsJson !== null && teamsJson.length !== 0;
var teams = [];

window.onload = function() {
    if (hasTeams) {
        console.log('Found Teams:');
        console.log(teamsJson);
        teams = teamsJson;
        for (var i = 0; i < teamsJson.length; i++) {
            const team = teamsJson[i];
            const teamList = document.getElementById('teamList');
            const teamDiv = document.createElement('div');
            teamDiv.textContent = team.teamName;
            teamDiv.onclick = function() {
                teamList.removeChild(teamDiv);
                removeTeamByName(teamDiv.textContent);
            };
            teamList.appendChild(teamDiv);
        }
        if (gameStarted) {
            startGame();
        }
    }
};

document.getElementById('teamInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTeam();
    }
});

function addTeam() {
    const teamInput = document.getElementById('teamInput');
    const teamName = teamInput.value.trim();
    if (teamName === '') {
        shakeElement(document.getElementById('addTeamButton'));
        return;
    }
    for (var i = 0; i < teams.length; i++) {
        const team = teams[i];
        if (team.teamName == teamName) {
            shakeElement(document.getElementById('addTeamButton'));
            setError('Team already exists!');
            return;
        }
    }

    const teamList = document.getElementById('teamList');
    const teamDiv = document.createElement('div');
    teamDiv.textContent = teamName;
    teamDiv.onclick = function() {
        teamList.removeChild(teamDiv);
        removeTeamByName(teamDiv.textContent);
    };

    teamList.appendChild(teamDiv);
    teams.push({teamName: teamName, points: 0});
    saveTeamsAsJson();
    teamInput.value = '';
}

function shakeElement(element) {
    // Add the 'shaking' class to trigger the animation
    element.classList.add('shaking');
    
    // Remove the class after the animation completes
    setTimeout(function() {
        element.classList.remove('shaking');
    }, 200);
}

function setError(message) {
    var element = document.getElementById('errorField')
    element.textContent = message;
    setTimeout(function() {
        if (element.textContent == message) {
            element.textContent = "";
        }
    }, 5000);
}

function removeTeamByName(teamName) {
    for (var i = 0; i < teams.length; i++) {
        if (teams[i].teamName == teamName) {
            teams.splice(i, 1);
            saveTeamsAsJson();
            return true; // Successfully removed
        }
    }
    return false; // Team not found
}

function saveTeamsAsJson() {
    const jsonString = JSON.stringify(teams);
    console.log('Saved Teams (queue) to local storage:');
    console.log(teams);
    localStorage.setItem('kingTeams', jsonString);
}

function startGame() {
    const teamList = document.getElementById('teamList');
    if (teamList.children.length < 7) {
        setError('You need at least 7 teams to start!');
        shakeElement(document.getElementById('startButton'));
        return;
    }
    if (!gameStarted) {
        shuffleArray(teams);
        resetTeamScores();
    }
    localStorage.setItem('gameStarted', true);
    loadGamePage();
}

function resetTeamScores() {
    teams.forEach((team) => team.points = 0);
    saveTeamsAsJson();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

function deleteAllTeams() {
    if (teams.length == 0) {
        shakeElement(document.getElementById('deleteAllButton'));
    }
    const teamList = document.getElementById('teamList');
    teams = [];
    saveTeamsAsJson();
    teamList.innerHTML = '';
}

async function loadGamePage() {
    const response = await fetch('game.html');
    let baseHtml = await response.text();
    window.document.write(baseHtml);
    window.document.close();
}