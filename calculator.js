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
    const totalAttackers1 = parseInt(document.getElementById('attackingUnits1').value);
    const territories1 = document.getElementById('territories1').value.split(',').map(Number);
    const totalAttackers2 = parseInt(document.getElementById('attackingUnits2').value);
    const territories2 = document.getElementById('territories2').value.split(',').map(Number);

    if (!territories1.every(num => !isNaN(num)) || !territories2.every(num => !isNaN(num))) {
        document.getElementById('result').innerText = 'Please enter valid numbers for territories, separated by commas.';
        return;
    }

    const simulations = 10000;
    let bothSuccessCount = 0;
    let eitherSuccessCount = 0;
    let success1Only = 0;
    let success2Only = 0;
    let totalRemaining1 = 0;
    let totalRemaining2 = 0;

    for (let i = 0; i < simulations; i++) {
        let result1 = calculateRiskChainWinPercentage(totalAttackers1, territories1);
        let result2 = calculateRiskChainWinPercentage(totalAttackers2, territories2);

        if (result1.success && result2.success) {
            bothSuccessCount++;
            totalRemaining1 += result1.remaining;
            totalRemaining2 += result2.remaining;
        }
        if (result1.success || result2.success) {
            eitherSuccessCount++;
        }
        if (result1.success && !result2.success) success1Only++;
        if (!result1.success && result2.success) success2Only++;
    }

    const bothSuccessPercentage = (bothSuccessCount / simulations * 100).toFixed(2);
    const eitherSuccessPercentage = (eitherSuccessCount / simulations * 100).toFixed(2);
    const success1OnlyPercentage = (success1Only / simulations * 100).toFixed(2);
    const success2OnlyPercentage = (success2Only / simulations * 100).toFixed(2);
    const avgRemaining1 = (totalRemaining1 / bothSuccessCount || 0).toFixed(2);
    const avgRemaining2 = (totalRemaining2 / bothSuccessCount || 0).toFixed(2);

    document.getElementById('result').innerHTML = `
        <p class="alert alert-success">Both Attacks Successful: ${bothSuccessPercentage}%</p>
        <p class="alert alert-success">Either Attack Successful: ${eitherSuccessPercentage}%</p>
        <p class="alert alert-info">Only Attack 1 Successful: ${success1OnlyPercentage}%</p>
        <p class="alert alert-info">Only Attack 2 Successful: ${success2OnlyPercentage}%</p>
        <p class="alert alert-info">Average Units Remaining in Attack 1 if Both Successful: ${avgRemaining1}</p>
        <p class="alert alert-info">Average Units Remaining in Attack 2 if Both Successful: ${avgRemaining2}</p>
    `;
}