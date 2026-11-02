const validateNombre = (nombre) => {
    if (!nombre) return false;
    let largo = nombre.trim().length;
    return largo >= 3 && largo <= 50;
}
 
const validateComentario = (comentario) => {
    if (!comentario) return false;
    let largo = comentario.trim().length;
    return largo >= 5 && largo <= 300;
}
 
const validateComentarioForm = (event) => {
    let nombre = document.getElementById("nombre-comentarista").value;
    let comentario = document.getElementById("comentario").value;
 
    let isValid = true;
 
    const errorNombre = document.getElementById("error-nombre-comentario");
    if (!validateNombre(nombre)) {
        errorNombre.classList.add("visible");
        isValid = false;
    } else {
        errorNombre.classList.remove("visible");
    }
 
    const errorComentario = document.getElementById("error-comentario");
    if (!validateComentario(comentario)) {
        errorComentario.classList.add("visible");
        isValid = false;
    } else {
        errorComentario.classList.remove("visible");
    }
 
    if (!isValid) {
        event.preventDefault();
    }
};
 
let formComentario = document.getElementById("form-comentario");
if (formComentario) {
    formComentario.addEventListener("submit", validateComentarioForm);
}