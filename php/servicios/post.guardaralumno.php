<?php
// Mejor gestión de errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Incluir la clase de base de datos
include_once("../classes/class.Database.php");

header('Content-Type: application/json');

// Validar y sanitizar entrada
$id = filter_input(INPUT_POST, 'txtid', FILTER_VALIDATE_INT);
$nombre = filter_input(INPUT_POST, 'txtnombre', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$estado = filter_input(INPUT_POST, 'cmbestado', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

if (!$id) {
    echo json_encode([
        'err' => true,
        'mensaje' => "ID no válido"
    ]);
    exit;
}

if (empty($nombre)) {
    echo json_encode([
        'err' => true,
        'mensaje' => "El nombre no puede estar vacío"
    ]);
    exit;
}

// Usar consultas preparadas para evitar inyección SQL
$db = Database::getInstancia();
$mysqli = $db->getConnection();
$sql = "UPDATE alumnos SET nombre = ?, estado = ? WHERE id = ?";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("ssi", $nombre, $estado, $id);
$hecho = $stmt->execute();

if ($hecho) {
    $respuesta = [
        'err' => false,
        'mensaje' => "Actualizado correctamente"
    ];
} else {
    $respuesta = [
        'err' => true,
        'mensaje' => $mysqli->error
    ];
}

echo json_encode($respuesta);
?>