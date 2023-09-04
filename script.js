const balance_p=document.getElementById("balance_p");
const balance_span=document.getElementById("balance_span");
const bet_number=document.getElementById("bet_num");
const play_btn=document.getElementById("play_btn");
const autospin_btn=document.getElementById("autospin_btn");
const numbers_ul=document.getElementById("numbers_ul");
const numbers_li=document.getElementById("numbers_li");
const container_div=document.getElementById("container");
const money_rain_div=document.getElementById("money_rain_div");
const autospin_num=document.getElementById("autospin_num");
const all_num_input = document.querySelectorAll('input[type="number"]');
const spins_span=document.getElementById("spins_span");

const win_rate=1.2;
const lose_rate=1;

let balance=100;
let bet=1;
let win_multiplier=0;
let lis = document.getElementById("container").getElementsByClassName("numbers_li");
let lis_length=0;
let counter=0;
let test_on=false;
let idozito;
let balanceIdozito;
let autospin_value;
let autospins;
let spin_counter;

const emoji_array=[];
emoji_array.length=25;
emoji_array_length=emoji_array.length;


// load functions on page load
document.addEventListener("DOMContentLoaded", function() {
    hideMoneyRain();
    hideWinImage();
    listItemGenerator();
    balance_span.textContent=`${balance}$`;
    bet_number.value=bet;
    autospin_num.value=0;
    spin_counter=0;
    numInputsEventListeners();
    numInput_amountChecker();
});

function numInputsEventListeners(){
    Array.from(all_num_input).forEach(function(input) {
        input.addEventListener("input", function() {
          clearInterval(autospins);
          clearInterval(idozito);  
          if (this.value < 0) {
            this.value = 0;
          }
        });
      });
}

function showMoneyRain(){
    money_rain_div.style.display = "block";
}

function hideMoneyRain(){
    money_rain_div.style.display = "none";
}

function listItemGenerator(){
    for (let i = 0; i < 25; i++) {
        const listItem=document.createElement("li");
        listItem.classList.add("numbers_li");
        const random_emoji=Math.floor(Math.random() * (80 - 12 + 1)) + 12;
        listItem.innerHTML=`&#1285${random_emoji}`;
        numbers_ul.appendChild(listItem);
        lis_length++;
    }
}

function playGame(){
    bet=bet_number.value;
    if (bet>0) {
        bet_number.style.background="white";
        bet_number.style.color="black";
        if(balance-bet*lose_rate>=0){
            spin_counter++;
            for (let i = 0; i < lis_length; i++) {
                const random_number=Math.floor(Math.random() * 2);
                if (random_number===0) {
                    lis[i].innerHTML=`&#128553`;
                    emoji_array[i]="&#128553";
                }
                else if(random_number===1){
                    lis[i].innerHTML=`&#129297`;
                    emoji_array[i]="&#129297";
                }
            }
            winChecker();
        }
        else{
            uploadMoneyAlert();
        }
    }
    spins_span.innerHTML=spin_counter;
}

function autospinUpdater(){
    bet=bet_number.value;
    autospin_value=autospin_num.value;
    
    if (test_on && bet>0 && autospin_value>0) {
        autospin_value--;
    }
    else {
        test_on=false;
        clearInterval(autospins);
        clearInterval(idozito);
    }
    autospin_num.value=autospin_value;
}

function numInput_amountChecker(){
    Array.from(all_num_input).forEach(function(input) {
        input.addEventListener("input", function() {
          if (this.value <= 0) {
            this.style.backgroundColor = "red";
            this.style.color = "white";
          }
          else{
            this.style.backgroundColor = "white";
            this.style.color = "black";
          }
        });
      });
}

autospin_btn.addEventListener('click', function() {
    autospin_value=autospin_num.value;
    
    test_on=true;
    if (test_on && autospin_value>0) {
        autospins = setInterval(autospinUpdater, 248);
        idozito = setInterval(playGame, 250);
    } else{
        test_on=false;
        clearInterval(autospins);
        clearInterval(idozito);
    }
});

function generateRandomNumber(){
    for (let i = 0; i < lis_length; i++) {
        const random_number=Math.floor(Math.random()*3+1);
        emoji_array[i]=random_number;
        lis[i].textContent=random_number;
    }
    winChecker();
}

function winChecker(){
    hideMoneyRain();
    hideWinImage();
    for (let i = 0; i < lis_length; i++) {                  // green background after win is cleared
        lis[i].style.backgroundColor = "transparent";
    }
    let win=false;
    win_multiplier=0;
    bet=parseFloat(bet_number.value);
    for (let i = 0; i < emoji_array_length; i++) {
        if ((i===0 
            || i===5
            || i===10
            || i===15
            || i===20) && emoji_array[i]==="&#129297") {
                if (emoji_array[i]===emoji_array[i+1] 
                    && emoji_array[i]===emoji_array[i+2]
                    && emoji_array[i]===emoji_array[i+3]
                    && emoji_array[i]===emoji_array[i+4]) {
                        lis[i].style.backgroundColor = "green";
                        lis[i+1].style.backgroundColor = "green";
                        lis[i+2].style.backgroundColor = "green";
                        lis[i+3].style.backgroundColor = "green";
                        lis[i+4].style.backgroundColor = "green";
                        win=true;
                        win_multiplier++;
                }
        }
        
    }
    if(win){
        showMoneyRain();
        showWinImage();
        balance+=bet*(win_rate*win_multiplier);
        balance_span.textContent=`${Math.floor(balance)}$`;
        win=false;
    }
    else if(!win && balance-bet*lose_rate>0){
        balance-=bet*lose_rate;
        balance_span.textContent=`${Math.floor(balance)}$`;
        win=false;
    }
    else if(!win && balance-bet*lose_rate<=0){
        clearInterval(idozito);
        uploadMoneyAlert();
        balance_span.textContent=`${Math.floor(balance)}$`;
        win=false;
    }
    else if(!win && balance===0){
        clearInterval(idozito);
        uploadMoneyAlert();
        balance_span.textContent=`${Math.floor(balance)}$`;
        win=false;
    }
}

function uploadMoneyAlert(){
    alert("UPLOAD MONEY TO YOUR BALANCE!");
}

function hideWinImage() {
    var winImages = document.getElementsByClassName("win_img");
  
    for (var i = 0; i < winImages.length; i++) {
      winImages[i].style.display = "none";
    }
}

function showWinImage() {
    var winImages = document.getElementsByClassName("win_img");
  
    for (var i = 0; i < winImages.length; i++) {
      winImages[i].style.display = "block";
    }
}

play_btn.addEventListener("click",()=>{
    clearInterval(idozito);
    test_on=false;
    playGame();
});

// 128553 sad emoji
// 129297 money emoji


