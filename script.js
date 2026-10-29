let points = 0;
let pointsPerClick = 1;
let passivePoints = 0;
let gameStarted = false;
let eventsStarted = false;

let currentLevel = 1;
let experience = 0;
let requiredExperience = 100;

let xpRequirementGrowth = 0.50;
let xpMultiplier = 1;
let levelBonus = 1.05;

const startScreen = document.getElementById("inicio");
const gameScreen = document.getElementById("jogo");
const playButton = document.getElementById("jogar");
const pointsDisplay = document.getElementById("pontos");
const shopContainer = document.getElementById("estoquePlanetas");
const shopMessage = document.getElementById("mensagemLoja");
const planetsArea = document.getElementById("planetasTela");
const levelDisplay = document.getElementById("nivel");
const experienceDisplay = document.getElementById("experiencia");
const xpBar = document.getElementById("progresso-xp");
const customizationButton = document.getElementById("abrirCursores");
const customizationPanel = document.getElementById("painelCursores");
const cursorList = document.getElementById("listaCursores");
const particleList = document.getElementById("listaParticulas");
const closeCustomizationButton = document.getElementById("fecharCursores");
const cursorTab = document.getElementById("abaCursores");
const particleTab = document.getElementById("abaParticulas");


const planets = [
    {
        id: "earth",
        name: "Earth",
        image: "image/Terra.png",
        price: 100,
        bonus: "+5% to all gains",
        size: 95,
        type: "planet"
    },
    {
        id: "mars",
        name: "Mars",
        image: "image/Marte.png",
        price: 150,
        bonus: "10% chance of double points",
        size: 78,
        type: "planet"
    },
    {
        id: "jupiter",
        name: "Jupiter",
        image: "image/Jupiter.png",
        price: 200,
        bonus: "+1 passive point/s",
        size: 145,
        type: "planet"
    },
    {
        id: "saturn",
        name: "Saturn",
        image: "image/Saturno.png",
        price: 300,
        bonus: "+8% to all gains",
        size: 125,
        type: "planet"
    },
    {
        id: "neptune",
        name: "Neptune",
        image: "image/Netuno.png",
        price: 250,
        bonus: "+15% points per click",
        size: 90,
        type: "planet"
    }
];

const cursors = [
    {
        id: "duck",
        name: "Duck",
        file: "duck.cur",
        price: 50,
        icon: "🦆",
        type: "cursor"
    },
    {
        id: "ghost",
        name: "Ghost",
        file: "fantasma.cur",
        price: 75,
        icon: "👻",
        type: "cursor"
    },
    {
        id: "rocket",
        name: "Rocket",
        file: "foguete.cur",
        price: 100,
        icon: "🚀",
        type: "cursor"
    },
    {
        id: "star",
        name: "Star",
        file: "stat.cur",
        price: 125,
        icon: "⭐",
        type: "cursor"
    },
    {
        id: "watermelon",
        name: "Watermelon",
        file: "watermelon.cur",
        price: 150,
        icon: "🍉",
        type: "cursor"
    }
];

const particlePacks = [
    {
        id: "orbs",
        name: "Magic Orbs",
        symbols: ["◒", "◍", "•", "◉"],
        price: 60,
        icon: "🔮",
        type: "particle",
        bonus: "Magic orb click effect"
    },
    {
        id: "numbers",
        name: "Numbers",
        symbols: ["1", "2", "3", "4"],
        price: 80,
        icon: "🔢",
        type: "particle",
        bonus: "Number click effect"
    },
    {
        id: "party",
        name: "Party",
        symbols: ["⭐", "❤️", "🎈", "🎉"],
        price: 120,
        icon: "🎉",
        type: "particle",
        bonus: "Party click effect"
    },
    {
        id: "tropical",
        name: "Tropical",
        symbols: ["🌴", "⚽", "🍹", "🦜"],
        price: 150,
        icon: "🌴",
        type: "particle",
        bonus: "Tropical click effect"
    },
    {
        id: "halloween",
        name: "Halloween",
        symbols: ["🎃", "👻", "🦇", "🧛"],
        price: 200,
        icon: "🎃",
        type: "particle",
        bonus: "Halloween click effect"
    }
];

const upgrades = [
    {
        id: "stellar-boost",
        name: "Stellar Boost",
        icon: "⚡",
        price: 120,
        bonus: "+25% points per click",
        type: "upgrade",
        effect: () => {
            pointsPerClick = Math.floor(pointsPerClick * 1.25);
        }
    },
    {
        id: "galactic-collector",
        name: "Galactic Collector",
        icon: "🌌",
        price: 180,
        bonus: "+5 passive points/s",
        type: "upgrade",
        effect: () => {
            passivePoints += 5;
        }
    },
    {
        id: "supernova-crystal",
        name: "Supernova Crystal",
        icon: "💎",
        price: 250,
        bonus: "+50% XP gain",
        type: "upgrade",
        effect: () => {
            xpMultiplier *= 1.5;
        }
    }
];

const purchasedPlanets = [];
const purchasedCursors = [];
const purchasedParticles = [];
const purchasedUpgrades = [];

let activeCursor = null;
let activeParticle = "default";

let shopStock = [];

function hasPurchased(item) {
    if (item.type === "planet") {
        return purchasedPlanets.some(p => p.id === item.id);
    }

    if (item.type === "cursor") {
        return purchasedCursors.some(c => c.id === item.id);
    }

    if (item.type === "particle") {
        return purchasedParticles.some(p => p.id === item.id);
    }

    if (item.type === "upgrade") {
        return purchasedUpgrades.some(u => u.id === item.id);
    }

    return false;
}

function getAvailableItems() {
    return [
        ...planets.filter(p => !hasPurchased(p)),
        ...particlePacks.filter(p => !hasPurchased(p)),
        ...(currentLevel >= 3
            ? upgrades.filter(u => !hasPurchased(u))
            : []),
        ...(currentLevel >= 5
            ? cursors.filter(c => !hasPurchased(c))
            : [])
    ];
}

function showShopMessage(message) {
    shopMessage.textContent = message;
}

function randomItem(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

function refillShop() {
    const availableItems = getAvailableItems();

    shopStock = shopStock.filter(item =>
        availableItems.some(available => available.id === item.id)
    );

    while (shopStock.length < 3) {
        const remaining = availableItems.filter(item => !shopStock.some(stockItem => stockItem.id === item.id));

        if (remaining.length === 0) {
            break;
        }

        shopStock.push(randomItem(remaining));
    }

    renderShop();
}

function renderShop() {
    shopContainer.innerHTML = "";

    shopStock.forEach(item => {
        const card = document.createElement("button");

        card.className = "card-planeta";
        card.type = "button";
        card.title = `${item.name} — ${item.price} stars`;

        if (item.image) {
            const image = document.createElement("img");

            image.src = item.image;
            image.alt = item.name;
            image.draggable = false;

            card.appendChild(image);
        } else {
            const icon = document.createElement("span");

            icon.textContent = item.icon;
            icon.style.fontSize = "38px";

            card.appendChild(icon);
        }

        const name = document.createElement("span");
        name.className = "nome-planeta";
        name.textContent = item.name;

        const bonus = document.createElement("span");
        bonus.className = "bonus-planeta";
        bonus.textContent = item.bonus;

        const price = document.createElement("span");
        price.className = "preco-planeta";
        price.textContent = `${item.price} ✧`;

        card.append(name, bonus, price);

        card.addEventListener("click", () => {
            buyItem(item);
        });

        shopContainer.appendChild(card);
    });

    if (shopStock.length === 0) {
        const message = document.createElement("p");

        message.textContent = "Everything unlocked! ✦";
        message.style.gridColumn = "1 / -1";
        message.style.textAlign = "center";

        shopContainer.appendChild(message);
    }
}

function buyItem(item) {
    if (points < item.price) {
        showShopMessage("Not enough stars! ✧");
        return;
    }

    const index = shopStock.findIndex(
        stockItem => stockItem.id === item.id
    );

    if (index === -1) {
        return;
    }

    points -= item.price;
    shopStock.splice(index, 1);

    if (item.type === "planet") {
        purchasedPlanets.push(item);
        addPlanetToScreen(item);
    } else if (item.type === "cursor") {
        purchasedCursors.push(item);
        renderCursorInventory();
    } else if (item.type === "particle") {
        purchasedParticles.push(item);
        renderParticleInventory();
    } else if (item.type === "upgrade") {
        purchasedUpgrades.push(item);
        item.effect();
    }

    showShopMessage(`${item.name} unlocked! ✦`);

    refillShop();
    updatePoints();
    updateXPBar();
}

playButton.addEventListener("click", () => {
    if (gameStarted) {
        return;
    }

    gameStarted = true;

    startScreen.style.display = "none";
    gameScreen.style.display = "block";

    startEventManager();
});


function getGeneralBonus() {
    let bonus = 0;

    if (purchasedPlanets.some(p => p.id === "earth")) {
        bonus += 0.05;
    }

    if (purchasedPlanets.some(p => p.id === "saturn")) {
        bonus += 0.08;
    }

    return bonus;
}

function getClickBonus() {
    return purchasedPlanets.some(p => p.id === "neptune")
        ? 0.15
        : 0;
}

function calculateClickGain() {
    let gain =
        pointsPerClick *
        (1 + getGeneralBonus() + getClickBonus()) *
        levelBonus;

    if (
        purchasedPlanets.some(p => p.id === "mars") &&
        Math.random() < 0.10
    ) {
        gain *= 2;
        showShopMessage("Lucky star! Double points! ✦");
    }

    return gain;
}

function updatePoints() {
    pointsDisplay.textContent = `Points: ${Math.floor(points)}`;
}

document.addEventListener("click", event => {
    if (!gameStarted) {
        return;
    }

    if (
        event.target.closest(
            "#inicio, #topo, #loja, #painelCursores, " +
            "#abrirCursores, .planeta-movel, " +
            ".estrela-cadante, .portal-misterioso"
        )
    ) {
        return;
    }

    const gain = calculateClickGain();

    points += gain;

    gainExperience(gain);

    updatePoints();
    explodeParticles(event.clientX, event.clientY);
});


function updateXPBar() {
    levelDisplay.textContent = `LEVEL ${currentLevel}`;

    experienceDisplay.textContent =
        `${Math.floor(experience)} / ${requiredExperience} XP`;

    const progress = Math.min(
        100,
        (experience / requiredExperience) * 100
    );

    xpBar.style.width = `${progress}%`;
}

function gainExperience(amount) {
    experience += amount * xpMultiplier;

    while (experience >= requiredExperience) {
        experience -= requiredExperience;
        levelUp();
    }

    updateXPBar();
}

function levelUp() {
    currentLevel++;

    requiredExperience = Math.ceil(
        requiredExperience + 100 * xpRequirementGrowth
    );

    levelBonus *= 1.05;

    if (currentLevel % 5 === 0) {
        pointsPerClick += 2;

        showShopMessage(
            `Level ${currentLevel}! +2 points per click! ✦`
        );
    }

    if (currentLevel % 10 === 0) {
        passivePoints += 2;

        showShopMessage(
            `Level ${currentLevel}! +2 passive points/s! ✦`
        );
    }

    refillShop();
    updatePoints();
    updateXPBar();
}

function explodeParticles(x, y) {
    const colors = [
        "#fff0b8",
        "#f7d5ff",
        "#d9ceff",
        "#ffffff",
        "#ffcce5",
        "#c6a4e8"
    ];

    let symbols = ["✦", "✧", "⋆", "★"];

    if (activeParticle !== "default") {
        const pack = particlePacks.find(
            p => p.id === activeParticle
        );

        if (pack) {
            symbols = pack.symbols;
        }
    }

    for (let i = 0; i < 9; i++) {
        const particle = document.createElement("span");

        particle.textContent = randomItem(symbols);

        particle.style.position = "fixed";
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        particle.style.color = randomItem(colors);
        particle.style.fontSize = `${10 + Math.random() * 14}px`;

        particle.style.pointerEvents = "none";
        particle.style.zIndex = "9999";

        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const distance = 25 + Math.random() * 50;

        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        const animation = particle.animate(
            [
                {
                    transform: "translate(-50%, -50%) scale(0)",
                    opacity: 0
                },
                {
                    transform:
                        `translate(${dx * 0.5}px, ${dy * 0.5 - 8}px) scale(1.2)`,
                    opacity: 1,
                    offset: 0.3
                },
                {
                    transform:
                        `translate(${dx}px, ${dy - 15}px) scale(0.2)`,
                    opacity: 0
                }
            ],
            {
                duration: 600 + Math.random() * 300,
                easing: "ease-out"
            }
        );

        animation.onfinish = () => particle.remove();
    }
}

function startEventManager() {
    if (eventsStarted) {
        return;
    }

    eventsStarted = true;

    setInterval(() => {
        if (gameStarted) {
            spawnFallingStar();
        }
    }, 12000);

    setInterval(() => {
        if (gameStarted) {
            spawnMysteryPortal();
        }
    }, 25000);
}

function spawnFallingStar() {
    const star = document.createElement("div");

    star.className = "estrela-cadante";
    star.textContent = "⭐";
    star.setAttribute("aria-label", "Collect the falling star");

    const x = Math.random() * Math.max(1, window.innerWidth - 60) + 30;
    const y = Math.random() * Math.max(1, window.innerHeight - 200) + 100;

    star.style.left = `${x}px`;
    star.style.top = `${y}px`;

    star.addEventListener("click", event => {
        event.stopPropagation();

        const bonus = Math.max(
            80,
            Math.floor(pointsPerClick * 8)
        );

        points += bonus;

        gainExperience(bonus / 4);

        showShopMessage(`Star collected! +${bonus} points! ✦`);

        updatePoints();
        explodeParticles(event.clientX, event.clientY);

        star.remove();
    });

    document.body.appendChild(star);

    setTimeout(() => {
        if (star.isConnected) {
            star.remove();
        }
    }, 4500);
}

function spawnMysteryPortal() {
    const portal = document.createElement("div");

    portal.className = "portal-misterioso";
    portal.textContent = "🌀";
    portal.setAttribute("aria-label", "Enter the mystery portal");

    const x = Math.random() * Math.max(1, window.innerWidth - 80) + 40;
    const y = Math.random() * Math.max(1, window.innerHeight - 250) + 100;

    portal.style.left = `${x}px`;
    portal.style.top = `${y}px`;

    portal.addEventListener("click", event => {
        event.stopPropagation();

        if (Math.random() < 0.5) {
            const bonus = Math.floor(points * 0.3) + 150;

            points += bonus;

            gainExperience(bonus / 4);

            showShopMessage(
                `🌀 The portal granted +${bonus} points! ✦`
            );
        } else {
            gainExperience(150);

            showShopMessage(
                "🌀 The portal granted +150 bonus XP! ✦"
            );
        }

        updatePoints();
        explodeParticles(event.clientX, event.clientY);

        portal.remove();
    });

    document.body.appendChild(portal);

    setTimeout(() => {
        if (portal.isConnected) {
            portal.remove();
        }
    }, 6000);
}

cursorTab.addEventListener("click", () => {
    cursorTab.classList.add("ativa");
    particleTab.classList.remove("ativa");

    cursorList.hidden = false;
    particleList.hidden = true;
});

particleTab.addEventListener("click", () => {
    particleTab.classList.add("ativa");
    cursorTab.classList.remove("ativa");

    particleList.hidden = false;
    cursorList.hidden = true;
});


function renderCursorInventory() {
    cursorList.innerHTML = "";

    const defaultButton = document.createElement("button");

    defaultButton.className = "cursor-inventario";
    defaultButton.type = "button";

    const defaultIcon = document.createElement("span");

    defaultIcon.className = "cursor-icone";
    defaultIcon.textContent = "✧";

    const defaultText = document.createElement("span");
    defaultText.textContent = "Default Cursor";

    const defaultDetail = document.createElement("small");
    defaultDetail.textContent = "Original star pointer";

    defaultText.appendChild(defaultDetail);

    defaultButton.append(defaultIcon, defaultText);

    if (activeCursor === null) {
        defaultButton.classList.add("selecionado");
    }

    defaultButton.addEventListener("click", () => {
        activeCursor = null;

        applyCursor(null);
        renderCursorInventory();
    });

    cursorList.appendChild(defaultButton);

    purchasedCursors.forEach(cursor => {
        const item = document.createElement("button");

        item.className = "cursor-inventario";
        item.type = "button";

        const icon = document.createElement("span");

        icon.className = "cursor-icone";
        icon.textContent = cursor.icon;

        const text = document.createElement("span");
        text.textContent = cursor.name;

        const detail = document.createElement("small");

        detail.textContent =
            activeCursor === cursor.id
                ? "Equipped ✓"
                : "Click to equip";

        text.appendChild(detail);
        item.append(icon, text);

        if (activeCursor === cursor.id) {
            item.classList.add("selecionado");
        }

        item.addEventListener("click", () => {
            activeCursor = cursor.id;

            applyCursor(cursor);
            renderCursorInventory();
        });

        cursorList.appendChild(item);
    });
}

function renderParticleInventory() {
    particleList.innerHTML = "";

    const defaultButton = document.createElement("button");

    defaultButton.className = "cursor-inventario";
    defaultButton.type = "button";

    const defaultIcon = document.createElement("span");

    defaultIcon.className = "cursor-icone";
    defaultIcon.textContent = "✦";

    const defaultText = document.createElement("span");
    defaultText.textContent = "Default Stars";

    const defaultDetail = document.createElement("small");
    defaultDetail.textContent = "Original click effect";

    defaultText.appendChild(defaultDetail);

    defaultButton.append(defaultIcon, defaultText);

    if (activeParticle === "default") {
        defaultButton.classList.add("selecionado");
    }

    defaultButton.addEventListener("click", () => {
        activeParticle = "default";
        renderParticleInventory();
    });

    particleList.appendChild(defaultButton);

    purchasedParticles.forEach(pack => {
        const item = document.createElement("button");

        item.className = "cursor-inventario";
        item.type = "button";

        const icon = document.createElement("span");

        icon.className = "cursor-icone";
        icon.textContent = pack.icon;

        const text = document.createElement("span");
        text.textContent = pack.name;

        const detail = document.createElement("small");

        detail.textContent =
            activeParticle === pack.id
                ? "Equipped ✓"
                : "Click to equip";

        text.appendChild(detail);
        item.append(icon, text);

        if (activeParticle === pack.id) {
            item.classList.add("selecionado");
        }

        item.addEventListener("click", () => {
            activeParticle = pack.id;
            renderParticleInventory();
        });

        particleList.appendChild(item);
    });
}

function applyCursor(cursor) {
    const elements = [
        document.documentElement,
        document.body
    ];

    const cursorValue = cursor
        ? `url("curs/${cursor.file}"), auto`
        : `url("curs/star.cur"), auto`;

    elements.forEach(element => {
        element.style.setProperty(
            "cursor",
            cursorValue,
            "important"
        );
    });
}

customizationButton.addEventListener("click", () => {
    renderCursorInventory();
    renderParticleInventory();

    customizationPanel.hidden = false;
});

closeCustomizationButton.addEventListener("click", () => {
    customizationPanel.hidden = true;
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        customizationPanel.hidden = true;
    }
});


function addPlanetToScreen(planet) {
    const id = `planet-${planet.id}`;

    if (document.getElementById(id)) {
        return;
    }

    const size = planet.size;

    const element = document.createElement("div");

    element.className = "planeta-movel";
    element.id = id;

    element.style.setProperty("--tamanho", `${size}px`);
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;

    const halfSize = size / 2;

    const x = Math.max(
        halfSize,
        Math.min(
            window.innerWidth - halfSize,
            window.innerWidth * 0.25 +
                Math.random() * window.innerWidth * 0.5
        )
    );

    const y = Math.max(
        halfSize,
        Math.min(
            window.innerHeight - halfSize,
            window.innerHeight * 0.2 +
                Math.random() * window.innerHeight * 0.35
        )
    );

    element.style.left = `${x}px`;
    element.style.top = `${y}px`;

    const image = document.createElement("img");

    image.src = planet.image;
    image.alt = planet.name;
    image.draggable = false;

    element.appendChild(image);
    planetsArea.appendChild(element);

    makeDraggable(element, size);
}

function makeDraggable(element, size) {
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const halfSize = size / 2;

    element.addEventListener("pointerdown", event => {
        if (event.button !== 0 && event.pointerType === "mouse") {
            return;
        }

        dragging = true;

        offsetX = event.clientX - parseFloat(element.style.left);
        offsetY = event.clientY - parseFloat(element.style.top);

        element.style.zIndex = "6";

        element.setPointerCapture(event.pointerId);

        event.preventDefault();
    });

    element.addEventListener("pointermove", event => {
        if (!dragging) {
            return;
        }

        let x = event.clientX - offsetX;
        let y = event.clientY - offsetY;

        x = Math.max(
            halfSize,
            Math.min(window.innerWidth - halfSize, x)
        );

        y = Math.max(
            halfSize,
            Math.min(window.innerHeight - halfSize, y)
        );

        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    });

    function stopDragging() {
        dragging = false;
        element.style.zIndex = "5";
    }

    element.addEventListener("pointerup", stopDragging);
    element.addEventListener("pointercancel", stopDragging);
    element.addEventListener("lostpointercapture", stopDragging);
}

setInterval(() => {
    if (!gameStarted) {
        return;
    }

    let passiveGain = passivePoints * levelBonus;

    if (purchasedPlanets.some(p => p.id === "jupiter")) {
        passiveGain += 1;
    }

    passiveGain *= 1 + getGeneralBonus();

    if (passiveGain > 0) {
        points += passiveGain;

        gainExperience(passiveGain / 10);

        updatePoints();
    }
}, 1000);

function initializeGame() {
    refillShop();

    updatePoints();
    updateXPBar();

    renderCursorInventory();
    renderParticleInventory();

    applyCursor(null);
}

initializeGame();
