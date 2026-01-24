<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | Sige Saúde Enterprise</title>
    
    <link rel="stylesheet" href="assets/css/main.css">
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
</head>
<body class="login-page">

    <div class="brand-section">
        <div class="brand-content">
            <div class="brand-logo-container">
                <i class="ph-fill ph-first-aid-kit brand-icon"></i>
            </div>
            <h1 class="brand-title">Sige <span>Saúde</span></h1>
            <p class="brand-tagline">
                Gestão pública inteligente, transparente e eficiente. 
                <br>O controle financeiro e orçamentário do SUS em um só lugar.
            </p>
        </div>
    </div>

    <div class="form-section">
        <div class="form-wrapper">
            <div class="login-header">
                <h2 class="login-title">Bem-vindo de volta</h2>
                <p class="login-subtitle">Insira suas credenciais corporativas para acessar.</p>
            </div>

            <div id="msg_erro" class="error-msg" style="display:none"></div>

            <form id="form_login">
                <div class="login-form-group">
                    <label for="email">E-mail Corporativo</label>
                    <div class="input-with-icon">
                        <input type="email" id="email" class="input-modern" placeholder="nome@municipio.gov.br" required>
                        <i class="ph ph-envelope-simple input-icon"></i>
                    </div>
                </div>

                <div class="login-form-group">
                    <label for="senha">Senha de Acesso</label>
                    <div class="input-with-icon">
                        <input type="password" id="senha" class="input-modern" placeholder="••••••••" required>
                        <i class="ph ph-lock-key input-icon"></i>
                    </div>
                </div>

                <button type="submit" class="btn-primary btn-login">
                    Acessar Painel <i class="ph-bold ph-arrow-right" style="margin-left:8px"></i>
                </button>
            </form>

            <div class="footer-login">
                &copy; <?= date('Y') ?> Sige Saúde Tecnologia. <br>
                <span style="opacity:0.7"><i class="ph-fill ph-shield-check"></i> Ambiente Seguro e Monitorado.</span>
            </div>
        </div>
    </div>

    <script type="module" src="assets/js/modules/auth.js"></script>
</body>
</html>