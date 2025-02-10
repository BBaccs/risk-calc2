let simpleMode = false;

function toggleCalculatorMode() {
    simpleMode = !simpleMode;
    const buttonText = simpleMode ? 'Toggle Complex Mode' : 'Toggle Simple Mode';
    document.getElementById('toggleModeButton').textContent = buttonText;
    updateAttackFields();
}

function updateAttackFields() {
    const numberOfAttacks = document.getElementById('numberOfAttacks').value;
    let fieldsHTML = '';
    for (let i = 1; i <= numberOfAttacks; i++) {
        if (simpleMode) {
            fieldsHTML += `
                <div class="mb-3 attacker-row">
                    <label for="attackingUnits${i}" class="form-label">Total Attacking Units for Attack ${i}:</label>
                    <input type="number" class="form-control" id="attackingUnits${i}" min="1" value="0" step="1">
                    <button type="button" class="btn btn-secondary" onclick="resetAttack(${i})">Reset Attack ${i}</button>
                </div>
                <div class="mb-3 defender-row">
                    <label for="totalDefenders${i}" class="form-label">Total Defending Units for Attack ${i}:</label>
                    <input type="number" class="form-control" id="totalDefenders${i}" min="1" value="0" step="1">
                </div>
                <div class="mb-3 defender-row">
                    <label for="numberOfTerritories${i}" class="form-label">Number of Territories for Attack ${i}:</label>
                    <input type="number" class="form-control" id="numberOfTerritories${i}" min="1" value="1" step="1">
                </div>
            `;
        } else {
            // Complex mode fields
            fieldsHTML += `
                <div class="mb-3 attacker-row">
                    <label for="attackingUnits${i}" class="form-label">Total Attacking Units for Attack ${i}:</label>
                    <input type="number" class="form-control" id="attackingUnits${i}" min="1" value="0" step="1">
                    <button type="button" class="btn btn-secondary" onclick="resetAttack(${i})">Reset Attack ${i}</button>
                </div>
                <div class="mb-3 defender-row">
                    <label for="territories${i}" class="form-label">Defending Units in Each Territory for Attack ${i} (comma-separated: 6,1,3):</label>
                    <input type="text" class="form-control" id="territories${i}" value="0">
                </div>
            `;
        }
    }
    document.getElementById('attackFields').innerHTML = fieldsHTML;
}

function resetAttack(attackIndex) {
    if (simpleMode) {
        document.getElementById(`attackingUnits${attackIndex}`).value = '0';
        document.getElementById(`totalDefenders${attackIndex}`).value = '0';
        document.getElementById(`numberOfTerritories${attackIndex}`).value = '1';
    } else {
        document.getElementById(`attackingUnits${attackIndex}`).value = '0';
        document.getElementById(`territories${attackIndex}`).value = '';
    }
}

// Ensure `resetAttack` function is accessible from the global scope
window.resetAttack = resetAttack;

// Initial call to populate fields
updateAttackFields();