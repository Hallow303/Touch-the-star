let points = 0;
let pointsPerClick = 1;
let passivePoints = 0;
let gameStarted = false;
let gameEnded = false;
const MAX_POINTS = 10000000;
let currentLevel = 1;
let experience = 0;
let requiredExperience = 100;
let levelBonus = 1.05;
let totalClicks = 0;
let clicksForNeptune = 0;
const SHOP_SIZE = 3;

let planetas = [
    {
        id: "earth", 
        name: "Earth", 
        image: "image/Terra.png", 
        price: 50, 
        bonus: "+1 passive point/s", 
        size: 95
    },
    {
        id: "mercury",
        name: "Mercury",
        image: "image/Mercurio.png",
        price: 250,
        bonus: "+2 points per click",
        size: 65
    },
    {
        id: "mars", 
        name: "Mars", 
        image: "image/Marte.png", 
        price: 500, 
        bonus: "+3 points per click", 
        size: 78
    },
    {
        id: "venus",
        name: "Venus",
        image: "image/Vernus.png",
        price: 1000,
        bonus: "+25% click production",
        size: 88
    },
    {
        id: "jupiter",
        name: "Jupiter",
        image: "image/Jupiter.png",
        price: 2500,
        bonus: "Doubles passive production",
        size: 145
    },
    {
        id: "saturn",
        name: "Saturn",
        image: "image/Saturno.png",
        price: 5000,
        bonus: "+25% XP",
        size: 125
    },
    {
        id: "uranus",
        name: "Uranus",
        image: "image/Urano.png",
        price: 7500,
        bonus: "+50% passive production",
        size: 105
    },
    {
        id: "neptune",
        name: "Neptune",
        image: "image/Netuno.png",
        price: 10000,
        bonus: "+20 points every 10 clicks",
        size: 90
    },
    {
        id: "moon",
        name: "Moon",
        image: "image/Lua.png",
        price: 15000,
        bonus: "+50% XP",
        size: 75
    },
    {
        id: "sun", 
        name: "Sun", 
        image: "image/Sol.png", 
        price: 25000, 
        bonus: "+15% all production and XP", 
        size: 135
    }
];

let planetasComprados = [];
let estoqueLoja = [];

function planetaJaFoiComprado(id) {
    for (let i = 0; i < planetasComprados.length; i++) {
        if (planetasComprados[i].id === id) {
            return true;
        }
    }
    return false;
}

function listarPlanetasDisponiveis() {
    let planetasDisponiveis = [];
    for (let i = 0; i < planetas.length; i++) {
        if (!planetaJaFoiComprado(planetas[i].id)) {
            planetasDisponiveis.push(planetas[i]);
        }
    }
    planetasDisponiveis.sort(function(a, b) {
        return a.price - b.price;
    });
    return planetasDisponiveis;
}

function adicionarPontos(quantidade) {
    if (gameEnded || quantidade <= 0) {
        return;
    }
    points += quantidade;
    if (points >= MAX_POINTS) {
        points = MAX_POINTS;
        mostrarTelaVitoria();
        return;
    }
    mostrarPontosNaTela();
}

function mostrarPontosNaTela() {
    let textoDaPontuacao = document.getElementById("pontos");
    if (textoDaPontuacao) {
        textoDaPontuacao.textContent = "Points: " + Math.floor(points);
    }
    let areaDaLoja = document.getElementById("estoquePlanetas");
    if (!areaDaLoja) {
        return;
    }
    let botoesDosPlanetas = areaDaLoja.querySelectorAll(".card-planeta");
    for (let i = 0; i < botoesDosPlanetas.length; i++) {
        let idDoPlaneta = botoesDosPlanetas[i].dataset.planetId;
        for (let a = 0; a < estoqueLoja.length; a++) {
            if (estoqueLoja[a].id === idDoPlaneta) {
                botoesDosPlanetas[i].disabled = points < estoqueLoja[a].price;
                break;
            }
        }
    }
}

function reporEstoqueDaLoja() {
    let areaDaLoja = document.getElementById("estoquePlanetas");
    if (!areaDaLoja || gameEnded) {
        return;
    }
    let planetasDisponiveis = listarPlanetasDisponiveis();
    let estoqueAtualizado = [];
    for (let i = 0; i < estoqueLoja.length; i++) {
        if (!planetaJaFoiComprado(estoqueLoja[i].id)) {
            estoqueAtualizado.push(estoqueLoja[i]);
        }
    }
    estoqueLoja = estoqueAtualizado;
    while (estoqueLoja.length < SHOP_SIZE) {
        let encontrouPlaneta = false;
        for (let i = 0; i < planetasDisponiveis.length; i++) {
            let planetaJaEstaNaLoja = false;
            for (let a = 0; a < estoqueLoja.length; a++) {
                if (estoqueLoja[a].id === planetasDisponiveis[i].id) {
                    planetaJaEstaNaLoja = true;
                    break;
                }
            }
            if (planetaJaEstaNaLoja) {
                continue;
            }
            estoqueLoja.push(planetasDisponiveis[i]);
            encontrouPlaneta = true;
            break;
        }
        if (!encontrouPlaneta) {
            break;
        }
    }
    estoqueLoja.sort(function(a, b) {
        return a.price - b.price;
    });
    desenharLojaDePlanetas();
}

function desenharLojaDePlanetas() {
    let areaDaLoja = document.getElementById("estoquePlanetas");
    if (!areaDaLoja || gameEnded) {
        return;
    }
    areaDaLoja.innerHTML = "";
    for (let i = 0; i < estoqueLoja.length; i++) {
        let planetaDaVez = estoqueLoja[i];
        let cartaoPlaneta = document.createElement("button");
        cartaoPlaneta.className = "card-planeta";
        cartaoPlaneta.type = "button";
        cartaoPlaneta.dataset.planetId = planetaDaVez.id;
        cartaoPlaneta.title = planetaDaVez.name + " - " + planetaDaVez.price + " stars";
        cartaoPlaneta.disabled = points < planetaDaVez.price;
        let imagemDoPlaneta = document.createElement("img");
        imagemDoPlaneta.src = planetaDaVez.image;
        imagemDoPlaneta.alt = planetaDaVez.name;
        imagemDoPlaneta.draggable = false;
        let nomeDoPlaneta = document.createElement("span");
        nomeDoPlaneta.className = "nome-planeta";
        nomeDoPlaneta.textContent = planetaDaVez.name;
        let bonusDoPlaneta = document.createElement("span");
        bonusDoPlaneta.className = "bonus-planeta";
        bonusDoPlaneta.textContent = planetaDaVez.bonus;
        let precoDoPlaneta = document.createElement("span");
        precoDoPlaneta.className = "preco-planeta";
        precoDoPlaneta.textContent = planetaDaVez.price + " ✧";
        cartaoPlaneta.appendChild(imagemDoPlaneta);
        cartaoPlaneta.appendChild(nomeDoPlaneta);
        cartaoPlaneta.appendChild(bonusDoPlaneta);
        cartaoPlaneta.appendChild(precoDoPlaneta);
        cartaoPlaneta.addEventListener("click", function() {
            comprarPlaneta(planetaDaVez);
        });
        areaDaLoja.appendChild(cartaoPlaneta);
    }
    if (estoqueLoja.length === 0) {
        let avisoDaLoja = document.createElement("p");
        avisoDaLoja.textContent = "All planets purchased! ✦";
        avisoDaLoja.style.gridColumn = "1 / -1";
        avisoDaLoja.style.textAlign = "center";
        areaDaLoja.appendChild(avisoDaLoja);
    }
}

function comprarPlaneta(planeta) {
    if (!gameStarted || gameEnded) {
        return;
    }
    if (planetaJaFoiComprado(planeta.id) || points < planeta.price) {
        return;
    }
    let posicaoNaLoja = -1;
    for (let i = 0; i < estoqueLoja.length; i++) {
        if (estoqueLoja[i].id === planeta.id) {
            posicaoNaLoja = i;
            break;
        }
    }
    if (posicaoNaLoja === -1) {
        return;
    }
    points -= planeta.price;
    estoqueLoja.splice(posicaoNaLoja, 1);
    planetasComprados.push(planeta);
    criarPlanetaNoCenario(planeta);
    mostrarPontosNaTela();
    reporEstoqueDaLoja();
}

let telaInicial = document.getElementById("inicio");
let telaDoJogo = document.getElementById("jogo");
let botaoDeJogar = document.getElementById("jogar");

if (telaDoJogo) {
    telaDoJogo.style.display = "none";
}

if (botaoDeJogar) {
    botaoDeJogar.addEventListener("click", function() {
        if (gameStarted || gameEnded) {
            return;
        }
        gameStarted = true;
        if (telaInicial) {
            telaInicial.style.display = "none";
        }
        if (telaDoJogo) {
            telaDoJogo.style.display = "block";
        }
        mostrarPontosNaTela();
        mostrarNivelEExperiencia();
        reporEstoqueDaLoja();
    });
}

function calcularPontosDoClique() {
    let pontosGanhos = pointsPerClick;
    if (planetaJaFoiComprado("mars")) {
        pontosGanhos += 3;
    }
    if (planetaJaFoiComprado("mercury")) {
        pontosGanhos += 2;
    }
    if (planetaJaFoiComprado("venus")) {
        pontosGanhos *= 1.25;
    }
    if (planetaJaFoiComprado("sun")) {
        pontosGanhos *= 1.15;
    }
    pontosGanhos *= levelBonus;
    return pontosGanhos;
}

function calcularPontosPassivos() {
    let pontosGanhos = passivePoints;
    if (planetaJaFoiComprado("earth")) {
        pontosGanhos += 1;
    }
    if (planetaJaFoiComprado("jupiter")) {
        pontosGanhos *= 2;
    }
    if (planetaJaFoiComprado("uranus")) {
        pontosGanhos *= 1.5;
    }
    if (planetaJaFoiComprado("sun")) {
        pontosGanhos *= 1.15;
    }
    pontosGanhos *= levelBonus;
    return pontosGanhos;
}

function calcularBonusDeExperiencia() {
    let bonusDeXP = 1;
    if (planetaJaFoiComprado("saturn")) {
        bonusDeXP *= 1.25;
    }
    if (planetaJaFoiComprado("moon")) {
        bonusDeXP *= 1.5;
    }
    if (planetaJaFoiComprado("sun")) {
        bonusDeXP *= 1.15;
    }
    return bonusDeXP;
}

function mostrarNivelEExperiencia() {
    let textoDoNivel = document.getElementById("nivel");
    let textoDaExperiencia = document.getElementById("experiencia");
    let preenchimentoDaBarraXP = document.getElementById("progresso-xp");
    if (textoDoNivel) {
        textoDoNivel.textContent = "LEVEL " + currentLevel;
    }
    if (textoDaExperiencia) {
        textoDaExperiencia.textContent = Math.floor(experience) + " / " + requiredExperience + " XP";
    }
    if (preenchimentoDaBarraXP) {
        let porcentagemXP = (experience / requiredExperience) * 100;
        if (porcentagemXP > 100) {
            porcentagemXP = 100;
        }
        preenchimentoDaBarraXP.style.width = porcentagemXP + "%";
    }
}

function ganharExperiencia(quantidade) {
    if (quantidade <= 0 || gameEnded) {
        return;
    }
    let experienciaRecebida = quantidade * calcularBonusDeExperiencia();
    experience += experienciaRecebida;
    while (experience >= requiredExperience) {
        experience -= requiredExperience;
        avancarNivel();
    }
    mostrarNivelEExperiencia();
}

function avancarNivel() {
    currentLevel++;
    requiredExperience += 50;
    levelBonus *= 1.05;
    if (currentLevel % 5 === 0) {
        pointsPerClick += 2;
    }
    if (currentLevel % 10 === 0) {
        passivePoints += 2;
    }
}

function criarParticulasDoClique(x, y) {
    let simbolos = ["✦", "✧", "⋆", "★"];
    let cores = ["#fff0b8", "#f7d5ff", "#d9ceff", "#ffffff", "#ffcce5"];
    for (let i = 0; i < 10; i++) {
        let estrela = document.createElement("span");
        let simboloEscolhido = Math.floor(Math.random() * simbolos.length);
        let corEscolhida = Math.floor(Math.random() * cores.length);
        estrela.textContent = simbolos[simboloEscolhido];
        estrela.style.position = "fixed";
        estrela.style.left = x + "px";
        estrela.style.top = y + "px";
        estrela.style.color = cores[corEscolhida];
        estrela.style.fontSize = (12 + Math.random() * 10) + "px";
        estrela.style.pointerEvents = "none";
        estrela.style.zIndex = "9999";
        document.body.appendChild(estrela);
        let movimentoX = (Math.random() - 0.5) * 70;
        let movimentoY = (Math.random() - 0.5) * 70;
        let animacaoDaEstrela = estrela.animate([
            {transform: "translate(-50%, -50%) scale(0)", opacity: 0},
            {transform: "translate(" + movimentoX + "px, " + movimentoY + "px) scale(1)", opacity: 1},
            {transform: "translate(" + (movimentoX * 1.5) + "px, " + (movimentoY * 1.5) + "px) scale(0)", opacity: 0}
        ], {
            duration: 500,
            easing: "ease-out"
        });
        animacaoDaEstrela.onfinish = function() {
            estrela.remove();
        };
    }
}

document.addEventListener("click", function(event) {
    if (!gameStarted || gameEnded) {
        return;
    }
    let alvoDoClique = event.target;
    if (!alvoDoClique.closest) {
        return;
    }
    if (
        alvoDoClique.closest("#inicio") ||
        alvoDoClique.closest("#topo") ||
        alvoDoClique.closest("#loja") ||
        alvoDoClique.closest("#estoquePlanetas") ||
        alvoDoClique.closest(".planeta-movel")
    ) {
        return;
    }
    let pontosDoClique = calcularPontosDoClique();
    totalClicks++;
    criarParticulasDoClique(event.clientX, event.clientY);
    adicionarPontos(pontosDoClique);
    if (gameEnded) {
        return;
    }
    ganharExperiencia(pontosDoClique);
    if (planetaJaFoiComprado("neptune")) {
        clicksForNeptune++;
        if (clicksForNeptune >= 10) {
            clicksForNeptune -= 10;
            adicionarPontos(20);
            if (!gameEnded) {
                ganharExperiencia(20);
            }
        }
    }
});

function criarPlanetaNoCenario(planeta) {
    let areaDosPlanetas = document.getElementById("planetasTela");
    if (!areaDosPlanetas) {
        return;
    }
    let idDoPlaneta = "planet-" + planeta.id;
    if (document.getElementById(idDoPlaneta)) {
        return;
    }
    let tamanhoDoPlaneta = planeta.size;
    let planetaNaTela = document.createElement("div");
    planetaNaTela.className = "planeta-movel";
    planetaNaTela.id = idDoPlaneta;
    planetaNaTela.style.setProperty("--tamanho", tamanhoDoPlaneta + "px");
    planetaNaTela.style.width = tamanhoDoPlaneta + "px";
    planetaNaTela.style.height = tamanhoDoPlaneta + "px";
    planetaNaTela.style.position = "absolute";
    planetaNaTela.style.touchAction = "none";
    let tamanhoDaArea = areaDosPlanetas.getBoundingClientRect();
    let posicaoX = tamanhoDoPlaneta / 2 + Math.random() * Math.max(0, tamanhoDaArea.width - tamanhoDoPlaneta);
    let posicaoY = tamanhoDoPlaneta / 2 + Math.random() * Math.max(0, tamanhoDaArea.height - tamanhoDoPlaneta);
    planetaNaTela.style.left = posicaoX + "px";
    planetaNaTela.style.top = posicaoY + "px";
    planetaNaTela.style.zIndex = "5";
    let imagemDoPlaneta = document.createElement("img");
    imagemDoPlaneta.src = planeta.image;
    imagemDoPlaneta.alt = planeta.name;
    imagemDoPlaneta.draggable = false;
    imagemDoPlaneta.style.width = "100%";
    imagemDoPlaneta.style.height = "100%";
    imagemDoPlaneta.style.objectFit = "contain";
    imagemDoPlaneta.style.pointerEvents = "none";
    planetaNaTela.appendChild(imagemDoPlaneta);
    areaDosPlanetas.appendChild(planetaNaTela);
    ativarArrasteDoPlaneta(planetaNaTela, tamanhoDoPlaneta);
}

function ativarArrasteDoPlaneta(planetaNaTela, tamanhoDoPlaneta) {
    let estaArrastando = false;
    let distanciaDoPonteiroX = 0;
    let distanciaDoPonteiroY = 0;
    planetaNaTela.addEventListener("pointerdown", function(event) {
        if (!gameStarted || gameEnded) {
            return;
        }
        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }
        let posicaoDoPlaneta = planetaNaTela.getBoundingClientRect();
        estaArrastando = true;
        distanciaDoPonteiroX = event.clientX - (posicaoDoPlaneta.left + posicaoDoPlaneta.width / 2);
        distanciaDoPonteiroY = event.clientY - (posicaoDoPlaneta.top + posicaoDoPlaneta.height / 2);
        planetaNaTela.style.zIndex = "99999";
        planetaNaTela.setPointerCapture(event.pointerId);
        event.preventDefault();
    });
    planetaNaTela.addEventListener("pointermove", function(event) {
        if (!estaArrastando || gameEnded) {
            return;
        }
        let areaDosPlanetas = document.getElementById("planetasTela");
        if (!areaDosPlanetas) {
            return;
        }
        let tamanhoDaArea = areaDosPlanetas.getBoundingClientRect();
        let novaPosicaoX = event.clientX - tamanhoDaArea.left - distanciaDoPonteiroX;
        let novaPosicaoY = event.clientY - tamanhoDaArea.top - distanciaDoPonteiroY;
        let metadeDoPlaneta = tamanhoDoPlaneta / 2;
        let limiteDireito = tamanhoDaArea.width - metadeDoPlaneta;
        let limiteInferior = tamanhoDaArea.height - metadeDoPlaneta;
        if (novaPosicaoX < metadeDoPlaneta) {
            novaPosicaoX = metadeDoPlaneta;
        }
        if (novaPosicaoY < metadeDoPlaneta) {
            novaPosicaoY = metadeDoPlaneta;
        }
        if (novaPosicaoX > limiteDireito) {
            novaPosicaoX = limiteDireito;
        }
        if (novaPosicaoY > limiteInferior) {
            novaPosicaoY = limiteInferior;
        }
        planetaNaTela.style.left = novaPosicaoX + "px";
        planetaNaTela.style.top = novaPosicaoY + "px";
    });
    function soltarPlaneta() {
        estaArrastando = false;
        planetaNaTela.style.zIndex = "5";
    }
    planetaNaTela.addEventListener("pointerup", soltarPlaneta);
    planetaNaTela.addEventListener("pointercancel", soltarPlaneta);
    planetaNaTela.addEventListener("lostpointercapture", soltarPlaneta);
}

function mostrarTelaVitoria() {
    if (gameEnded) {
        return;
    }
    gameEnded = true;
    gameStarted = false;
    points = MAX_POINTS;
    mostrarPontosNaTela();
    let telaDoJogo = document.getElementById("jogo");
    if (telaDoJogo) {
        telaDoJogo.style.display = "none";
    }
    let telaDeVitoria = document.createElement("div");
    telaDeVitoria.id = "tela-vitoria";
    telaDeVitoria.style.position = "fixed";
    telaDeVitoria.style.top = "0";
    telaDeVitoria.style.left = "0";
    telaDeVitoria.style.width = "100%";
    telaDeVitoria.style.height = "100%";
    telaDeVitoria.style.display = "flex";
    telaDeVitoria.style.flexDirection = "column";
    telaDeVitoria.style.alignItems = "center";
    telaDeVitoria.style.justifyContent = "center";
    telaDeVitoria.style.textAlign = "center";
    telaDeVitoria.style.padding = "25px";
    telaDeVitoria.style.boxSizing = "border-box";
    telaDeVitoria.style.background = "radial-gradient(circle, #39304e, #111426)";
    telaDeVitoria.style.color = "#f7eaff";
    telaDeVitoria.style.fontFamily = "Trebuchet MS, Arial, sans-serif";
    telaDeVitoria.style.zIndex = "10000";
    let tituloDaVitoria = document.createElement("h1");
    tituloDaVitoria.textContent = "YOU DID IT! ✦";
    tituloDaVitoria.style.fontSize = "clamp(35px, 7vw, 65px)";
    tituloDaVitoria.style.marginBottom = "10px";
    let mensagemDaVitoria = document.createElement("p");
    mensagemDaVitoria.textContent = "You reached 10 million stars! The universe is yours.";
    mensagemDaVitoria.style.fontSize = "18px";
    mensagemDaVitoria.style.maxWidth = "500px";
    mensagemDaVitoria.style.lineHeight = "1.5";
    let pontuacaoFinal = document.createElement("h2");
    pontuacaoFinal.textContent = "10,000,000 ✧";
    pontuacaoFinal.style.fontSize = "clamp(30px, 6vw, 45px)";
    pontuacaoFinal.style.margin = "20px 0";
    let nivelFinal = document.createElement("p");
    nivelFinal.textContent = "Final level: " + currentLevel;
    let totalDeCliques = document.createElement("p");
    totalDeCliques.textContent = "Total clicks: " + totalClicks;
    let agradecimentoFinal = document.createElement("p");
    agradecimentoFinal.textContent = "Thank you for playing Click! ♡";
    agradecimentoFinal.style.marginTop = "30px";
    agradecimentoFinal.style.opacity = "0.8";
    telaDeVitoria.appendChild(tituloDaVitoria);
    telaDeVitoria.appendChild(mensagemDaVitoria);
    telaDeVitoria.appendChild(pontuacaoFinal);
    telaDeVitoria.appendChild(nivelFinal);
    telaDeVitoria.appendChild(totalDeCliques);
    telaDeVitoria.appendChild(agradecimentoFinal);
    document.body.appendChild(telaDeVitoria);
}

setInterval(function() {
    if (!gameStarted || gameEnded) {
        return;
    }
    let pontosPassivosGanhos = calcularPontosPassivos();
    if (pontosPassivosGanhos <= 0) {
        return;
    }
    adicionarPontos(pontosPassivosGanhos);
    if (gameEnded) {
        return;
    }
    ganharExperiencia(pontosPassivosGanhos);
}, 1000);

function prepararJogo() {
    mostrarPontosNaTela();
    mostrarNivelEExperiencia();
    reporEstoqueDaLoja();
}

prepararJogo();