export function showError(message, error_div){
    const error = document.getElementById("error");
    error.classList.remove("display-none");
    error.classList.add("display-flex-center")
    error.innerHTML = message;
}

export function clearError(){
   const error = document.getElementById("error");
   error.classList.remove("display-flex-center")
   error.classList.add("display-none");
   error.innerHTML = "";
}

export function checkFields(id1, lblid){
   let error = 0;
   let errormessage = []; 
   const password = document.getElementById(id1);
   const lblpass = document.getElementById(lblid);
   const errordiv = document.getElementById("error");
        if(typeof password.value !== 'string'){
          errormessage.push("Помилка при введенні паролю.");
          
        }
        if(password.value.length < 8){
           error++;
           errormessage.push("Мінімальна довжина паролю 8 символів.");
       }
        if(password.value.length > 30){
          error++;
          errormessage.push("Максимальнаа довжина паролю 30 символів.");
        }    
        if(password.value.search(/[a-z]/) === -1 || password.value.search(/[A-Z]/) === -1){
          error++;
          errormessage.push("Пароль повинен містити мінімум 1 прописну та 1 велику латинську літеру.");
        }
         if(password.value.search(/[0123456789]/) === -1){
         error++;
          errormessage.push("Пароль повинен містити мінімум 1 цифру.");
        }
         if(password.value.search(/\s/) !== -1){
          error++;
          errormessage.push("Пароль не повинен містити пробілів.");
        }      
        if(error > 0){
           let message = errormessage.join(' ');
           errordiv.classList.remove("display-none");
           errordiv.classList.add("display-flex-center")
           errordiv.innerHTML = message;
           lblpass.classList.add("emptyField");
           password.style.border = "1px solid red";
           return false;
        }
        errordiv.innerHTML = "";
        errordiv.classList.remove("display-flex-center")
        errordiv.classList.add("display-none");
        lblpass.classList.remove("emptyField");
        password.style.border = "none";
        return true;
}

export let timer;

export function initTimer() {
  console.log("Assa");
  const btn = document.getElementById('send-again');
  console.log(btn);
  console.log("S1");
  btn.classList.add("display-none");
  // btn.classList.add("display-none");
  console.log("S2");
  const timerVal = document.getElementById('send-again-timer');
  console.log("S3");
  timerVal.style.display ="block";
  console.log("S4");
  console.log("here i am1");

  let i = 120;
    timer = setInterval(function () {
      i--;
      timerVal.innerHTML = 'Відправити код повторно: ' + i;
      if (i === 0) {
        timerVal.style.display = 'none';
        btn.classList.remove("display-none");
        clearInterval(timer);
      }
    }, 1000)
    console.log("here i am2");
}

export function showhidepassHandler(event){
  let passinput = event.target.previousElementSibling;
  let eye = event.target;
  if(passinput.getAttribute('type') === 'password'){
      eye.classList.add('view');
      passinput.setAttribute('type', 'text');
  }
  else{
      eye.classList.remove('view');
      passinput.setAttribute('type', 'password');
  }
}