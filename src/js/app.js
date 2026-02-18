let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
})

function iniciarApp(){
    // Mostrar la seccion.
    mostrarSeccion();
    // Cambiar la funcion cuando se presionen los tabs.
    tabs();
    // Agrega o quita los botones del paginador.
    botonesPaginador();

    paginaAnterior();
    paginaSiguiente();

    // Consultar la API en el backend de PHP.
    consultarAPI();

    IdCliente();

    // Añadir el nombre del cliente al objeto de la cita.
    nombreCliente();

    // Añadir la fecha al objeto de la cita.
    seleccionarFecha();

    // Añadir la hora al objeto de la cita.
    seleccionarHora();

    // Mostrar resumen de cita.
    mostrarResumen();
}

function mostrarSeccion(){
    // Ocultar la seccion que tenga la clase de mostrar.
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar');
        seccionAnterior.classList.add('ocultar');
    }
    // Seleccionar la seccion con el paso.
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.remove('ocultar');
    seccion.classList.add('mostrar');
    
    // Ocultar el tab anterior.
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }
    // Resaltar el tab actual.
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs(){
    let botones = document.querySelectorAll('.tabs button');
    botones.forEach( boton => {
        boton.addEventListener('click', function(e){
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();
        })
    })
}

function botonesPaginador(){
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if(paso === 2){
        paginaAnterior.classList.remove('ocultar');
    }else if(paso === 3){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    };
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function(){
        if(paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
        mostrarSeccion();
    })
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function(){
        if(paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
        mostrarSeccion();
    })
}

async function consultarAPI(){
    try {
        const url = '/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);
    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios){
    servicios.forEach(servicio => {
        const {id, nombre, precio} = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function(){
            seleccionarServicio(servicio);
        };

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);

    })
}

function seleccionarServicio(servicio){
    const {id} = servicio;
    const {servicios} = cita;

    // Identificar elemento clickeado.
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);
    // Comprobar si un servicio ya fue agregado.
    if(servicios.some(agregado => agregado.id === id)){
        // Eliminarlo.
        cita.servicios = servicios.filter(agregado => agregado.id !== id);
        divServicio.classList.remove('seleccionado');
    } else {
        // Agregarlo.
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
}

function IdCliente(){
    cita.id = document.querySelector('#id').value;

}

function nombreCliente(){
    cita.nombre = document.querySelector('#nombre').value;

}

function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e){
        const dia = new Date(e.target.value).getUTCDay();
        if([6, 0].includes(dia)){
            e.target.value = '';
            mostrarAlerta('No laboramos en fines de semana.', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value;
        }
    })
}

function seleccionarHora(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e){
        const horaCita = e.target.value;
        const horaMinuto = horaCita.split(':');
        const hora = parseInt(horaMinuto[0])
        if(hora > 22 || hora < 8){
            e.target.value = '';
            mostrarAlerta('No laboramos después de las 22 y antes de las 8.', 'error', '.formulario');
        } else {
            cita.hora = horaCita;
        }
    })
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true){
    // Prevenir generacion de multiples alertas.
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        alertaPrevia.remove();
    };

    // Scripting creacion de alerta.
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta', 'margin-top');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece){
        // Eliminar alerta.
        setTimeout(() => {
            alerta.classList.add('desvanecer');
        }, 3000);
        setTimeout(() => {
            alerta.remove();
        }, 4500);
    }
}
  
function mostrarResumen(){
    const resumen = document.querySelector('.contenido-resumen');
    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    };
    if(Object.values(cita).includes('') || cita.servicios.length === 0){
        mostrarAlerta('Hacen falta datos de servicios, hora o fecha.', 'error', '.contenido-resumen', false);
        return;
    }

    // Formatear el div de resumen.
    // Heading para datos del cliente.

    const headingCliente = document.createElement('H3');
    headingCliente.textContent = 'Datos del Cliente';
    resumen.appendChild(headingCliente);

    const {nombre, fecha, hora, servicios} = cita;

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre: </span>${nombre}`;

    // Formatear la fecha en español.
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia))

    const opciones = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
    const fechaFormaterada = fechaUTC.toLocaleDateString('es-ES', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: </span>${fechaFormaterada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora: </span>${hora}`;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    // Heading para servicios.
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);


    // Iterando y mostrando los servicios.
    servicios.forEach(servicio => {
        const {id, nombre, precio} = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio: </span>$${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    })

    // Boton para crear la cita.
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(botonReservar);
}

async function reservarCita(){
    const {nombre, fecha, hora, servicios, id} = cita;

    const idServicio = servicios.map(servicio => servicio.id);
    const datos = new FormData();
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicio);
    try {
        // Peticion hacia la API.
        const url =  '/api/citas';
        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });
        const resultado = await respuesta.json();
        if(resultado.resultado){
            Swal.fire({
            icon: "success",
            title: "Cita agendada correctamente!",
            }).then(() => {
                window.location.reload();
            });
        }
    } catch (error) {
        console.log(error);
        Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al agendar tu cita.",
        });
    }
}