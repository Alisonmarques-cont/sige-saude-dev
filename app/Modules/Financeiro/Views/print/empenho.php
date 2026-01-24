<!DOCTYPE html>
<html>
<head>
    <title>Empenho #<?= $e['id'] ?></title>
    <style>
        body{font-family:Arial;padding:20px;max-width:800px;margin:0 auto;border:1px solid #ccc;margin-top:20px;} 
        h1{text-align:center;border-bottom:1px solid #000} 
        .row{display:flex;justify-content:space-between;margin-bottom:10px} 
        .label{font-weight:bold}
    </style>
</head>
<body onload='window.print()'>
    <h1>Nota de Empenho</h1>
    <div class='row'><span class='label'>Número:</span> <span><?= $e['id'] ?>/<?= date('Y') ?></span></div>
    <div class='row'><span class='label'>Data:</span> <span><?= date('d/m/Y', strtotime($e['data_emissao'])) ?></span></div>
    <div class='row'><span class='label'>Credor:</span> <span><?= $e['credor'] ?></span></div>
    <div class='row'><span class='label'>Valor:</span> <span>R$ <?= number_format($e['valor_total'], 2, ',', '.') ?></span></div>
    <hr><p><b>Histórico:</b><br><?= $e['descricao'] ?></p>
    <div style='margin-top:50px;text-align:center'>_____________________________<br>Assinatura Responsável</div>
</body>
</html>