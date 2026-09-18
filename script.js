// Lista de palavras para o jogo
const wordsList = [
  { word: "BOLA", emoji: "⚽", options: ["BO", "LA", "CA", "FA"] },
  { word: "GATO", emoji: "🐱", options: ["GA", "TO", "MA", "VA"] },
  { word: "PATO", emoji: "🦆", options: ["PA", "TO", "SA", "LO"] },
  { word: "CASA", emoji: "🏠", options: ["CA", "SA", "BO", "ZA"] },
  { word: "SOL",  emoji: "☀️", options: ["SO", "L", "RA", "MI"] }
];

let currentLevel = 0;
let score = 0;
let selectedSyllables = [];

// Elementos HTML
const emojiDisplay = document.getElementById("emoji-display");
const targetContainer = document.getElementById("target-container");
const optionsContainer = document.getElementById("options-container");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const scoreDisplay = document.getElementById("score");

// Função para iniciar o nível
function loadLevel() {
  feedback.innerText = "";
  feedback.className = "feedback";
  nextBtn.style.display = "none";
  targetContainer.innerHTML = "";
  optionsContainer.innerHTML = "";
  selectedSyllables = [];

  const data = wordsList[currentLevel];
  emojiDisplay.innerText = data.emoji;

  // Fala o nome do objeto usando a voz do navegador
  speak(data.word);

  // Embaralhar opções
  const shuffledOptions = [...data.options].sort(() => Math.random() - 0.5);

  // Criar botões das opções
  shuffledOptions.forEach(syllable => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = syllable;
    btn.onclick = () => selectSyllable(syllable, btn);
    optionsContainer.appendChild(btn);
  });
}

// Ao clicar em uma sílaba/letra
function selectSyllable(syllable, btnElement) {
  speak(syllable); // Fala a sílaba ao clicar
  selectedSyllables.push(syllable);
  
  // Esconde o botão clicado
  btnElement.style.visibility = "hidden";

  // Adiciona a caixa na área da palavra
  const box = document.createElement("div");
  box.className = "letter-box";
  box.innerText = syllable;
  targetContainer.appendChild(box);

  // Verifica se completou o número de sílabas necessárias
  const currentWord = wordsList[currentLevel].word;
  const formedWord = selectedSyllables.join("");

  if (formedWord.length >= currentWord.length) {
    checkAnswer(formedWord, currentWord);
  }
}

// Verifica a resposta
function checkAnswer(formed, target) {
  if (formed === target) {
    feedback.innerText = "Muito Bem! 🎉";
    feedback.classList.add("correct");
    score += 10;
    scoreDisplay.innerText = score;
    speak("Muito bem! " + target);
    nextBtn.style.display = "inline-block";
  } else {
    feedback.innerText = "Tente de novo! ❌";
    feedback.classList.add("wrong");
    speak("Ops, tente de novo!");
    setTimeout(loadLevel, 1500); // Reinicia o nível atual
  }
}

// Passar de nível
function nextLevel() {
  currentLevel++;
  if (currentLevel < wordsList.length) {
    loadLevel();
  } else {
    emojiDisplay.innerText = "🏆";
    targetContainer.innerHTML = "<h2>Parabéns! Você venceu o jogo!</h2>";
    optionsContainer.innerHTML = "";
    nextBtn.style.display = "none";
    speak("Parabéns! Você concluiu todos os níveis!");
  }
}

// Função de acessibilidade/áudio (Recurso nativo da Web Speech API)
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.8; // Velocidade um pouco mais lenta para facilitar o entendimento
    window.speechSynthesis.speak(utterance);
  }
}

// Inicia o jogo na primeira carga
window.onload = loadLevel;
