# JQuery DB Plantilla

## Descripción
JQuery DB Plantilla es un proyecto que proporciona una estructura base para desarrollar aplicaciones web con jQuery que interactúan con bases de datos. Esta plantilla facilita la conexión, manipulación y visualización de datos en aplicaciones web cliente-servidor.

## Características
- Implementación de CRUD (Crear, Leer, Actualizar, Eliminar) con jQuery
- Estructura modular para facilitar el mantenimiento
- Conexión simplificada a bases de datos
- Plantillas de formularios reutilizables
- Validación de datos en el cliente
- Interfaz responsiva

## Requisitos previos
- Servidor web (Apache, Nginx, etc.)
- PHP 7.0 o superior
- MySQL o MariaDB
- Conocimientos básicos de HTML, CSS, JavaScript y jQuery

## Instalación
1. Clona este repositorio en tu servidor web:
   ```
   git clone https://github.com/jsersan/jquerydb_plantilla.git
   ```
2. Configura los parámetros de conexión a la base de datos en `config/db_config.php`
3. Importa la estructura base de datos desde `database/schema.sql`
4. Accede al proyecto desde tu navegador

## Estructura del proyecto
```
jquerydb_plantilla/
│
├── assets/
│   ├── css/           # Hojas de estilo
│   ├── js/            # Scripts de jQuery y JavaScript
│   └── img/           # Imágenes del proyecto
│
├── config/            # Configuración de la base de datos
│
├── database/          # Scripts SQL y migraciones
│
├── includes/          # Componentes PHP reutilizables
│
├── lib/               # Bibliotecas de terceros
│
├── modules/           # Módulos funcionales de la aplicación
│
├── templates/         # Plantillas HTML
│
├── .gitignore
├── index.php          # Punto de entrada de la aplicación
└── README.md
```

## Uso
1. La página principal muestra un listado de registros desde la base de datos
2. Utiliza el formulario de creación para añadir nuevos registros
3. Cada registro tiene opciones para editar y eliminar
4. La búsqueda permite filtrar registros por diferentes criterios

## Personalización
Puedes personalizar esta plantilla modificando:
- Los estilos en `assets/css/style.css`
- La configuración de la conexión en `config/db_config.php`
- Las plantillas de visualización en `templates/`
- Los módulos funcionales en `modules/`

## Ejemplos de código

### Conexión a la base de datos (PHP)
```php
<?php
require_once 'config/db_config.php';

function connectDB() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    
    if ($conn->connect_error) {
        die("Error de conexión: " . $conn->connect_error);
    }
    
    return $conn;
}
?>
```

### Petición AJAX con jQuery
```javascript
$("#create-form").on("submit", function(e) {
    e.preventDefault();
    
    $.ajax({
        url: "modules/create.php",
        type: "POST",
        data: $(this).serialize(),
        success: function(response) {
            if (response.status === "success") {
                showNotification("Registro creado correctamente");
                loadData();
            } else {
                showError(response.message);
            }
        },
        error: function() {
            showError("Error al procesar la solicitud");
        }
    });
});
```

## Contribuir
1. Haz un fork del proyecto
2. Crea una rama para tu función (`git checkout -b feature/nueva-funcion`)
3. Haz commit de tus cambios (`git commit -m 'Añade nueva función'`)
4. Haz push a la rama (`git push origin feature/nueva-funcion`)
5. Abre un Pull Request

## Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## Autor
- [@jsersan](https://github.com/jsersan)

## Agradecimientos
- Bibliotecas utilizadas: jQuery, Bootstrap, etc.
- Inspiración y recursos de la comunidad
