console.log(
    "Módulo Historial Web iniciado."
);



let registros = [];



const lista =
document.getElementById(
    "listaHistorial"
);



const buscar =
document.getElementById(
    "buscarHistorial"
);




// ==========================
// USUARIO
// ==========================

const usuario =
JSON.parse(
    localStorage.getItem("usuario")
);



if(!usuario){


    window.location.href =
    "index.html";


}




document.getElementById(
    "usuarioActual"
)
.textContent =
"Usuario: " + usuario.nombres;






// ==========================
// INICIO
// ==========================

cargarHistorial();







// ==========================
// CARGAR HISTORIAL
// ==========================

async function cargarHistorial(){


try{


const respuesta =
await fetch(

    API_URL + "/api/salidas/historial"

);



registros =
await respuesta.json();





mostrarHistorial(
    registros
);





}catch(error){


console.error(
    "Error historial:",
    error
);



lista.innerHTML = `

<div class="historial-vacio">

<h3>
Error cargando historial
</h3>

</div>

`;



}


}







// ==========================
// MOSTRAR HISTORIAL
// ==========================

function mostrarHistorial(datos){



if(datos.length===0){


lista.innerHTML = `

<div class="historial-vacio">

<h3>
No existen registros.
</h3>

</div>

`;

return;


}





lista.innerHTML = "";





datos.forEach(s=>{


let claseEstado;

let textoEstado;





if(
    s.estado === "ACTIVA"
){


    claseEstado =
    "estado-activa";


    textoEstado =
    "🔴 Fuera del aula";


}else{


    claseEstado =
    "estado-retornado";


    textoEstado =
    "🟢 Retornó al aula";


}






lista.innerHTML += `



<div class="historial-card ${claseEstado}">



<h3>

${s.apellidos}

${s.nombres}

</h3>





<p>

📚

${s.grado}

${s.nivel}

-

Sección ${s.seccion}

</p>





<p>

🚻 Motivo:

${s.motivo}

</p>





<p>

👤 Registrado por:

${s.usuario}

</p>





<div class="estado">

${textoEstado}

</div>





<small>


🕒 Salida:

${s.hora_salida}



<br>



🔄 Retorno:

${s.hora_regreso ?? "Pendiente"}



</small>




</div>



`;



});



}








// ==========================
// BUSCAR
// ==========================

buscar.oninput = ()=>{


const texto =
buscar.value
.toLowerCase()
.trim();





const filtrados =
registros.filter(s=>{


return (

`${s.apellidos} ${s.nombres}`

.toLowerCase()

.includes(texto)

);


});





mostrarHistorial(
    filtrados
);



};







// ==========================
// VOLVER
// ==========================

document.getElementById(
    "btnVolver"
)
.onclick = ()=>{


window.location.href =
"principal.html";


};