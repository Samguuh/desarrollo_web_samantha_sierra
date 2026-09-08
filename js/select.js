const data = {
    "arica-y-parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "tarapaca": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica"],
    "antofagasta": ["Antofagasta", "Mejillones", "Taltal", "Calama", "Tocopilla"],
    "atacama": ["Copiapó", "Caldera", "Vallenar", "Chañaral"],
    "coquimbo": ["La Serena", "Coquimbo", "Vicuña", "Monte Patria", "Illapel"],
    "valparaiso": ["Valparaíso", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana", "San Antonio"],
    "rm": ["Santiago", "Providencia", "Las Condes", "Maipú", "Ñuñoa", "La Florida", "Macul", "Pudahuel"],
    "bernardo-ohiggins": ["Rancagua", "Machalí", "Rengo", "San Fernando", "Pichilemu"],
    "maule": ["Talca", "Constitución", "Curicó", "Linares"],
    "nuble": ["Chillán", "Chillán Viejo", "San Carlos", "Bulnes"],
    "biobio": ["Concepción", "Talcahuano", "San Pedro de la Paz", "Coronel", "Los Ángeles"],
    "la-araucania": ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol"],
    "los-rios": ["Valdivia", "La Unión", "Río Bueno", "Panguipulli"],
    "los-lagos": ["Puerto Montt", "Puerto Varas", "Castro", "Ancud", "Osorno"],
    "aysen": ["Coyhaique", "Aysén", "Chile Chico"],
    "magallanes": ["Punta Arenas", "Puerto Natales", "Porvenir"] // para esta parte le pedi a la IA que me ejemplos de comunas arbitrarias, ya que eran demaciadas jeje 
    // y dado que en ese caso seria mucho mas comodo agregar un select para las provincias y asi ir recortando
  };


const updateComuna = () => {
    let regionSelect = document.getElementById("region");
    let comunaSelect = document.getElementById("comuna");
    
    let selectedRegion = regionSelect.value;
    
    comunaSelect.innerHTML = '<option value="">-- Seleccione una Comuna --</option>';
    
    if (data[selectedRegion]) {
      data[selectedRegion].forEach(comuna => {
        let option = document.createElement("option");
        option.value = comuna;
        option.text = comuna;
        comunaSelect.appendChild(option);
      });
    }
  };
  
  document.getElementById("region").addEventListener("change", updateComuna);

  