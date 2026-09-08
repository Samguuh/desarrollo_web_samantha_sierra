let sightings = [];
let currentPage = 1;
const perPage = 5;

const validateName = (name) => { 
    if (!name) return false; 
    let lengthValid = name.trim().length >= 3; 
    return lengthValid;
};

const validateSelect = (select) => { 
    if (!select) return false;
    return true;
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
    return true && lengthValid;
};

const refreshList = () => {
    let typeSel = document.getElementById("filtro-tipo").value;
    let orderSel = document.getElementById("ordenar-por").value;

    let data = [];
    for (let i = 0; i < sightings.length; i++) {
        if (typeSel === "" || sightings[i].type === typeSel) {
            data.push(sightings[i]);
        }
    }

    data.sort((a, b) => {
        if (orderSel === "fecha") {
            return new Date(a.date_hour) - new Date(b.date_hour);
        } else {
            return a.region.localeCompare(b.region);
        }
    });

    let tbody = document.getElementById("tabla-body");
    tbody.innerHTML = "";

    let start = (currentPage - 1) * perPage;
    let end = start + perPage;
    let pageData = data.slice(start, end);

    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No hay resultados.</td></tr>';
    } else {
        for (let i = 0; i < pageData.length; i++) {
            let item = pageData[i];
            tbody.innerHTML += `
                <tr>
                    <td>${item.type}</td>
                    <td>${item.name}</td>
                    <td>${item.date_hour}</td>
                    <td>${item.comuna}, ${item.region}</td>
                </tr>
            `;
        }
    }

    document.getElementById("num-pagina").innerHTML = currentPage;
};

const changePage = (direction) => {
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    refreshList();
};

const validateSightingForm = (event) => {
    event.preventDefault();

    let type = document.getElementById("tipo-ave").value;
    let name = document.getElementById("nombre-ave").value;
    let date_hour = document.getElementById("fecha-hora-avistamiento").value;
    let region = document.getElementById("region").value;
    let comuna = document.getElementById("comuna").value;
    let filesInput = document.getElementById("archivos-avistamiento");
    let files = filesInput.files;

    let isValid = true;

    const errorType = document.getElementById("error-tipo-ave");
    if (!validateSelect(type)) {
        errorType.classList.add("visible");
        isValid = false;
    } else {
        errorType.classList.remove("visible");
    }

    const errorName = document.getElementById("error-nombre-ave");
    if (!validateName(name)) {
        errorName.classList.add("visible");
        isValid = false;
    } else {
        errorName.classList.remove("visible");
    }

    const errorDateTime = document.getElementById("error-fecha-hora");
    if (!validateDateTime(date_hour)) {
        errorDateTime.classList.add("visible");
        isValid = false;
    } else {
        errorDateTime.classList.remove("visible");
    }

    const errorRegion = document.getElementById("error-region");
    if (!validateSelect(region)) {
        errorRegion.classList.add("visible");
        isValid = false;
    } else {
        errorRegion.classList.remove("visible");
    }

    const errorComuna = document.getElementById("error-comuna");
    if (!validateSelect(comuna)) {
        errorComuna.classList.add("visible");
        isValid = false;
    } else {
        errorComuna.classList.remove("visible");
    }

    const errorFiles = document.getElementById("error-archivos");
    if (!validateFiles(files)) {
        errorFiles.classList.add("visible");
        isValid = false;
    } else {
        errorFiles.classList.remove("visible");
    }

    if (isValid) {
        sightings.push({
            type: type,
            name: name,
            date_hour: date_hour,
            region: region,
            comuna: comuna
        });
        alert("¡Avistamiento validado e informado con éxito!");
        document.getElementById("form-avistamiento").reset();
        refreshList();
    }
};

let form = document.getElementById("form-avistamiento");
form.addEventListener("submit", validateSightingForm); 
