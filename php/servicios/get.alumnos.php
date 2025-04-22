<?php
// Mejor gestión de errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Incluir la clase de base de datos
include_once("../classes/class.Database.php");

header('Content-Type: application/json');

// Validación de entrada
if (isset($_GET['id'])) {
    $id = $_GET['id'];

    if (is_numeric($id)) {
        // Preparar consulta para evitar inyección SQL
        $sql = "SELECT * FROM alumnos where id = ?";
        $db = Database::getInstancia();
        $mysqli = $db->getConnection();
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        
        $alumnos = [];
        while ($row = $resultado->fetch_assoc()) {
            $alumnos[] = $row;
        }
    } else {
        $respuesta = [
            'error' => true, 
            'mensaje' => "El parámetro enviado no es válido"
        ];
        echo json_encode($respuesta);
        exit;
    }
} else {
    $sql = "SELECT * FROM alumnos ORDER BY id ASC";
    $alumnos = Database::get_arreglo($sql);
}

$respuesta = [
    'error' => false,
    'alumnos' => $alumnos 
];

echo json_encode($respuesta);
?>