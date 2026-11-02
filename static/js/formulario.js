const validateName = (name) => { 
    if (!name) return false; 
    let lengthValid = name.trim().length >= 3; 
    return lengthValid;

}

const validateEmail = (email) => { 
    if (!email) return false; 
    let lengthValid = email.trim().length >= 8; 
    let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    let formatValid = re.test(email);
    return lengthValid && formatValid;
} 

const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;
  let lengthValid = phoneNumber.length >= 9;
  let re = /^[0-9]+$/;
  let formatValid = re.test(phoneNumber);
  return lengthValid && formatValid;
}; 

const validateSelect = (select) => { 
    if (!select) return false;
    return true;
}

const validatePostal = (postal) => { 
    if (!postal) return true;
    let lengthValid = postal.trim().length >= 4; 
    const num = Number(postal) ;
    let validation = !isNaN(num);
    return validation && lengthValid;
}


const validateForm = (event) => {
    let name  = document.getElementById("nombre-voluntario").value; 
    let lastname  = document.getElementById("apellidos-voluntario").value; 
    let email  = document.getElementById("email-voluntario").value; 
    let phone  = document.getElementById("num-voluntario").value; 
    let region  = document.getElementById("region").value; 
    let comuna = document.getElementById("comuna").value
    let postal = document.getElementById("num-postal").value

    let isValid = true;

    const error_name = document.getElementById("error-nombre") 

    if (!validateName(name)) { 
        error_name.classList.add("visible"); 
        isValid = false 
    } else {
        error_name.classList.remove("visible"); 
    }
    
    const error_lastname = document.getElementById("error-apellido") 
    
    if (!validateName(lastname)) { 
        error_lastname.classList.add("visible"); 
        isValid = false 
    } else {
        error_lastname.classList.remove("visible"); 
    }
    
    
    const errorEmail = document.getElementById("error-email");
    if (!validateEmail(email)) {
        errorEmail.classList.add("visible");
        isValid = false;
    } else {
        errorEmail.classList.remove("visible");
    }

    const errorPhone = document.getElementById("error-num");
    if (!validatePhoneNumber(phone)) {
        errorPhone.classList.add("visible");
        isValid = false;
    } else {
        errorPhone.classList.remove("visible");
    }

    const errorRegion = document.getElementById("error-region");

    if (!validateSelect(region)) {
        errorRegion.classList.add("visible");
        isValid = false;
    } else {
        errorRegion.classList.remove("visible");
    };

    const errorComuna = document.getElementById("error-comuna");
    if (!validateSelect(comuna)) {
        errorComuna.classList.add("visible");
        isValid = false;
    } else {
         errorComuna.classList.remove("visible");
    };

    const errorPostal = document.getElementById("error-postal");
    if (!validatePostal(postal)) {
        errorPostal.classList.add("visible");
        isValid = false;
    } else {
        errorPostal.classList.remove("visible");
    };


    if (!isValid) {
        event.preventDefault();
    }
};

let form = document.getElementById("form-voluntario");
if (form) {
    form.addEventListener("submit", validateForm); 
}