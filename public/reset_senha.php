<?php
// public/reset_senha.php

// Configurações do Banco (Baseado no seu Database.php)
$host = 'localhost';
$db_name = 'sige_saude_dev';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Gera o hash seguro para a senha "123456"
    $nova_senha = password_hash('123456', PASSWORD_DEFAULT);
    
    // 2. Define o e-mail do admin (ajuste se o seu for diferente)
    $email_admin = 'alison@admin.com'; 

    // 3. Verifica se o usuário existe
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email_admin]);
    
    if ($stmt->rowCount() > 0) {
        // ATUALIZA a senha existente
        $sql = "UPDATE usuarios SET senha = ?, ativo = 1 WHERE email = ?";
        $update = $conn->prepare($sql);
        $update->execute([$nova_senha, $email_admin]);
        echo "<h1>Sucesso!</h1>";
        echo "<p>A senha do usuário <strong>$email_admin</strong> foi alterada para: <strong>123456</strong></p>";
    } else {
        // CRIA um novo usuário se não existir
        $sql = "INSERT INTO usuarios (nome, email, senha, ativo) VALUES (?, ?, ?, 1)";
        $insert = $conn->prepare($sql);
        $insert->execute(['Administrador', $email_admin, $nova_senha]);
        echo "<h1>Usuário Criado!</h1>";
        echo "<p>Usuário: <strong>$email_admin</strong><br>Senha: <strong>123456</strong></p>";
    }

    echo "<br><a href='/sige-saude-dev/public/login'>Clique aqui para fazer Login</a>";

} catch(PDOException $e) {
    echo "<h1>Erro</h1>" . $e->getMessage();
}
?>