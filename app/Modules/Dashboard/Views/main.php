<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sige Saúde | Gestão Corporativa</title>
    
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="icon" href="data:,">
</head>
<body>

    <?php include __DIR__ . '/../../Shared/Views/topbar.php'; ?>
    <?php include __DIR__ . '/../../Shared/Views/sidebar.php'; ?>

    <div class="content-wrapper">
        
        <?php include __DIR__ . '/dashboard.php'; ?>

        <?php include __DIR__ . '/../../Financeiro/Views/index.php'; ?>

        <?php include __DIR__ . '/../../Contratos/Views/index.php'; ?>

        <?php include __DIR__ . '/../../Planejamento/Views/index.php'; ?>

        <?php include __DIR__ . '/../../Relatorios/Views/index.php'; ?>

        <?php include __DIR__ . '/../../Config/Views/index.php'; ?>

    </div>

    <?php include __DIR__ . '/../../Shared/Views/toast.php'; ?>

    <script type="module" src="assets/js/main.js"></script>
</body>
</html>