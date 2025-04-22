<?php
// ======================================================
// Clase: class.Database.php
// Funcion: Se encarga del manejo con la base de datos
// Descripcion: Tiene varias funciones muy útiles para
// 				el manejo de registros.
// Ultima Modificación: Migrado a PHP 8.2.0
// ======================================================

class Database {
    private $_connection;

    private $_host = "localhost:8889";
    private $_user = "root";
    private $_pass = "root";
    private $_db   = "ajaxdb";
    

    // Almacenar una unica instancia
    private static $_instancia;

    // ================================================
    // Metodo para obtener instancia de base de datos
    // ================================================
    public static function getInstancia(): self {
        if (!isset(self::$_instancia)) {
            self::$_instancia = new self;
        }
        return self::$_instancia;
    }

    // ================================================
    // Constructor de la clase Base de datos
    // ================================================
    public function __construct() {
        $this->_connection = new mysqli($this->_host, $this->_user, $this->_pass, $this->_db);

        // Manejar error en base de datos
        if (mysqli_connect_error()) {
            trigger_error('Falla en la conexion de base de datos'. mysqli_connect_error(), E_USER_ERROR);
        }
    }

    // Metodo vacio __close para evitar duplicacion
    private function __clone() {}

    // Metodo para obtener la conexion a la base de datos
    public function getConnection(): mysqli {
        $this->_connection->set_charset("utf8");
        return $this->_connection;
    }

    // Metodo que revisa el String SQL
    private static function es_string($sql): bool {
        if (!is_string($sql)) {
            trigger_error('class.Database.inc: $SQL enviado no es un string: ' . $sql);
            return false;
        }
        return true;
    }

    // ==================================================
    // 	Funcion que ejecuta el SQL y retorna un ROW
    // ==================================================
    public static function get_Row($sql): array {
        if (!self::es_string($sql))
            exit();

        $db = self::getInstancia();
        $mysqli = $db->getConnection();
        $resultado = $mysqli->query($sql);

        if ($resultado && $row = $resultado->fetch_assoc()) {
            return $row;
        } else {
            return [];
        }
    }

    // ==================================================
    // 	Funcion que ejecuta el SQL y retorna un CURSOR
    // ==================================================
    public static function get_Cursor($sql) {
        if (!self::es_string($sql))
            exit();

        $db = self::getInstancia();
        $mysqli = $db->getConnection();

        return $mysqli->query($sql);
    }

    // ==================================================
    // 	Funcion que ejecuta el SQL y retorna un jSon
    // ==================================================
    public static function get_json_rows($sql): string {
        if (!self::es_string($sql))
            exit();

        $db = self::getInstancia();
        $mysqli = $db->getConnection();
        $resultado = $mysqli->query($sql);

        // Si hay un error en el SQL, este es el error de MySQL
        if (!$resultado) {
            return "class.Database.class: error ". $mysqli->error;
        }

        $registros = [];
        while ($row = $resultado->fetch_assoc()) {
            $registros[] = $row;
        }
        
        return json_encode($registros);
    }

    // ==================================================
    // 	Funcion que ejecuta el SQL y retorna un Arreglo
    // ==================================================
    public static function get_arreglo($sql): array {
        if (!self::es_string($sql))
            exit();

        $db = self::getInstancia();
        $mysqli = $db->getConnection();
        $resultado = $mysqli->query($sql);

        // Si hay un error en el SQL, este es el error de MySQL
        if (!$resultado) {
            return ["error" => "class.Database.class: error ". $mysqli->error];
        }

        $registros = [];
        while ($row = $resultado->fetch_assoc()) {
            $registros[] = $row;
        }
        
        return $registros;
    }

    // ==================================================
    // 	Funcion que ejecuta el SQL y retorna un jSon de una sola linea
    // ==================================================
    public static function get_json_row($sql): string {
        if (!self::es_string($sql))
            exit();

        $db = self::getInstancia();
        $mysqli = $db->getConnection();
        $resultado = $mysqli->query($sql);

        // Si hay un error en el SQL, este es el error de MySQL
        if (!$resultado) {
            return "class.Database.class: error ". $mysqli->error;
        }

        if (!$row = $resultado->fetch_assoc()) {
            return "{}";
        }
        
        return json_encode($row);
    }

    // ====================================================================
    // 	Funcion que ejecuta el SQL y retorna un valor
    // ====================================================================
    public static function get_valor_query($sql, $columna) {
        if (!self::es_string($sql))
            exit();

        $db = self::getInstancia();
        $mysqli = $db->getConnection();
        $resultado = $mysqli->query($sql);

        // Si hay un error en el SQL, este es el error de MySQL
        if (!$resultado) {
            return "class.Database.class: error ". $mysqli->error;
        }

        $valor = null;
        if ($row = $resultado->fetch_assoc()) {
            $valor = $row[$columna] ?? null;
        }

        return $valor;
    }

    // ====================================================================
    // 	Funcion que ejecuta el SQL de inserción, actualización y eliminación
    // ====================================================================
    public static function ejecutar_idu($sql) {
        if (!self::es_string($sql))
            exit();

        $db = self::getInstancia();
        $mysqli = $db->getConnection();

        $resultado = $mysqli->query($sql);
        if (!$resultado) {
            return "class.Database.class: error ". $mysqli->error;
        }

        return $resultado;
    }

    // ====================================================================
    // 	Nuevas funciones para preparar consultas (evitar inyección SQL)
    // ====================================================================
    public static function prepararConsulta($sql, array $params = []) {
        $db = self::getInstancia();
        $mysqli = $db->getConnection();
        
        $stmt = $mysqli->prepare($sql);
        
        if (!$stmt) {
            return false;
        }
        
        if (!empty($params)) {
            $types = '';
            $values = [];
            
            foreach ($params as $param) {
                if (is_int($param)) {
                    $types .= 'i';
                } elseif (is_float($param)) {
                    $types .= 'd';
                } elseif (is_string($param)) {
                    $types .= 's';
                } else {
                    $types .= 'b';
                }
                
                $values[] = $param;
            }
            
            $stmt->bind_param($types, ...$values);
        }
        
        return $stmt;
    }

    // ====================================================================
    // 	Funciones para encryptar y desencryptar data
    // ====================================================================
    public static function crypt($aEncryptar, $digito = 7) {
        $set_salt = './1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        $salt = sprintf('$2a$%02d$', $digito);
        for ($i = 0; $i < 22; $i++) {
            $salt .= $set_salt[mt_rand(0, 22)];
        }
        
        return password_hash($aEncryptar, PASSWORD_BCRYPT, ['salt' => $salt]);
    }

    public static function uncrypt($evaluar, $contra) {
        return password_verify($evaluar, $contra);
    }
}
?>