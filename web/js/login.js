const boton =
document.getElementById("btnIngresar");



boton.onclick = async()=>{



const usuario =
document.getElementById("usuario").value;



const password =
document.getElementById("password").value;





const respuesta =
await fetch(


API_URL + "/api/auth/login",


{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({


usuario,


password


})


}


);






const resultado =
await respuesta.json();







if(resultado.success){



// Guardar usuario conectado

localStorage.setItem(

    "usuario",

    JSON.stringify(
        resultado.user
    )

);





// Ir al menú principal

window.location.href =
"principal.html";





}else{



document.getElementById("mensaje")
.textContent =
resultado.message;



}



};