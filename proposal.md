# TP-DSW-2025-3k03-Messina-Costantini-Enrico

## Grupo
### Integrantes
* 53112 - Costantini, Jeremías
* 53004 - Enrico, Mateo
* 52911 - Messina, Tiziano Leonel

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)

## Tema
### Descripción
*El sistema tiene como objetivo conectar a productores agropecuarios con contratistas que ofrecen servicios rurales como siembra, cosecha, fumigación, entre otros trabajos vinculados al campo. Los usuarios podrán registrarse en la plataforma bajo el rol de Productor o Contratista, accediendo a funcionalidades específicas según su perfil. La aplicación permitirá la publicación de servicios por parte de los contratistas, y la búsqueda y contratación de servicios por parte de los productores, priorizando la proximidad geográfica y el tipo de tarea requerida.*

### Modelo
![DER del proyecto](https://drive.google.com/file/d/151WW7jMJsbHZqQe7cZ24ymqqbFD3XNOm/view?usp=sharing)


## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Categoria Servicio<br>2. CRUD Localidad<br>3. CRUD Usuario|
|CRUD dependiente|1. CRUD Servicio {depende de} CRUD Categoria Servicio<br>2. CRUD Solicitud {depende de} CRUD Servicio, Cliente, Prestamista<br>3. CRUD Campo {depende de} CRUD Cliente|
|Listado<br>+<br>detalle| 1. Listado de servicios filtrado por categoria de servicio, muestra idServicio, nombreServicio, prestamista => detalle CRUD Servicios<br> 2. Listado de prestamistas filtrado por aproximacion geográfica, muestra idPrestamista, domicilioPrestamista, nombre categoria servicio y precio => detalle muestra prestamistas con domicilio cercano al domicilio cliente<br> 3. Listado de campos del cliente muestra idCampo, coordenas y cantHectareas => detalle CRUD Campo<br> 4. Listado de solicitudes(historial) muestra idSolicitud, idCampo, categoria servicio, servicio, prestamista, estado, fecha inicio, fecha fin, cantidadHoras(d), insumos, cantidadInsumos, preciototal(d) => detalle muestra datos completo de las solicitudes|
|CUU/Epic|1. Publicar un servicio<br>2. Solicitar un servicio publicado|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Categoria Servicio<br>2. CRUD Servicio<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Solicitud<br>6. CRUD Prestamista<br>7. CRUD Cliente<br>8. CRUD Campo|
|CUU/Epic|1. Publicar un servicio<br>2. Solicitar un servicio publicado<br>3. Cambiar estado de solicitud (pendiente, aceptada, rechazada, completada)|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|CUU/Epic|1. Valoracion servicio<br>2. Cancelación de servicio|
|Otros|1. Envío de actualizacion de estado de solicitud por email|
