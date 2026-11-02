let hasNext = false;

const loadList = async () => {
    const type = document.getElementById("filtro-tipo").value;
    const order = document.getElementById("ordenar-por").value;
    const response = await fetch(`/api/sightings?page=${currentPage}&type=${encodeURIComponent(type)}&order=${encodeURIComponent(order)}`);
    const data = await response.json();
    hasNext = data.has_next;

    const body = document.getElementById("tabla-body");
    body.innerHTML = "";
    if (data.rows.length === 0) {
        body.innerHTML = '<tr><td colspan="4">No hay datos.</td></tr>';
    }
    data.rows.forEach(r => {
        const tr = document.createElement("tr");
        [r.tipo, r.nombre, r.fecha, r.lugar].forEach(text => {
            const td = document.createElement("td");
            td.textContent = text;
            tr.appendChild(td);
        });
        tr.style.cursor = "pointer";
        tr.addEventListener("click", () => { window.location.href = `/sighting/${r.id}`; });
        body.appendChild(tr);
    });
    document.getElementById("num-pagina").textContent = currentPage;
};

function refreshList() {
    currentPage = 1;
    loadList();
}

function changePage(step) {
    if (step > 0 && !hasNext) return;
    if (currentPage + step < 1) return;
    currentPage += step;
    loadList();
}

loadList();