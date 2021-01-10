var firebaseConfig = {
    apiKey: "AIzaSyDR_tiU8lTinMJrw1NpjR8Vz8e1XSF98Q0",
    authDomain: "aplicacioncurso.firebaseapp.com",
    databaseURL: "https://aplicacioncurso.firebaseio.com",
    projectId: "aplicacioncurso",
    storageBucket: "aplicacioncurso.appspot.com",
    messagingSenderId: "423827981630",
    appId: "1:423827981630:web:7248ab8f68f21ea2ba986f"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  ////

const getCurso = (id) => db.collection('registroCurso').doc(id).get();
const BodyCurso = document.querySelector('#BodyCurso');
const Carga = document.querySelector('#contenedorCarga');
//RGISTRAR CURSO
const RegistraCurso = document.querySelector('#RegistraCurso');
const inputs = document.querySelectorAll('#RegistraCurso input');

//Guardamos los registros de los cursos
const GuardaCursos = (nombres,apellidos,cedula,edad,genero,telefono,correo,curso,estado,horaI,horaF) =>
    db.collection('registroCurso').doc().set({
        nombres,
        apellidos,
        cedula,
        edad,
        genero,
        telefono,
        correo,
        curso,
        estado,
        horaI,
        horaF


    }).then(registrado =>{
        Carga.style.visibility = 'hidden';
        Carga.style.opacity = '0';
        swal('Registro exitoso','','success')
    })
//obtenemos al usuario para registrar el curso
auth.onAuthStateChanged( async user =>{
    if(user){
        //Registro
        if(RegistraCurso){

            //Validaciones
            const expresiones ={
                Exnombre: /^[a-zA-ZÀ-ÿ\s]{1,50}$/, // Letras y espacios, pueden llevar acentos.
                Expassword: /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/, // 4 a 12 digitos.
                Excorreo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                Excedula: /^\d{10,10}$/,
                Extelefono: /^\d{9,10}$/
            }
            const campos={
                Vnombre: false,
                Vapellido: false,
                Vcedula: false,
                Vedad: false,
                Vtelefono: false,
            }
            const ValidarInputs = (e) => {
                console.log(e.target.name);
                switch(e.target.name){
                    case 'nombres':
                        
                        validadCampo(expresiones.Exnombre, e.target, 'Vnombre')
                    break;
                    case 'apellidos':
                        validadCampo(expresiones.Exnombre, e.target, 'Vapellido')
                    break;
                    case 'cedula':
                        validadCampo(expresiones.Excedula, e.target, 'Vcedula')
                    break;
                    case 'edad':
                        const error = document.querySelector('#ErrorVedad')
                        if(e.target.value > 0 && e.target.value < 150){
                            console.log('correcto');
                            error.style.visibility = 'hidden';
                            campos['Vedad'] = true;
                        }else{
                            console.log('incorrecto');
                            error.style.visibility = 'visible';
                            campos['Vedad'] = false;
                        }
                    break;
                    case 'telefono':
                        validadCampo(expresiones.Extelefono, e.target, 'Vtelefono')
                    break;
                }
            }
            const validadCampo= (expresion, input, campo)=>{
                const error = document.querySelector(`#Error${campo}`)
                if(expresion.test(input.value)){
                    console.log('correcto');
                    error.style.visibility = 'hidden';
                    campos[campo] = true;
                }else{
                    console.log('incorrecto');
                    error.style.visibility = 'visible';
                    campos[campo] = false;
                }
            }
            ///
            inputs.forEach((input) => {
                input.addEventListener('keyup', ValidarInputs);
            });

            RegistraCurso.addEventListener('submit', async (e) =>{
                e.preventDefault();
                const nombres = RegistraCurso['nombres'];
                const apellidos = RegistraCurso['apellidos'];
                const cedula = RegistraCurso['cedula'];
                const edad = RegistraCurso['edad'];
                const genero = RegistraCurso['genero'];
                const telefono = RegistraCurso['telefono'];
                const estado = 0;
                const curso = RegistraCurso['curso'];
                const horaI = RegistraCurso['horaI'];
                const horaF = RegistraCurso['horaF'];
                if(campos.Vnombre && campos.Vapellido && campos.Vcedula && campos.Vedad && campos.Vtelefono){
                    Carga.style.visibility = 'visible';
                    Carga.style.opacity = '1';
                    await GuardaCursos(
                        nombres.value,
                        apellidos.value,
                        cedula.value,
                        edad.value,
                        genero.value,
                        telefono.value,
                        user.email,
                        curso.value,
                        estado,
                        horaI.value,
                        horaF.value
                    );
                    RegistraCurso.reset();
                    nombres.focus();
                }else{
                    console.log('no correcto');
                }
                
            });
        }else{    
            //Mis cursos
            //// 
            Carga.style.visibility = 'visible';
            Carga.style.opacity = '1';
            console.log(user.email);
            const getssCursos = () =>  db.collection("registroCurso").where("correo", "==", `${user.email}`).where("estado", "<=", 3).get();
            const querySnapshot = await getssCursos();
            if(querySnapshot.docChanges().length >= 1){
                Carga.style.visibility = 'hidden';
                Carga.style.opacity = '0';
                console.log('encontre');
                BodyCurso.innerHTML = '';
                querySnapshot.forEach(doc => {
                    const cursos = doc.data();
                    cursos.id= doc.id;
                    if(doc.data().estado == 0){
                        var estado = 'No revisado'
                        var color = '#292929'
                    }else if (doc.data().estado == 1){
                        var estado = 'Confirmado'
                        var color = '#009944'
                    }else if(doc.data().estado == 2){
                        var estado = 'Negado'
                        var color = '#cf000f'
                    }else if(doc.data().estado == 3){
                        var estado = 'Expulsado'
                        var color = '#474b4e'
                    }
                    BodyCurso.innerHTML += `
                    <tr>
                        <td>${doc.data().nombres}</td>
                        <td>${doc.data().apellidos}</td>
                        <td>${doc.data().edad}</td>
                        <td>${doc.data().genero}</td>
                        <td>${doc.data().telefono}</td>
                        <td>${doc.data().correo}</td>
                        <td style="color:${color};">${estado}</td>
                        <td><button class='btnVer' data-id='${cursos.id}'>Ver</button></td>
                    </tr>`;
                    const btnVer = document.querySelectorAll('.btnVer');
                    btnVer.forEach(btn =>{
                        btn.addEventListener('click', async (e) => {
                            modal.innerHTML = '';
                            const doc = await getCurso(e.target.dataset.id);
                            ventanaModal.classList.add('show');
                            console.log(doc.data());
                            modal.innerHTML += `<div class='Detalle'>
                            <h5>Nombres:</h5><p> ${doc.data().nombres}</p>
                            <h5>Apellidos:</h5><p> ${doc.data().apellidos}</p>
                            <h5>Edad:</h5><p> ${doc.data().edad}</p>
                            <h5>Género:</h5> <p>${doc.data().genero}</p>
                            <h5>Telefono:</h5> <p>${doc.data().telefono}</p>
                            <h5>Correo:</h5> <p>${doc.data().correo}</p>
                            <h5>Curso:</h5> <p class='large1'>${doc.data().curso}</p>
                            <h5 class='fechaHora'>Inicio de horas disponibles:</h5><p> ${doc.data().horaI}</p>
                            <h5 class='fechaHora'>Fin de horas disponibles:</h5><p> ${doc.data().horaF}</p>
                            </div>`;
                        })
                    })
                    cerrarModal.addEventListener('click', () => {
                        ventanaModal.classList.remove('show');
                    })
                });
            }else{
                console.log('no encontre');

            }
        }
        
        /////

    }else{
        console.log('no logiado');
        window.location.href='login.html';
    }

});

//Cerrar sesión
const sesion = document.querySelector('#sesion');
sesion.addEventListener('click',e =>{
    e.preventDefault();
    auth.signOut().then(()=>{
        window.location.href='login.html';
    })
})