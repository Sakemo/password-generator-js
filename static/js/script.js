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
const darkModeToggle   = document.getElementById('dark-mode-toggle');

// Constantes e conjuntos de caracteres
const DEFAULT_LENGTH = 12;
const UPPERCASE      = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE      = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS        = "0123456789";
const SPECIAL        = '@#$%&*()_+§=/-."^><[]{}´`?/:;|';
const CHAR_SETS      = [UPPERCASE, LOWERCASE, NUMBERS, SPECIAL];

// Array que armazenará as senhas salvas
let savedPasswords = [];

// Carrega as senhas salvas do localStorage
const loadSavedPasswords = () => {
  const saved = localStorage.getItem('savedPasswords');
  if (saved) {
    savedPasswords = JSON.parse(saved);
  }
  updateSavedPasswords();
};

// Salva o array de senhas no localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
};

// Funções de Modo Claro/Escuro
const loadDarkModePreference = () => {
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
};

const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
    darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    localStorage.setItem('darkMode', 'disabled');
    darkModeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
};

darkModeToggle.addEventListener('click', toggleDarkMode);

// Retorna um caractere aleatório de uma string
const getRandomChar = (str) => str.charAt(Math.floor(Math.random() * str.length));

// Gera uma nova senha
const generatePassword = () => {
  const length = parseInt(passwordLengthIn.value) || DEFAULT_LENGTH;
  let password = "";
  // Garante que cada conjunto de caracteres contribua com pelo menos um caractere
  CHAR_SETS.forEach(set => {
    password += getRandomChar(set);
  });
  // Preenche o restante com caracteres aleatórios de todos os conjuntos
  const allChars = CHAR_SETS.join('');
  while (password.length < length) {
    password += getRandomChar(allChars);
  }
  // Embaralha a senha para maior aleatoriedade
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

// Alterna a exibição do painel de opções com animação
toggleOptionsBtn.addEventListener('click', () => {
  optionsPanel.classList.toggle('visible');
});

// Mascara a senha com bullets
const maskPassword = (password) => "•".repeat(password.length);

// Atualiza a exibição das senhas salvas
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

    // Eventos individuais para cada cartão
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

// Alterna a visibilidade da senha em um cartão salvo
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

// Salva a senha gerada com os dados de serviço e usuário
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

  // Limpa os campos de serviço e usuário
  serviceNameIn.value = '';
  usernameIn.value    = '';
});

// Gera uma nova senha ao clicar no botão
generateBtn.addEventListener('click', generatePassword);

// Carrega as senhas salvas e a preferência de modo escuro ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
  loadSavedPasswords();
  loadDarkModePreference();
});
