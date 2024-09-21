const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
};

const pathImages = "./src/assets/icons/";
const cardData = [
    { id: 0, name: "Blue Eyes White Dragon", type: "Paper", img: `${pathImages}dragon.png`, WinOf: [1], LoseOf: [2] },
    { id: 1, name: "Dark Magician", type: "Rock", img: `${pathImages}magician.png`, WinOf: [2], LoseOf: [0] },
    { id: 2, name: "Exodia", type: "Scissors", img: `${pathImages}exodia.png`, WinOf: [0], LoseOf: [1] },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const card = cardData.find(c => c.id === parseInt(IdCard));
    const cardImage = document.createElement("img");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(IdCard);
        });
        cardImage.addEventListener("click", () => {
            setCardsField(IdCard);
        });
    }

    return cardImage;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function setCardsField(cardId) {
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();
   
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    hiddenCardDetails(); // Chamar a função para ocultar detalhes do card

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);
    await updateScore();
    await drawButton(duelResults);
}

function hiddenCardDetails() {
    state.cardSprites.avatar.style.display = "none"; // Ocultar o avatar
    state.cardSprites.avatar.src = ""; // Limpar a src
    state.cardSprites.name.innerText = ""; // Limpar o nome
    state.cardSprites.type.innerText = ""; // Limpar o tipo
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Player: ${state.score.playerScore} - Computer: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "DRAW";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "WIN";
        state.score.playerScore++;
    } else if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "LOSE";
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
}

async function removeAllCardsImages() {
    let { computerBOX, player1BOX } = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectedCard(cardId) {
    const card = cardData.find(c => c.id === parseInt(cardId));
    if (card) {
        state.cardSprites.avatar.src = card.img;
        state.cardSprites.avatar.style.display = "block"; // Mostrar o avatar
        state.cardSprites.name.textContent = card.name;
        state.cardSprites.type.textContent = `Attribute: ${card.type}`;
    }
}

async function resetDuel() {
    hiddenCardDetails(); // Chamar a função para ocultar detalhes do card
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    try {
        audio.play();
    } catch {}
}

function init() {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm")
    bgm.play()
}

init();
