let currentPage = 1;

const validateName = (name) => { 
    if (!name) return false; 
    return name.trim().length >= 3;
};

const validateSelect = (select) => { 
    return select !== null && select !== undefined && select.trim() !== "";
};

const validateDateTime = (dateTimeString) => {
    if (!dateTimeString) return false;
    const selectedDate = new Date(dateTimeString);
    const today = new Date();
    return !isNaN(selectedDate.getTime()) && selectedDate <= today;
};

const validateFiles = (files) => {
    if (!files) return false;
    let lengthValid = files.length >= 1 && files.length <= 3;

    for (let i = 0; i < files.length; i++) {
        const fileType = files[i].type; 
        const isImage = fileType.startsWith("image/");
        const isVideo = fileType.startsWith("video/");

        if (!isImage && !isVideo) {
            return false; 
        }
    }
    return lengthValid;
};

const validateSightingForm = (event) => {

    let typeElem = document.getElementById("tipo-ave");
    let nameElem = document.getElementById("nombre-ave");
    let dateElem = document.getElementById("fecha-hora-avistamiento");
    let regionElem = document.getElementById("region");
    let comunaElem = document.getElementById("comuna");
    let filesInput = document.getElementById("archivos-avistamiento");

    let type = typeElem ? typeElem.value : ""; //https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Expressions_and_operators
    let name = nameElem ? nameElem.value : "";
    let date_hour = dateElem ? dateElem.value : "";
    let region = regionElem ? regionElem.value : "";
    let comuna = comunaElem ? comunaElem.value : "";
    let files = filesInput ? filesInput.files : [];

    let isValid = true;

    const errorType = document.getElementById("error-tipo-ave");
    if (errorType) {
        if (!validateSelect(type)) { errorType.classList.add("visible"); isValid = false; }
        else { errorType.classList.remove("visible"); }
    }

    const errorName = document.getElementById("error-nombre-ave");
    if (errorName) {
        if (!validateName(name)) { errorName.classList.add("visible"); isValid = false; }
        else { errorName.classList.remove("visible"); }
    }

    const errorDateTime = document.getElementById("error-fecha-hora");
    if (errorDateTime) {
        if (!validateDateTime(date_hour)) { errorDateTime.classList.add("visible"); isValid = false; }
        else { errorDateTime.classList.remove("visible"); }
    }

    const errorRegion = document.getElementById("error-region");
    if (errorRegion) {
        if (!validateSelect(region)) { errorRegion.classList.add("visible"); isValid = false; }
        else { errorRegion.classList.remove("visible"); }
    }

    const errorComuna = document.getElementById("error-comuna");
    if (errorComuna) {
        if (!validateSelect(comuna)) { errorComuna.classList.add("visible"); isValid = false; }
        else { errorComuna.classList.remove("visible"); }
    }

    const errorFiles = document.getElementById("error-archivos");
    if (errorFiles) {
        if (!validateFiles(files)) { errorFiles.classList.add("visible"); isValid = false; }
        else { errorFiles.classList.remove("visible"); }
    }

    if (!isValid) {
        event.preventDefault();
    }
};

let form = document.getElementById("form-avistamiento");
if (form) {
    form.addEventListener("submit", validateSightingForm);
}

