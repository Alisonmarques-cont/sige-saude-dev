<!DOCTYPE html>
<html>
<head>
    <title>Relatório</title>
    <style>table{width:100%;border-collapse:collapse} th,td{border:1px solid #000;padding:5px}</style>
</head>
<body onload='window.print()'>
    <h1>Relatório: <?= ucfirst($tipo) ?></h1>
    <?php if ($tipo === 'lancamentos'): ?>
        <table>
            <tr><th>Data</th><th>Tipo</th><th>Desc</th><th>Valor</th></tr>
            <?php foreach($dados as $d): ?>
            <tr>
                <td><?= date('d/m/Y', strtotime($d['data_movimento'])) ?></td>
                <td><?= $d['tipo_movimento'] ?></td>
                <td><?= $d['descricao'] ?></td>
                <td><?= number_format($d['valor'],2,',','.') ?></td>
            </tr>
            <?php endforeach; ?>
        </table>
    <?php endif; ?>
</body>
</html>