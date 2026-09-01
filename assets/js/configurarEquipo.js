async function iniciar() {

    // Mostrar el nombre del equipo
    const hostname = await window.electronAPI.getHostname();

    document.getElementById("txtHostname").value = hostname;

    // Cargar ambientes
    const ambientes = await window.electronAPI.getAmbientes();

    const combo = document.getElementById("cmbAmbientes");

    combo.innerHTML = "";

    ambientes.forEach(ambiente => {

        const option = document.createElement("option");

        option.value = ambiente.id;

        option.textContent = `${ambiente.tipo} - ${ambiente.nombre}`;

        combo.appendChild(option);

    });

}

document.getElementById("btnGuardar")
.addEventListener("click", async () => {

    const ambienteId = document.getElementById("cmbAmbientes").value;

    await window.electronAPI.saveWorkstation(ambienteId);

    document.getElementById("lblMensaje").textContent =
        "Configuración guardada correctamente.";

});

iniciar();