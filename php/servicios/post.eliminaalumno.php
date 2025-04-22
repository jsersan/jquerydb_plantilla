<?php
// Mejor gestión de errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Incluir la clase de base de datos
include_once("../classes/class.Database.php");

header('Content-Type: application/json');

// Validar entrada
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if (!$id) {
    echo json_encode([
        'err' => true,
        'mensaje' => "ID no válido"
    ]);
    exit;
}

// Usar consultas preparadas para evitar inyección SQL
$db = Database::getInstancia();
$mysqli = $db->getConnection();
$sql = "DELETE FROM alumnos WHERE id = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $id);
$hecho = $stmt->execute();

if ($hecho) {
    $respuesta = [
        'err' => false,
        'mensaje' => "Eliminado correctamente"
    ];
} else {
    $respuesta = [
        'err' => true,
        'mensaje' => $mysqli->error
    ];
}

echo json_encode($respuesta);
?>