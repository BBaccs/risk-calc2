function calculateRiskChainWinPercentage(totalAttackers, territories) {
    let remainingAttackers = totalAttackers;
    
    // Simulate attack on each territory
    for (let i = 0; i < territories.length; i++) {
        let defenders = territories[i];
        let attackers = remainingAttackers;

        // Simulate battle until one side is out of units or territory is taken
        while (attackers > 0 && defenders > 0) {
            let result = simulateBattleRound(attackers, defenders);
            attackers -= result.attackerLosses;
            defenders -= result.defenderLosses;

            // If territory is taken, check if there are attackers left
            if (defenders <= 0) {
                remainingAttackers = attackers - 1; // Leave one unit behind
                break;
            }

            // If attackers run out, simulation ends here
            if (attackers <= 0) {
                return { success: false, remaining: 0 };
            }
        }

        // If we've run out of attackers before capturing all territories
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

// function calculateChainWinPercentage() {
//     const totalAttackers = parseInt(document.getElementById('attackingUnits').value);
//     const territories = document.getElementById('territories').value.split(',').map(Number);
    
//     if (!territories.every(num => !isNaN(num))) {
//         document.getElementById('result').innerText = 'Please enter valid numbers for territories, separated by commas.';
//         return;
//     }

//     const simulations = 10000;
//     let successCount = 0;
//     let totalRemaining = 0;

//     for (let i = 0; i < simulations; i++) {
//         let result = calculateRiskChainWinPercentage(totalAttackers, territories);
//         if (result.success) {
//             successCount++;
//             totalRemaining += result.remaining;
//         }
//     }

//     const winPercentage = (successCount / simulations * 100).toFixed(2);
//     const avgRemaining = (totalRemaining / successCount || 0).toFixed(2); // Avoid division by zero

//     document.getElementById('result').innerHTML = `
//         <p class="alert alert-success">Win Percentage: ${winPercentage}%</p>
//         <p class="alert alert-info">Average Units Remaining if Successful: ${avgRemaining}</p>
//     `;
// }




// ... (previous functions remain unchanged)

function calculateChainWinPercentage() {
    const totalAttackers = parseInt(document.getElementById('attackingUnits').value);
    const territories = document.getElementById('territories').value.split(',').map(Number);
    
    if (!territories.every(num => !isNaN(num))) {
        document.getElementById('result').innerText = 'Please enter valid numbers for territories, separated by commas.';
        return;
    }

    const simulations = 10000;
    let successCount = 0;
    let totalRemaining = 0;
    let remainingUnits = Array(totalAttackers + 1).fill(0); // Array to track remaining units

    for (let i = 0; i < simulations; i++) {
        let result = calculateRiskChainWinPercentage(totalAttackers, territories);
        if (result.success) {
            successCount++;
            totalRemaining += result.remaining;
            remainingUnits[result.remaining]++; // Count how many times each number of units remained
        }
    }

    const winPercentage = (successCount / simulations * 100).toFixed(2);
    const avgRemaining = (totalRemaining / successCount || 0).toFixed(2); // Avoid division by zero

    // Find the most common number of remaining units
    let maxCount = 0;
    let mostCommonRemaining = 0;
    for (let i = 0; i < remainingUnits.length; i++) {
        if (remainingUnits[i] > maxCount) {
            maxCount = remainingUnits[i];
            mostCommonRemaining = i;
        }
    }

    // Prepare to display probabilities
    let probabilities = [];
    for (let i = 1; i < remainingUnits.length; i++) { // We don't care about 0 units remaining
        if (remainingUnits[i] > 0) {
            let percentage = ((remainingUnits[i] / successCount) * 100).toFixed(2);
            probabilities.push(`${i} units: ${percentage}%`);
        }
    }

    document.getElementById('result').innerHTML = `
        <p class="alert alert-success">Win Percentage: ${winPercentage}%</p>
        <p class="alert alert-info">Average Units Remaining if Successful: ${avgRemaining}</p>
        <p class="alert alert-info">Most Common Number of Units Remaining: ${mostCommonRemaining}</p>
        <div class="alert alert-info">
            <strong>Probability Distribution of Remaining Units:</strong><br>
            ${probabilities.join('<br>')}
        </div>
    `;
}