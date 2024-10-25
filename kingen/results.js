// Function to adjust font size if text overflows its container
function adjustFontSizeToFit(element) {
    let fontSize = parseFloat(window.getComputedStyle(element).fontSize);
    while (element.scrollWidth > element.clientWidth && fontSize > 10) {  // 10px minimum font size
        fontSize -= 1;
        element.style.fontSize = fontSize + "px";
    }
}

window.onload = function() {
    console.log('Showing results.');
    const podiumSpots = ['second', 'first', 'third'];
    const podiumDivs = podiumSpots.map(id => document.getElementById(id));
    const teamListDiv = document.getElementById('team-list');
    const leaderboardData = leaderboard();
    // Display the top three teams in podium spots
    leaderboardData.slice(0, 3).forEach((team, index) => {
        let podiumSpot;
        switch (index) {
            case 0:
                podiumSpot = podiumDivs[1];
                break;
            case 1:
                podiumSpot = podiumDivs[0];
                break;
            default:
                podiumSpot = podiumDivs[index]
                break;
        }
        
        podiumSpot.innerHTML = `${podiumSpot.innerHTML}<p>${team.teamName}</p><p>${team.points}</p>`;

        // Adjust font size for each podium spot if overflow is detected
        Array.from(podiumSpot.getElementsByTagName("p")).forEach(adjustFontSizeToFit);
    });

    // Display the rest of the teams in the team list
    leaderboardData.slice(3).forEach(team => {
        const teamP = document.createElement('p');
        teamP.textContent = `${team.teamName} - ${team.points}`;
        teamListDiv.appendChild(teamP);

        // Adjust font size for team list items if overflow is detected
        adjustFontSizeToFit(teamP);
    });

    resetTeamScores();

    // Add event listener for the refresh button
    var refreshButton = document.getElementById('refresh-button');
    refreshButton.addEventListener('click', function() {
        location.reload(); // Reloads the current page
    });
};