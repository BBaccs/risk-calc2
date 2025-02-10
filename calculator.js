function calculateRiskChainWinPercentage(totalAttackers, territories) {
    let remainingAttackers = totalAttackers;
    
    for (let i = 0; i < territories.length; i++) {
        let defenders = territories[i];
        let attackers = remainingAttackers;

        while (attackers > 0 && defenders > 0) {
            let result = simulateBattleRound(attackers, defenders);
            attackers -= result.attackerLosses;
            defenders -= result.defenderLosses;

            if (defenders <= 0) {
                remainingAttackers = attackers - 1; // Leave one unit behind
                break;
            }

            if (attackers <= 0) {
                return { success: false, remaining: 0 };
            }
        }

        if (attackers <= 0) {
            return { success: false, remaining: 0 };
        }
    }

    return { success: true, remaining: remainingAttackers };
}

function simulateBattleRound(attackers, defenders) {
    let attackerLosses = 0;
    let defenderLosses = 0;
    let attackRolls = [];
    let defendRolls = [];

    for (let i = 0; i < Math.min(attackers, 3); i++) {
        attackRolls.push(Math.floor(Math.random() * 6) + 1);
    }
    for (let i = 0; i < Math.min(defenders, 2); i++) {
        defendRolls.push(Math.floor(Math.random() * 6) + 1);
    }

    attackRolls.sort((a, b) => b - a);
    defendRolls.sort((a, b) => b - a);

    let compareCount = Math.min(attackRolls.length, defendRolls.length);
    for (let i = 0; i < compareCount; i++) {
        if (attackRolls[i] > defendRolls[i]) {
            defenderLosses++;
        } else {
            attackerLosses++;
        }
    }

    return { attackerLosses, defenderLosses };
}

function calculateSimultaneousAttacks() {
    const numberOfAttacks = parseInt(document.getElementById('numberOfAttacks').value);
    let attacks = [];
    let resultsHTML = '';

    // Collect data for each attack
    for (let i = 1; i <= numberOfAttacks; i++) {
        attacks.push({
            attackers: parseInt(document.getElementById(`attackingUnits${i}`).value),
            totalDefenders: parseInt(document.getElementById(`totalDefenders${i}`).value),
            numberOfTerritories: parseInt(document.getElementById(`numberOfTerritories${i}`).value)
        });
    }

    // Check if all inputs are valid
    if (!attacks.every(attack => 
        !isNaN(attack.attackers) && !isNaN(attack.totalDefenders) && !isNaN(attack.numberOfTerritories)
    )) {
        document.getElementById('result').innerText = 'Please enter valid numbers for all inputs.';
        return;
    }

    const simulations = 10000;
    let allSuccessCount = 0;
    let anySuccessCount = 0;
    let successOutcomes = new Array(numberOfAttacks).fill(0).map(() => ({ success: 0, remaining: [] }));

    for (let i = 0; i < simulations; i++) {
        let allSuccess = true;
        let anySuccess = false;

        for (let j = 0; j < numberOfAttacks; j++) {
            let defendersPerTerritory = Math.ceil(attacks[j].totalDefenders / attacks[j].numberOfTerritories);
            let territories = Array(attacks[j].numberOfTerritories).fill(defendersPerTerritory);
            let result = calculateRiskChainWinPercentage(attacks[j].attackers, territories);
            if (result.success) {
                successOutcomes[j].success++;
                successOutcomes[j].remaining[result.remaining] = (successOutcomes[j].remaining[result.remaining] || 0) + 1;
                anySuccess = true;
            } else {
                allSuccess = false;
            }
        }

        if (allSuccess) allSuccessCount++;
        if (anySuccess) anySuccessCount++;
    }

    // Display combined results
    resultsHTML += `<p class="alert alert-success">All Attacks Successful: ${(allSuccessCount / simulations * 100).toFixed(2)}%</p>`;
    // resultsHTML += `<p class="alert alert-success">Any Attack Successful: ${(anySuccessCount / simulations * 100).toFixed(2)}%</p>`;

    // Display individual success rates and add toggle buttons for remaining units
    // resultsHTML += '<p class="alert alert-success"><strong>Individual Attack Success Rates:</strong></p>';
    for (let i = 0; i < numberOfAttacks; i++) {
        let successRate = (successOutcomes[i].success / simulations * 100).toFixed(2);
        resultsHTML += `<p class="alert alert-info">Attack ${i+1} Success Rate: ${successRate}%</p>`;

        // Toggle button for stats
        resultsHTML += `<button class="btn btn-secondary mb-2 toggle-button" onclick="toggleStats(${i})">Toggle Stats for Attack ${i+1}</button>`;
        // Hidden stats div
        resultsHTML += `<div class="alert alert-info" id="stats${i}" style="display: none;">
            <p><strong>Attack ${i+1} Stats:</strong></p>
            <p>Average Units Remaining if Successful: ${successOutcomes[i].success > 0 ? 
                (successOutcomes[i].remaining.reduce((sum, count, index) => sum + index * count, 0) / successOutcomes[i].success).toFixed(2) : 'N/A'}</p>
            <p>Most Common Units Remaining: ${successOutcomes[i].remaining.reduce((max, count, index) => 
                count > (successOutcomes[i].remaining[max] || 0) ? index : max, 0)}</p>
        </div>`;
    }

    document.getElementById('result').innerHTML = resultsHTML;
}

// This function needs to be accessible from the global scope for the onclick event to work
window.toggleStats = function(index) {
    let statsElement = document.getElementById(`stats${index}`);
    statsElement.style.display = statsElement.style.display === 'none' ? 'block' : 'none';
};