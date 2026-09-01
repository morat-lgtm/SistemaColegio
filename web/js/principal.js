const usuario =
JSON.parse(
    localStorage.getItem("usuario")
);



if(!usuario){

    window.location.href =
    "index.html";

}




document.getElementById(
"nombreUsuario"
)
.textContent =
"Bienvenido " + usuario.nombres;





// Registrar salida

document.getElementById(
"btnSalida"
)
.onclick = ()=>{


window.location.href =
"salidas.html";


};




// Registrar retorno

document.getElementById(
"btnRetorno"
)
.onclick = ()=>{


window.location.href =
"retorno.html";


};




// Historial

document.getElementById(
"btnHistorial"
)
.onclick = ()=>{


window.location.href =
"historial.html";


};




// Cerrar sesión

document.getElementById(
"btnCerrarSesion"
)
.onclick = ()=>{


localStorage.removeItem(
"usuario"
);



window.location.href =
"index.html";


};