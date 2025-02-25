'use strict';

// Seleção dos elementos do DOM
const passwordInput    = document.getElementById('password');
const generateBtn      = document.getElementById('generate-password');
const copyPasswordBtn  = document.getElementById('copy-password-btn');
const passwordLengthIn = document.getElementById('password-length');
const serviceNameIn    = document.getElementById('service-name');
const usernameIn       = document.getElementById('username');
const savePasswordBtn  = document.getElementById('save-password');
const toggleOptionsBtn = document.getElementById('toggle-options');
const optionsPanel     = document.getElementById('options-panel');
const savedCardsCont   = document.querySelector('.saved-cards');
const clearAllBtn      = document.getElementById('clear-all');
const themeToggle      = document.getElementById('theme-toggle');

// Paleta de caracteres para geração de senhas
const DEFAULT_LENGTH = 12;
const UPPERCASE      = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE      = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS        = "0123456789";
const SPECIAL        = '@#$%&*()_+§=/-."^><[]{}´`?/:;|';
const CHAR_SETS      = [UPPERCASE, LOWERCASE, NUMBERS, SPECIAL];

// Array para armazenar as senhas salvas
let savedPasswords = [];

// Carrega as senhas salvas do localStorage
const loadSavedPasswords = () => {
  const saved = localStorage.getItem('savedPasswords');
  if (saved) {
    savedPasswords = JSON.parse(saved);
  }
  updateSavedPasswords();
};

// Salva as senhas no localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
};

// Tema: utiliza localStorage para persistir a preferência
const loadThemePreference = () => {
  const theme = localStorage.getItem('theme') || 'dark';
  if (theme === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    document.body.classList.remove('light-mode');
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
};

const toggleTheme = () => {
  document.body.classList.toggle('light-mode');
  if (document.body.classList.contains('light-mode')) {
    localStorage.setItem('theme', 'light');
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    localStorage.setItem('theme', 'dark');
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
};

themeToggle.addEventListener('click', toggleTheme);

// Retorna um caractere aleatório
const getRandomChar = (str) => str.charAt(Math.floor(Math.random() * str.length));

// Gera uma nova senha
const generatePassword = () => {
  const length = parseInt(passwordLengthIn.value) || DEFAULT_LENGTH;
  let password = "";
  // Garante pelo menos um caractere de cada conjunto
  CHAR_SETS.forEach(set => {
    password += getRandomChar(set);
  });
  const allChars = CHAR_SETS.join('');
  while (password.length < length) {
    password += getRandomChar(allChars);
  }
  // Embaralha a senha
  password = password.split('').sort(() => 0.5 - Math.random()).join('');
  passwordInput.value = password;
};

// Copia texto para a área de transferência
const copyTextToClipboard = async (text) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      const tempInput = document.createElement('input');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
    }
    alert('Senha copiada!');
  } catch (error) {
    alert('Erro ao copiar a senha.');
  }
};

copyPasswordBtn.addEventListener('click', () => {
  const text = passwordInput.value;
  if (text) {
    copyTextToClipboard(text);
  }
});

// Alterna exibição do painel de opções
toggleOptionsBtn.addEventListener('click', () => {
  optionsPanel.classList.toggle('visible');
});

// Retorna a senha mascarada (bullets)
const maskPassword = (password) => "•".repeat(password.length);

// Atualiza os cartões de senhas salvas
const updateSavedPasswords = () => {
  savedCardsCont.innerHTML = '';
  if (savedPasswords.length === 0) {
    savedCardsCont.innerHTML = '<p class="no-saved">Nenhuma senha salva</p>';
    return;
  }
  savedPasswords.forEach((entry, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${entry.service}</h3>
      <p><strong>Usuário:</strong> ${entry.user}</p>
      <p>
        <strong>Senha:</strong> 
        <span class="password" id="saved-password-${index}" data-visible="false">
          ${maskPassword(entry.password)}
        </span>
        <i class="fa-solid fa-eye toggle" id="toggle-${index}" title="Mostrar Senha"></i>
        <i class="fa-solid fa-trash delete" id="delete-${index}" title="Excluir Senha"></i>
        <i class="fa-solid fa-copy copy" id="copy-${index}" title="Copiar Senha"></i>
      </p>
    `;
    savedCardsCont.appendChild(card);

    // Eventos individuais
    document.getElementById(`toggle-${index}`).addEventListener('click', () => {
      togglePasswordVisibility(index);
    });
    document.getElementById(`delete-${index}`).addEventListener('click', () => {
      deleteSavedPassword(index);
    });
    document.getElementById(`copy-${index}`).addEventListener('click', () => {
      copyTextToClipboard(savedPasswords[index].password);
    });
  });
};

// Alterna a visibilidade da senha de um cartão
const togglePasswordVisibility = (index) => {
  const passwordSpan = document.getElementById(`saved-password-${index}`);
  const toggleIcon   = document.getElementById(`toggle-${index}`);
  const isVisible    = passwordSpan.getAttribute('data-visible') === 'true';

  if (isVisible) {
    passwordSpan.textContent = maskPassword(savedPasswords[index].password);
    passwordSpan.setAttribute('data-visible', 'false');
    toggleIcon.classList.remove('fa-eye-slash');
    toggleIcon.classList.add('fa-eye');
    toggleIcon.title = "Mostrar Senha";
  } else {
    passwordSpan.textContent = savedPasswords[index].password;
    passwordSpan.setAttribute('data-visible', 'true');
    toggleIcon.classList.remove('fa-eye');
    toggleIcon.classList.add('fa-eye-slash');
    toggleIcon.title = "Ocultar Senha";
  }
};

// Exclui uma senha salva
const deleteSavedPassword = (index) => {
  if (confirm('Deseja excluir esta senha?')) {
    savedPasswords.splice(index, 1);
    saveToLocalStorage();
    updateSavedPasswords();
  }
};

// Limpa todas as senhas salvas
clearAllBtn.addEventListener('click', () => {
  if (confirm('Tem certeza de que deseja limpar todas as senhas salvas?')) {
    savedPasswords = [];
    saveToLocalStorage();
    updateSavedPasswords();
  }
});

// Salva a senha gerada com dados de serviço e usuário
savePasswordBtn.addEventListener('click', () => {
  const serviceName = serviceNameIn.value.trim();
  const username    = usernameIn.value.trim();
  const password    = passwordInput.value.trim();

  if (!password || !serviceName || !username) {
    alert('Preencha todos os campos para salvar a senha!');
    return;
  }

  const entry = { service: serviceName, user: username, password };
  savedPasswords.push(entry);
  saveToLocalStorage();
  updateSavedPasswords();

  // Limpa os campos
  serviceNameIn.value = '';
  usernameIn.value    = '';
});

// Eventos para geração de senha e carregamento inicial
generateBtn.addEventListener('click', generatePassword);

document.addEventListener('DOMContentLoaded', () => {
  loadSavedPasswords();
  loadThemePreference();
});

/* -----------------------------
   Animação de Fundo - Matrix Rain
------------------------------ */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

// Ajusta dimensões do canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()';
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
  // Define cores de acordo com o modo
  let fadeColor, textColor;
  if (document.body.classList.contains('light-mode')) {
    // Modo claro: fundo branco com efeito de desvanecimento e texto preto
    fadeColor = 'rgba(255, 255, 255, 0.05)';
    textColor = '#000';
  } else {
    // Modo escuro: fundo preto com efeito de desvanecimento e texto verde neon
    fadeColor = 'rgba(0, 0, 0, 0.05)';
    textColor = '#0F0';
  }
  
  // Cria o efeito de desvanecimento
  ctx.fillStyle = fadeColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = textColor;
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    // Reinicia a queda aleatoriamente
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, 33);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
