const PASSWORDBOX = document.getElementById("password");
const BTNGENERATOR = document.querySelector('.cont button')
const lengthPassInput = document.getElementById('password-length')
const LENGHT = 12;

const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
const NumbersChar = '0123456789';
const SpecialChar = '@#$%&*()_+§=/-."^><[]{}´`?/:;|'
const CHARACTERS = [upperCaseLetters, LowerCaseLetters, NumbersChar, SpecialChar]

function RamdomChar(char){
    return char[Math.floor(Math.random() * char.length)];
}

function CreatePass(){
    let length = lengthPassInput.value || 12
    let password = "";
    let AllChars = CHARACTERS.join('')
    for(i = 0; i < CHARACTERS.length; i++){
        password += RamdomChar(CHARACTERS[i]);
    };
    while(length > password.length){
        password += RamdomChar(AllChars);
    };
    PASSWORDBOX.value = password;

};

function CopyPass(){
    PASSWORDBOX.select();
    document.execCommand("copy");
};

BTNGENERATOR.addEventListener('click',()=>{
    CreatePass()
});

function MenuDisplay(){
    let Arrow = document.querySelector('.btns .menu-btn i');
    let MenuToDisplay = document.querySelector('.menu input');
    let MenuCont = document.querySelector('.menu');
    if (MenuToDisplay.style.display == 'none'){
        Arrow.classList.remove('fa-chevron-right');
        Arrow.classList.add('fa-chevron-down');
        MenuCont.style.width = '80%';
        setTimeout(()=>{
            MenuToDisplay.style.opacity = '100%'
            MenuToDisplay.style.display = 'block';
        }, 50);
    }else{
        Arrow.classList.remove('fa-chevron-down');
        Arrow.classList.add('fa-chevron-right');
        MenuCont.style.width = '0%';
        MenuToDisplay.style.opacity = '80%'
        setTimeout(()=>{
            MenuToDisplay.style.display = 'none';
        }, 489);

    }
};

