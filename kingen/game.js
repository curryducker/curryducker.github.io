const fieldFlipped = localStorage.getItem('fieldFlipped') !== null && localStorage.getItem('fieldFlipped') == 'true';
const leaderboard = function() {
    return teams.slice().sort((a, b) => b.points - a.points);
};
var undoArray = []
var fieldSelect = 0;

window.onload = function() {
    console.log('Game Started!');
    console.log('Loaded saved Queue:');
    console.log(teams);
    if (fieldFlipped) {
        console.log('Fields are flipped!');
        flipFields();
    }
    const json = JSON.parse(localStorage.getItem('undoArray'))
    if (json !== null && json.length !== 0) {
        undoArray = json;
        console.log('Loaded saved Undo Array: ');
        console.log(undoArray);
    } else {
        console.log('No Progress Found for Undo!');
    }
    nextUp();
};

function toggleMenu() {
    var menu = document.getElementById('mobileMenu');
    if (menu.style.display === 'flex') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'flex';
    }
}

function toggleLeaderboard() {
    var leaderboard = document.getElementById('leaderboard');
    var queue = document.getElementById('queue');
    if (leaderboard.style.display === 'block') {
        leaderboard.style.display = 'none';
    } else {
        leaderboard.style.display = 'block';
        queue.style.display = 'none';
    }
    document.getElementById('mobileMenu').style.display = 'none';
}

function toggleQueue() {
    var queue = document.getElementById('queue');
    var leaderboard = document.getElementById('leaderboard');
    if (queue.style.display === 'block') {
        queue.style.display = 'none';
    } else {
        queue.style.display = 'block';
        leaderboard.style.display = 'none';
    }
    document.getElementById('mobileMenu').style.display = 'none';
}

function select(event) {
    var target = event.target
    if (!(event.target.tagName.toLowerCase() === 'div')) {
        target = event.target.parentNode;
    }
    document.querySelectorAll('.field').forEach(div => {
        if (div.id != target.id) {
            div.classList.remove('selected');
        }
    });
    
    if (target.classList.contains('selected')) {
        fieldSelect = 0;
    } else {
        fieldSelect = parseInt(target.id.toString().substring(5), 10);
    }
    target.classList.toggle('selected');
}

document.querySelectorAll('.field').forEach(div => {
    div.addEventListener('click', select);
});

function deselectAll() {
    document.querySelectorAll('.field').forEach(div => {
        div.classList.remove('selected');
    });
}

function finishGame() {
    localStorage.setItem('gameStarted', false);
    undoArray = [];
    localStorage.setItem('undoArray', null);
    alert('Game finished!');
    // Add your game finishing logic here
    loadResultsPage()
}

async function loadResultsPage() {
    const response = await fetch('results.html');
    let baseHtml = await response.text();
    window.document.write(baseHtml);
    window.document.close();
}

function undoAction() {
    let confirmation = null;
    if (undoArray.length > 0) {
        confirmation = window.confirm("Are you sure you want to undo the last action?")
    } else {
        alert('Nothing to undo!')
        return;
    }

    if (confirmation) {
        teams = undoArray.pop();
        saveTeamsAsJson();
        saveUndoAsJson();
        nextUp();
    }
}

function confirmAction() {
    if (fieldSelect != 0) {
        // Geen idee waarom dit zo omslachtig moet maar het werkt nu?
        const jsonString = JSON.stringify(teams);
        undoArray.push(JSON.parse(jsonString));
        saveUndoAsJson();
    }
    // Geselecteerde field eruit
    switch (fieldSelect) {
        case 0:
            // eventuele code voor als er geen field geselecteerd is, button shake ofzo
            alert('No Action Selected!');
            break;
        case 6:
            console.log('Kingvak is af');
            out(1, true);
            fieldSelect = 0;
            deselectAll();
            break;
        default:
            console.log(`Vak ${fieldSelect} is af`);
            out(7 - fieldSelect, false);
            fieldSelect = 0;
            deselectAll();
            break;
    }
}

function out(field, kingVak) {
    points(field);
    if (!kingVak) {
        kingPoints();
    }
    update(field-1);
}

function points(fieldIndex) {
    while (fieldIndex < 6) {
        teams[fieldIndex].points++;
        fieldIndex++;
    }
}

function kingPoints() {
    teams[0].points += 2;
}

function update(fieldIndex) {
    listUpdate(fieldIndex);
    nextUp();
}

function listUpdate(fieldIndex) {
    teams.push(teams[fieldIndex]);
    teams.splice(fieldIndex, 1);
    saveTeamsAsJson();
}

function saveUndoAsJson() {
    const jsonString = JSON.stringify(undoArray);
    console.log('Saved Undo Json to local storage:');
    console.log(undoArray);
    localStorage.setItem('undoArray', jsonString);
}

function nextUp() {
    let i = 0;
    while (i < 6) {
        let field = document.getElementById(`field${i + 1}`);
        if (field) {
            field.querySelector('h3').textContent = `Field ${i + 1}`;
            field.querySelector('p').textContent = teams[5 - i].teamName + ': ' + teams[5 - i].points + ' punten';
        }
        i++;
    }
    
    var queueDiv = document.getElementById('queue');
    queueDiv.querySelector('p').innerHTML = buildScoreString(teams, 6);
    var leaderboardDiv = document.getElementById('leaderboard');
    leaderboardDiv.querySelector('p').innerHTML = buildScoreString(leaderboard(), 0);
}

function buildScoreString(array, startindex) {
    return array.slice(startindex).map((team, index) => `${index + 1}. ${team.teamName}: ${team.points} punten`).join('<br>');
}

function toggleFieldFlipped() {
    localStorage.setItem('fieldFlipped', !fieldFlipped);
    flipFields();
}

function flipFields() {
    deselectAll();
    var field1 = document.getElementById('field2');
    var field2 = document.getElementById('field1');
    var field3 = document.getElementById('field6');
    var field4 = document.getElementById('field5');
    var field5 = document.getElementById('field4');
    var field6 = document.getElementById('field3');

    field1.id = 'field1';
    field2.id = 'field2';
    field3.id = 'field3';
    field4.id = 'field4';
    field5.id = 'field5';
    field6.id = 'field6';
    
    nextUp();
}
