const regionSelect = document.getElementById("region");
const comunaSelect = document.getElementById("comuna");

const opcionesComunas = Array.from(comunaSelect.querySelectorAll("option")).filter(opt => opt.value !== "");

const updateComuna = () => {
    let selectedRegion = regionSelect.value;
    
    comunaSelect.innerHTML = '<option value="">-- Seleccione una Comuna --</option>';
    
    opcionesComunas.forEach(option => {
        if (option.dataset.region === selectedRegion) {
            comunaSelect.appendChild(option.cloneNode(true));
        }
    });
};

regionSelect.addEventListener("change", updateComuna);