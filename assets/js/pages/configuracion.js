(() => {


console.log("Módulo Configuración iniciado.");



const hostname =
document.getElementById("txtHostname");


const combo =
document.getElementById("cmbAmbiente");


const boton =
document.getElementById("btnGuardarWorkstation");



const mensaje =
document.getElementById("mensajeConfiguracion");





iniciar();





async function iniciar(){


    const nombre =
        await window.electronAPI.getHostname();


    hostname.textContent =
        nombre;



    const ambientes =
        await window.electronAPI.getAmbientes();



    ambientes.forEach(item => {


        combo.innerHTML += `

            <option value="${item.id}">

                ${item.nombre}

            </option>

        `;


    });



}





boton.onclick = async()=>{


    if(!combo.value){


        alert(
            "Seleccione un ambiente."
        );


        return;

    }



    const respuesta =
        await window.electronAPI.saveWorkstation(
            Number(combo.value)
        );



    mensaje.textContent =
        "Equipo configurado correctamente.";


    console.log(
        respuesta
    );


};



})();