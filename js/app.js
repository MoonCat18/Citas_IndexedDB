let DB;

// Creación de variables
    // Seleccionando los inputs - Campus del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// Interfaz del usuario
    // Contenedor para las citas
const contenedorCitas = document.querySelector('#citas');

    // Formulario nuevas citas
const formulario = document.querySelector('#nueva-cita')

// Para el modo de edición
let editando = false;

// Base de Datos
document.addEventListener('DOMContentLoaded', () => {
    eventListeners();
    crearDB();
}); 

// Registrar los eventos
// Leer lo que el usuario escribe en cada uno de los inputs
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    // Formulario de la cita
    formulario.addEventListener('submit', nuevaCita);
}

// Objeto con la información de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora:'',
    sintomas: ''
}

// Para leer lo que el usuario está escribiendo
function datosCita(e) {
    //  Agrega datos al objeto de la cita
     citaObj[e.target.name] = e.target.value;
}

// CLasses
class Citas{
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }

    // .filter recorre el arreglo y me crea uno nuevo
    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }

    // .filter quita un elemento de acuerdo a una condición
    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id !== id);
    }
}

class UI {

    // Alerta de mensajes
    imprimirAlerta(mensaje, tipo) {

        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        
        // Agregar clase en base al tipo de error
        // Si es de tipo error agrega una clase
        if(tipo === 'error') {
             divMensaje.classList.add('alert-danger');
             console.log('Error');
        } else {
             divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector('#contenido').insertBefore( divMensaje , document.querySelector('.agregar-cita'));

        // Quitar el alert despues de 2 segundos
        setTimeout( () => {
            divMensaje.remove();
        }, 2000);
    }

    // Mostrar las citas
    imprimirCitas() {

        this.limpiarHTML();
 
        // Leer el contenido de la bd
        const objectStore = DB.transaction('citas').objectStore('citas');

        const total = objectStore.count()
            total.onsuccess = function () {
            console.log(total.result);
        }
        
        objectStore.openCursor().onsuccess = function (e) {
            
            const cursor = e.target.result;
            
            if (cursor) {
                const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cursor.value;
        
                const divCita = document.createElement('div');
                divCita.classList.add('cita', 'p-3');
                divCita.dataset.id = id;
        
                // scRIPTING DE LOS ELEMENTOS...
                const mascotaParrafo = document.createElement('h2');
                mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
                mascotaParrafo.innerHTML = `${mascota}`;
        
                const propietarioParrafo = document.createElement('p');
                propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`;
        
                const telefonoParrafo = document.createElement('p');
                telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Teléfono: </span> ${telefono}`;
        
                const fechaParrafo = document.createElement('p');
                fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;
        
                const horaParrafo = document.createElement('p');
                horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;
        
                const sintomasParrafo = document.createElement('p');
                sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Síntomas: </span> ${sintomas}`;
        
                // Agregar un botón de eliminar...
                const btnEliminar = document.createElement('button');
                btnEliminar.onclick = () => eliminarCita(id); // añade la opción de eliminar
                btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
                btnEliminar.innerHTML = 'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
        
                // Añade un botón de editar...
                const btnEditar = document.createElement('button');
                const cita = cursor.value;
                btnEditar.onclick = () => cargarEdicion(cita);
        
                btnEditar.classList.add('btn', 'btn-info')
                btnEditar.innerHTML = 'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
        
                // Agregar al HTML
                divCita.appendChild(mascotaParrafo);
                divCita.appendChild(propietarioParrafo);
                divCita.appendChild(telefonoParrafo);
                divCita.appendChild(fechaParrafo);
                divCita.appendChild(horaParrafo);
                divCita.appendChild(sintomasParrafo);
                divCita.appendChild(btnEliminar);
                divCita.appendChild(btnEditar);
        
                contenedorCitas.appendChild(divCita);
        
                // Va al siguiente elemento
                cursor.continue();
            }
        }
    }

   // Evitar duplicados de las citas
   limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
   }
}

// Instancias de las clases
const ui = new UI();
const administrarCitas = new Citas();

// Valida y agrega una nueva cita a la lase de citas
function nuevaCita(e) {
    // Se agrega cuando trabajamos con submit
    e.preventDefault();

    // Extraer la información del objeto de cita
    const {mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validar los campos
    if( mascota === '' || propietario === '' || telefono === '' || fecha === ''  || hora === '' || sintomas === '' ) {
        ui.imprimirAlerta('Todos los campos son Obligatorios', 'error');

        return;
    }

    if(editando) {
        // Estamos editando - Modo Edición

        // Pasar el objeto de la cita a edición
        administrarCitas.editarCita( {...citaObj} );

        // Edita en IndexDB
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');

        // Ya tenemos objeto actualizado
        objectStore.put(citaObj);

        transaction.oncomplete = () => {

            console.log('Cita Editada');

            // Mostrar mensaje
            ui.imprimirAlerta('Guardado Correctamente');

            // Regresamos el texto original
            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

            // Quitar modo edición
            editando = false;
        }

        transaction.onerror = function () {
            console.log('Hubo un error en la transacción');
        }

    } else {
        // Nuevo Registro - Modo Nueva Cita

        // Generar un ID único
        citaObj.id = Date.now();

        // Añade la nueva cita
        administrarCitas.agregarCita({...citaObj});
        
        // Insertar registro en IndexedDB
        const transaction = DB.transaction(['citas'], 'readwrite');

        // Habilitar el objectStore
        const objectStore = transaction.objectStore('citas');

        // Agregar a la base de datos
        objectStore.add(citaObj);

        transaction.oncomplete = function () {
            console.log('Cita Agregada');

            // Mostrar mensaje de que todo esta bien...
            ui.imprimirAlerta('Se agregó correctamente');
        }

        transaction.onerror = function () {
            console.log('Hubo un error en la transacción');
        }
    }

    // Mostrar el HTML de citas
    ui.imprimirCitas();

    // Reinicia el objeto para evitar futuros problemas de validación
    reiniciarObjeto();

    // Reiniciar Formulario
    formulario.reset();

}

// Para borrar los valores del objeto
function reiniciarObjeto() {
    // Reiniciar el objeto
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

// Eliminar una cita
function eliminarCita(id) {

    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');

    objectStore.delete(id);

    transaction.oncomplete = () => {
        console.log('Cita Eliminada');

        // Muestre el mensaje
        ui.imprimirAlerta('La cita se eliminó correctamente');

        // Refrescar las citas
        ui.imprimirCitas();
    }

    transaction.onerror = function () {
        console.log('Hubo un error en la transacción');
    }
}

// Carga los datos y el modo edición
function cargarEdicion(cita) {

    const {mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Llenar los Inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

     // Reiniciar el objeto - Llenar el objeto
     citaObj.mascota = mascota;
     citaObj.propietario = propietario;
     citaObj.telefono = telefono;
     citaObj.fecha = fecha;
     citaObj.hora = hora;
     citaObj.sintomas = sintomas;
     citaObj.id = id;

    // Cambiar el texto del botón
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    // Cambiar el modo edición
    editando = true;
}

function crearDB() {
    // Crear la base de Datos en version 1.0
    const crearDB = window.indexedDB.open('citas', 1);

    // Si hay un error
    crearDB.onerror = function() {
        console.log('Hubo un error a la hora de crear la base de datos');
}

    // Si se creó bien
    crearDB.onsuccess = function() {
        console.log('Base de datos creada...');

        DB = crearDB.result;

        // Mostrar citas al cargar (Pero IndexeDB ya está listo )
        ui.imprimirCitas();
    }

    // Definir el esquema (schema)
    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore('citas', {
            keyPath: 'id',
            autoIncrement: true
        });

        // Definir todas las columnas
        objectStore.createIndex('mascota', 'mascota', {unique: false});
        objectStore.createIndex('propietario', 'propietario', {unique: false});
        objectStore.createIndex('telefono', 'telefono', {unique: false});
        objectStore.createIndex('fecha', 'fecha', {unique: false});
        objectStore.createIndex('hora', 'hora', {unique: false});
        objectStore.createIndex('sintomas', 'sintomas', {unique: false});
        objectStore.createIndex('id', 'id', {unique: true});

        console.log('Base de datos creada y lista');
    }
}