<h1 class="nombre-pagina">Panel de Administracion</h1>

<?php include __DIR__ . '/../templates/barra.php'; ?>

<div class="busqueda">
    <form class="formulario">
        <div class="campo">
            <label for="fecha">Fecha</label>
            <input type="date" id="fecha" name="fecha" value="<?php echo $fecha; ?>">
        </div>
    </form>
</div>

<?php if(count($citas) === 0){ ?>
    <h2>No hay citas agendadas para este dia.</h2>
<?php } ?>

<div id="citas-admin">
    <ul class="citas">
        <?php 
            foreach($citas as $key => $cita){
                if($idCita !== $cita->id){
                    $idCita = $cita->id;
                    $total = 0;
        ?>
                    <li>
                        <p>Id: <span><?php echo $cita->id; ?></span></p>
                        <p>Hora: <span><?php echo $cita->hora; ?></span></p>
                        <p>Cliente: <span><?php echo $cita->cliente; ?></span></p>
                        <p>Email: <span><?php echo $cita->email; ?></span></p>
                        <p>Telefono: <span><?php echo $cita->telefono; ?></span></p>
                        <h3>SERVICIOS</h3>
                <?php 
                    } // Fin IF 
                    $total += $cita->precio;
                ?> 
                        <p class="servicio"><span><?php echo $cita->servicio .  ': $' . $cita->precio; ?></span></p>
                <?php 
                    $actual = $cita->id;
                    $proximo = $citas[$key + 1]->id ?? 0;

                    if(esUltimo($actual, $proximo)){
                ?>
                    <p class="total">Total a pagar: <span>$<?php echo $total; ?></span></p>
                    <form action="/api/eliminar" method="POST">
                        <input type="hidden" name="id" value="<?php echo $cita->id; ?>">
                        <input type="submit" class="boton-eliminar" value="Eliminar">
                    </form>
                <?php
                    }
            } // Fin ForEach
        ?>
    </ul>
</div>

<?php 
    $script = "<script src='build/js/buscador.js'></script>"
?>