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
//LISTAR REGISTROS
const ContenidoConsulta = document.querySelector('#ContenidoConsulta');
const ContenidoAdministrador = document.querySelector('#ContenidoAdministrador');
const BodyRegistros = document.querySelector('#BodyRegistros');
const BodyRegistrosBusqueda = document.querySelector('#BodyRegistrosBusqueda');

const ventanaModal = document.querySelector('#ventanaModal');
const modal = document.querySelector('#modal');
const cerrarModal = document.querySelector('#cerrarModal');

const aprobar = document.querySelector('#aprobar');
const negar = document.querySelector('#negar');

const getCurso = (id) => db.collection('registroCurso').doc(id).get();
const ActualizaCurso = (id, ActualizaCurso) => db.collection('registroCurso').doc(id).update(ActualizaCurso);

const ongetCursosA = (callback) => db.collection('registroCurso').where("estado", "==", 0).onSnapshot(callback);

auth.onAuthStateChanged(user =>{
    if(user){
        console.log('logiado');
    }else{
        console.log('no logiado');
        window.location.href='login.html';
    }
});

//Apartado de consulta
if(ContenidoConsulta){
    console.log('consulta');
    window.addEventListener("DOMContentLoaded", (e) => {
        auth.onAuthStateChanged( async user =>{
            if(user){
                const getDatosCurso = () => db.collection("registroCurso").get();
                const querySnapshot = await getDatosCurso();
                querySnapshot.forEach(doc => {
                    ongetCursosA((querySnapshot)=>{
                        mostrarDatos2(querySnapshot);
                    })
                });
            }else{
                console.log('no login');
            }
        });
    });
}

//Apartado de Administracion de cursos
if(ContenidoAdministrador){
    window.addEventListener("DOMContentLoaded", (e) => {
        auth.onAuthStateChanged( async user =>{
            if(user){
                const getDatosCurso = () => db.collection("registroCurso").get();
                const querySnapshot = await getDatosCurso();
                if(querySnapshot.docChanges().length >= 1){
                    querySnapshot.forEach(doc => {
                        const ongetCursoAdmin = (callback) => db.collection('registroCurso').where("estado", "==", 1).onSnapshot(callback);
                    ongetCursoAdmin((querySnapshot)=>{
                        BodyRegistros.innerHTML = '';
                        querySnapshot.forEach((doc) => {
                            const cursos = doc.data();
                            cursos.id= doc.id;
                            BodyRegistros.innerHTML += `
                                <tr>
                                    <td>${doc.data().cedula}</td>
                                    <td>${doc.data().nombres}</td>
                                    <td>${doc.data().apellidos}</td>
                                    <td>${doc.data().edad}</td>
                                    <td>${doc.data().curso}</td>
                                    <td>${doc.data().telefono}</td>
                                    <td><button class='btnListo' data-id='${cursos.id}'>Expulsar</button></td>
                                </tr>`;
                            const btnListo = document.querySelectorAll('.btnListo');
                            
                            btnListo.forEach(btn =>{
                                btn.addEventListener('click', async (e) => {
                                    console.log('elimina');
                                    const doc = await getCurso(e.target.dataset.id);
                                    await ActualizaCurso(e.target.dataset.id,{
                                        estado: 3
                                    })
                                    
                                })
                            });
                        });
                    })
                    });
                }else{
                    console.log('no curso');
                }
            }else{
                console.log('no login');
            }
        });
            
    }); 
}

//Busquedas
const BusquedaRegistro = document.querySelector('#BusquedaRegistro');
if(BusquedaRegistro){
    BusquedaRegistro.addEventListener('submit', async (e) =>{ 
        e.preventDefault();
        const busquedaPor = BusquedaRegistro['busquedaPor'];
        const Busqueda = BusquedaRegistro['Busqueda'];
        auth.onAuthStateChanged( async user =>{
            if(user){
                const getDatosCurso = () => db.collection("registroCurso").get();
                const querySnapshot = await getDatosCurso();
                if(querySnapshot.docChanges().length >= 1){
                    querySnapshot.forEach(async doc => {
                    if(busquedaPor.value == 'cedula'){
                        var getsscursos = () =>  db.collection("registroCurso").where("cedula", "==", `${Busqueda.value}`).where("estado", "==", 0).get();
                    }else if(busquedaPor.value == 'nombres'){
                        var getsscursos = () =>  db.collection("registroCurso").where("nombres", "==", `${Busqueda.value}`).where("estado", "==", 0).get();
                    }else if(busquedaPor.value == 'apellidos'){
                        var getsscursos = () =>  db.collection("registroCurso").where("apellidos", "==", `${Busqueda.value}`).where("estado", "==", 0).get();
                    }else if(busquedaPor.value == 'curso'){
                        var getsscursos = () =>  db.collection("registroCurso").where("curso", "==", `${Busqueda.value}`).where("estado", "==", 0).get();
                    }
                    const querySnapshot = await getsscursos();
                    mostrarDatos(querySnapshot);
                })
                }else{
                    console.log('no cursosss');
                }
            }else{
                console.log('no login');
            }
        });

    });
}


const BusquedaRegistro2 = document.querySelector('#BusquedaRegistro2');
if(BusquedaRegistro2){
    BusquedaRegistro2.addEventListener('submit', async (e) =>{ 
        e.preventDefault();
        const busquedaPor = BusquedaRegistro2['busquedaPor'];
        const Busqueda = BusquedaRegistro2['Busqueda'];
        auth.onAuthStateChanged( async user =>{
            if(user){
                const getDatosCurso = () => db.collection("registroCurso").get();
                const querySnapshot = await getDatosCurso();
                if(querySnapshot.docChanges().length >= 1){
                    querySnapshot.forEach(async doc => {
                    if(busquedaPor.value == 'cedula'){
                        var getsscursos = () =>  db.collection("registroCurso").where("cedula", "==", `${Busqueda.value}`).where("estado", "==", 1).get();
                    }else if(busquedaPor.value == 'nombres'){
                        var getsscursos = () =>  db.collection("registroCurso").where("nombres", "==", `${Busqueda.value}`).where("estado", "==", 1).get();
                    }else if(busquedaPor.value == 'apellidos'){
                        var getsscursos = () =>  db.collection("registroCurso").where("apellidos", "==", `${Busqueda.value}`).where("estado", "==", 1).get();
                    }else if(busquedaPor.value == 'curso'){
                        var getsscursos = () =>  db.collection("registroCurso").where("curso", "==", `${Busqueda.value}`).where("estado", "==", 1).get();
                    }
                    const querySnapshot = await getsscursos();
                    mostrarDatos(querySnapshot);
                })
                }else{
                    console.log('no cursosss');
                }
            }else{
                console.log('no login');
            }
        });

    });
}

//FILTAR FECHA
const FiltrarFecha = document.querySelector('#FiltrarFecha');
if(FiltrarFecha){
    FiltrarFecha.addEventListener('submit', async (e) =>{ 
        e.preventDefault();
        const desde = FiltrarFecha['desde'];
        const hasta = FiltrarFecha['hasta'];
        console.log(hasta.value);
        auth.onAuthStateChanged( async user =>{
            if(user){
                const getDatosCurso = () => db.collection("registroCurso").get();
                const querySnapshot = await getDatosCurso();
                if(querySnapshot.docChanges().length >= 1){
                    querySnapshot.forEach(async doc => {
                        const getsscursos = () =>  db.collection("registroCurso").where("fecha", ">=", `${desde.value}`).where("fecha", "<=", `${hasta.value}`).where("estado", "==", 0).get();
                        const querySnapshot = await getsscursos();
                        mostrarDatos(querySnapshot);
                    });
                }
            }
        });
        
    });
}   

///Funcion para mostrarDatos los datos encontrados
function mostrarDatos2(querySnapshot){
    BodyRegistros.innerHTML = '';
    querySnapshot.forEach((doc) => {
        const cursos = doc.data();
        cursos.id= doc.id;
        BodyRegistros.innerHTML += `
            <tr>
                <td>${doc.data().cedula}</td>
                <td>${doc.data().nombres}</td>
                <td>${doc.data().apellidos}</td>
                <td>${doc.data().edad}</td>
                <td>${doc.data().curso}</td>
                <td>${doc.data().telefono}</td>
                <td><button class='btnVer' data-id='${cursos.id}'>Detalle</button></td>
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
                <h5>genero:</h5> <p>${doc.data().genero}</p>
                <h5>Telefono:</h5> <p>${doc.data().telefono}</p>
                <h5>Correo:</h5> <p>${doc.data().correo}</p>
                <h5>curso:</h5> <p class='large1'>${doc.data().curso}</p>
                <h5 class='fechaHora'>Inicio de horas disponibles:</h5><p> ${doc.data().horaI}</p>
                <h5 class='fechaHora'>Fin de horas disponibles:</h5><p> ${doc.data().horaF}</p>
                </div>`;
                aprobar.addEventListener('click', async() => {
                    auth.onAuthStateChanged( async user =>{
                            await ActualizaCurso(e.target.dataset.id,{
                                estado: 1
                            })
                    });
                    
                });
                negar.addEventListener('click', async() => {
                    await ActualizaCurso(e.target.dataset.id,{
                        estado: 2
                    })
                });
            })
        });
        cerrarModal.addEventListener('click', () => {
            ventanaModal.classList.remove('show');
        });
    });
}
function mostrarDatos(querySnapshot){
    if(querySnapshot.docChanges().length >= 1){
        console.log('encontre');
        BodyRegistros.innerHTML = '';
        querySnapshot.forEach(doc => {
            const cursos = doc.data();
            cursos.id= doc.id;
            BodyRegistros.innerHTML += `
            <tr>
                <td>${doc.data().cedula}</td>
                <td>${doc.data().nombres}</td>
                <td>${doc.data().apellidos}</td>
                <td>${doc.data().edad}</td>
                <td>${doc.data().curso}</td>
                <td>${doc.data().telefono}</td>
                <td><button class='btnVer' data-id='${cursos.id}'>Detalle</button></td>
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
                    <h5>genero:</h5> <p>${doc.data().genero}</p>
                    <h5>Telefono:</h5> <p>${doc.data().telefono}</p>
                    <h5>Correo:</h5> <p>${doc.data().correo}</p>
                    <h5>Curso:</h5> <p class='large1'>${doc.data().curso}</p>
                    <h5 class='fechaHora'>Inicio de horas disponibles:</h5><p> ${doc.data().horaI}</p>
                    <h5 class='fechaHora'>Fin de horas disponibles:</h5><p> ${doc.data().horaF}</p>     
                    </div>`;
                    aprobar.addEventListener('click', async() => {
                        await ActualizaCurso(e.target.dataset.id,{
                            estado: 1
                        })
                    });
                    negar.addEventListener('click', async() => {
                        await ActualizaCurso(e.target.dataset.id,{
                            estado: 2
                        })
                    });
                })
            })
            cerrarModal.addEventListener('click', () => {
                ventanaModal.classList.remove('show');
            })
        });
    }else{
        console.log('no encontre');
        swal('No se encontraron datos','','error')
    }
}

//Cerrar sesión
const sesion = document.querySelector('#sesion');
sesion.addEventListener('click',e =>{
    e.preventDefault();
    auth.signOut().then(()=>{
        window.location.href='login.html';
    })
})