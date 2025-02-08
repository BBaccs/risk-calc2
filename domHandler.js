function updateAttackFields() {
    const numberOfAttacks = document.getElementById('numberOfAttacks').value;
    let fieldsHTML = '';
    for (let i = 1; i <= numberOfAttacks; i++) {
        fieldsHTML += `
            <div class="mb-3 attacker-row">
                <label for="attackingUnits${i}" class="form-label">Total Attacking Units for Attack ${i}:</label>
                <input type="number" class="form-control" id="attackingUnits${i}" min="0" value="100" step="1">
                <button type="button" class="btn btn-secondary" onclick="resetAttack(${i})">Reset Attack ${i}</button>
            </div>
            <div class="mb-3 defender-row">
                <label for="territories${i}" class="form-label">Defending Units in Each Territory for Attack ${i} (comma-separated):</label>
                <input type="text" class="form-control" id="territories${i}" value="60,20,3,1,1">
            </div>
        `;
    }
    document.getElementById('attackFields').innerHTML = fieldsHTML;
}

function resetAttack(attackIndex) {
    // Reset attacking units to 0
    document.getElementById(`attackingUnits${attackIndex}`).value = '0';
    // Reset defending territories to empty string, since 0 wouldn't make sense here
    document.getElementById(`territories${attackIndex}`).value = '';
}

// Initial call to populate fields
updateAttackFields();

// Ensure `resetAttack` function is accessible from the global scope
window.resetAttack = resetAttack;