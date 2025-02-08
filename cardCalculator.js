const CARD_SETS = 3; // Infantry, Cavalry, Artillery
const WILD_CARD = 'Wild';

function calculateSetProbability(totalCards, wildCards, opponentCards, playerCards) {
    // Distribute remaining cards after accounting for player's cards
    let remainingRegularCards = totalCards - wildCards - playerCards.reduce((sum, count) => sum + count, 0);
    let cardsPerSet = Math.floor(remainingRegularCards / CARD_SETS);
    let remainingCards = remainingRegularCards % CARD_SETS;

    let simulations = 10000;
    let setCount = 0;

    for (let i = 0; i < simulations; i++) {
        let deck = createDeck(cardsPerSet, remainingCards, wildCards, playerCards);
        let hand = deck.slice(0, opponentCards);
        if (hasSet(hand)) {
            setCount++;
        }
    }

    return (setCount / simulations * 100).toFixed(2);
}

function createDeck(cardsPerSet, remainingCards, wildCards, playerCards) {
    let deck = [];
    for (let i = 0; i < CARD_SETS; i++) {
        let thisSetCards = cardsPerSet + (remainingCards > 0 ? 1 : 0);
        deck = deck.concat(Array(Math.max(0, thisSetCards - (playerCards[i] || 0))).fill(i));
        remainingCards--;
    }
    deck = deck.concat(Array(wildCards - (playerCards[WILD_CARD] || 0)).fill(WILD_CARD));
    deck = shuffle(deck);
    return deck;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

function hasSet(hand) {
    let count = {};
    hand.forEach(card => count[card] = (count[card] || 0) + 1);

    // Check if we have 3 of a kind or 1 of each with wild cards
    if (Object.values(count).some(c => c >= 3)) return true; // 3 of a kind
    if (count[WILD_CARD] === undefined) count[WILD_CARD] = 0; // Ensure wild card count exists

    let regularCards = hand.filter(card => card !== WILD_CARD);
    let regularCount = {};
    regularCards.forEach(card => regularCount[card] = (regularCount[card] || 0) + 1);

    // Check for one of each with wild cards
    if (Object.keys(regularCount).length + count[WILD_CARD] >= 3) {
        let neededWilds = 0;
        for (let i = 0; i < CARD_SETS; i++) {
            if (regularCount[i] === undefined) neededWilds++;
            else if (regularCount[i] === 1) neededWilds += (i < CARD_SETS - 1) ? 0 : (neededWilds + 1 > count[WILD_CARD] ? 1 : 0);
        }
        if (neededWilds <= count[WILD_CARD]) return true;
    }

    return false;
}

function calculateCardProbability() {
    const totalCards = parseInt(document.getElementById('totalCards').value) || 0;
    const wildCards = parseInt(document.getElementById('wildCards').value) || 0;
    const opponentCards = parseInt(document.getElementById('opponentCards').value);
    
    const playerCards = [];
    for (let i = 0; i < CARD_SETS; i++) {
        playerCards[i] = parseInt(document.getElementById(`playerSet${i}`).value) || 0;
    }
    playerCards[WILD_CARD] = parseInt(document.getElementById('playerWild').value) || 0;

    if (totalCards < wildCards || totalCards < 0 || wildCards < 0 || ![3, 4, 5].includes(opponentCards) || 
        playerCards.reduce((sum, count) => sum + count, 0) > totalCards) {
        document.getElementById('cardResult').innerText = 'Please enter valid numbers. Check total cards and opponent/player card counts.';
        return;
    }

    const probability = calculateSetProbability(totalCards, wildCards, opponentCards, playerCards);
    document.getElementById('cardResult').innerHTML = `<p class="alert alert-info">Probability of Opponent Having a Set with ${opponentCards} Cards: ${probability}%</p>`;
}

function resetCardCalculator() {
    document.getElementById('totalCards').value = '0';
    document.getElementById('wildCards').value = '0';
    document.getElementById('opponentCards').value = '0';
    for (let i = 0; i < CARD_SETS; i++) {
        document.getElementById(`playerSet${i}`).value = '0';
    }
    document.getElementById('playerWild').value = '0';
    document.getElementById('cardResult').innerText = ''; // Clear the result display
}

// This function needs to be accessible from the global scope for the onclick event to work
window.resetCardCalculator = resetCardCalculator;