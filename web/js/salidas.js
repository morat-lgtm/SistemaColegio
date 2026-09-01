console.log("Módulo Salidas Web iniciado.");



let estudiantes = [];

let estudianteSeleccionado = null;



const buscar =
document.getElementById(
    "buscarEstudiante"
);



const resultado =
document.getElementById(
    "resultadoEstudiante"
);



const motivo =
document.getElementById(
    "motivo"
);



const observacion =
document.getElementById(
    "observacion"
);



const mensaje =
document.getElementById(
    "mensaje"
);





// ==========================
// INICIO
// ==========================

mostrarUsuario();

cargarEstudiantes();

cargarMotivos();





// ==========================
// MOSTRAR USUARIO
// ==========================

function mostrarUsuario(){


const usuario =
JSON.parse(
    localStorage.getItem("usuario")
);



if(usuario){


document.getElementById(
"usuarioActual"
)
.textContent =
"Usuario: " + usuario.nombres;


}


}







// ==========================
// CARGAR ESTUDIANTES
// ==========================

async function cargarEstudiantes(){


try{


const respuesta =
await fetch(

API_URL + "/api/students"

);



estudiantes =
await respuesta.json();



console.log(
"Estudiantes:",
estudiantes
);



}catch(error){


console.error(
"Error cargando estudiantes:",
error
);


}


}







// ==========================
// CARGAR MOTIVOS
// ==========================

async function cargarMotivos(){


try{


const respuesta =
await fetch(

API_URL + "/api/motivos-salida"

);



const motivos =
await respuesta.json();




motivo.innerHTML = `

<option value="">
Seleccione motivo
</option>

`;





motivos.forEach(m=>{


motivo.innerHTML += `

<option value="${m.id}">
${m.nombre}
</option>

`;


});





}catch(error){


console.error(
"Error cargando motivos:",
error
);


}


}







// ==========================
// BUSCAR ESTUDIANTE
// ==========================

buscar.oninput = ()=>{


const texto =
buscar.value
.toLowerCase()
.trim();



estudianteSeleccionado = null;


resultado.innerHTML = "";



if(texto===""){

return;

}





const encontrado =
estudiantes.find(e=>{


return (

`${e.apellidos} ${e.nombres}`

.toLowerCase()

.includes(texto)

);


});





if(encontrado){



estudianteSeleccionado =
encontrado;



resultado.innerHTML = `


<div class="student-card">


<h3>

${encontrado.apellidos}

${encontrado.nombres}

</h3>



<p>

📚 ${encontrado.grado}

${encontrado.nivel}

-

Sección ${encontrado.seccion}

</p>


</div>


`;



}


};









// ==========================
// REGISTRAR SALIDA
// ==========================

document.getElementById(
"btnRegistrarSalida"
)
.onclick = async()=>{


if(!estudianteSeleccionado){


mensaje.textContent =
"Seleccione un estudiante.";


return;


}



if(!motivo.value){


mensaje.textContent =
"Seleccione un motivo.";


return;


}





const usuario =
JSON.parse(
localStorage.getItem("usuario")
);





const salida = {


estudiante_id:
estudianteSeleccionado.id,



motivo_id:
Number(
motivo.value
),



usuario_id:
usuario.id,



workstation_id:
1,



observacion:
observacion.value



};







try{


const respuesta =
await fetch(

API_URL + "/api/salidas",

{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify(
salida
)


}

);





const resultadoServidor =
await respuesta.json();





console.log(
resultadoServidor
);





if(resultadoServidor.success){



mensaje.textContent =
"Salida registrada correctamente.";



buscar.value="";

observacion.value="";

motivo.value="";

resultado.innerHTML="";

estudianteSeleccionado=null;



}else{


mensaje.textContent =
resultadoServidor.message;


}



}catch(error){


console.error(error);



mensaje.textContent =
"Error registrando salida.";


}


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