console.log(
"Módulo Retorno Web iniciado."
);



const lista =
document.getElementById(
"listaSalidas"
);



const mensaje =
document.getElementById(
"mensaje"
);




// ==========================
// CARGAR USUARIO
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

cargarSalidas();





// ==========================
// CARGAR SALIDAS ACTIVAS
// ==========================

async function cargarSalidas(){


try{


const respuesta =
await fetch(

API_URL + "/api/salidas/activas"

);



const salidas =
await respuesta.json();



mostrarSalidas(
salidas
);



}catch(error){


console.error(error);


}


}





// ==========================
// MOSTRAR
// ==========================

function mostrarSalidas(datos){



if(datos.length===0){


lista.innerHTML = `

<h3>
No existen estudiantes fuera del aula.
</h3>

`;

return;


}




lista.innerHTML="";





datos.forEach(s=>{



lista.innerHTML += `


<div class="student-card">


<h3>

${s.apellidos}

${s.nombres}

</h3>



<p>

📚 ${s.grado}

${s.nivel}

-

Sección ${s.seccion}

</p>



<p>

🚻 ${s.motivo}

</p>



<p>

🕒 ${s.hora_salida}

</p>



<button

onclick="registrarRetorno(${s.id})"

>

🔄 Registrar retorno

</button>



</div>


`;



});



}





// ==========================
// REGISTRAR RETORNO
// ==========================

async function registrarRetorno(id){



const respuesta =
await fetch(

API_URL +

"/api/salidas/retorno/" +

id,


{

method:"PUT"

}


);




const resultado =
await respuesta.json();





if(resultado.success){


mensaje.textContent =
"Retorno registrado correctamente.";



cargarSalidas();



}else{


mensaje.textContent =
resultado.message;


}



}





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