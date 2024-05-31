window.onload = function() {
    console.log('Showing results.');
    var resultsDiv = document.getElementById('results');
    var resultsP = document.createElement('p');
    resultsP.innerHTML = buildScoreString(leaderboard(), 0);
    resultsDiv.appendChild(resultsP);
    resetTeamScores();
};