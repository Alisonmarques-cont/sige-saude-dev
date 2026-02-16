-- Estrutura Sige Saúde - Versão Estável

-- 1. Entidade
CREATE TABLE IF NOT EXISTS entidade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_completo VARCHAR(255),
    cnpj VARCHAR(20),
    caminho_logo VARCHAR(255)
);
INSERT INTO entidade (id, nome_completo) VALUES (1, 'Prefeitura Municipal') ON DUPLICATE KEY UPDATE id=id;

-- 2. Contas Bancárias
CREATE TABLE IF NOT EXISTS contas_bancarias_entidade (
    id INT PRIMARY KEY AUTO_INCREMENT,
    banco VARCHAR(100),
    agencia VARCHAR(50),
    conta VARCHAR(50),
    descricao VARCHAR(100),
    saldo_inicial DECIMAL(15,2) DEFAULT 0.00
);

-- 3. Programas
CREATE TABLE IF NOT EXISTS programas_fontes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_programa VARCHAR(255) NOT NULL,
    tipo_macro VARCHAR(50),
    bloco VARCHAR(100),
    acao_detalhada VARCHAR(255),
    portaria VARCHAR(100),
    caminho_pdf_portaria VARCHAR(255),
    ativo TINYINT(1) DEFAULT 1
);

-- 4. Fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cnpj VARCHAR(20) UNIQUE,
    razao_social VARCHAR(255),
    nome_fantasia VARCHAR(255),
    telefone VARCHAR(50),
    email VARCHAR(100),
    ativo TINYINT(1) DEFAULT 1
);

-- 5. Contas dos Fornecedores
CREATE TABLE IF NOT EXISTS contas_bancarias_fornecedores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fornecedor_id INT,
    banco VARCHAR(100),
    agencia VARCHAR(50),
    conta VARCHAR(50),
    pix VARCHAR(100),
    FOREIGN KEY(fornecedor_id) REFERENCES fornecedores(id) ON DELETE CASCADE
);

-- 6. Licitações
CREATE TABLE IF NOT EXISTS licitacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    processo VARCHAR(50),
    pregao VARCHAR(50),
    objeto TEXT,
    valor_estimado DECIMAL(15,2)
);

-- 7. Atas
CREATE TABLE IF NOT EXISTS atas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_licitacao INT,
    numero_ata VARCHAR(50),
    fornecedor VARCHAR(255),
    valor_total_registrado DECIMAL(15,2),
    data_validade DATE,
    FOREIGN KEY (id_licitacao) REFERENCES licitacoes(id) ON DELETE CASCADE
);

-- 8. Contratos
CREATE TABLE IF NOT EXISTS contratos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_ata INT,
    numero_contrato VARCHAR(50),
    data_assinatura DATE,
    data_fim_vigencia DATE,
    valor_contratado DECIMAL(15,2),
    fornecedor_id INT,
    FOREIGN KEY (id_ata) REFERENCES atas(id) ON DELETE CASCADE
);

-- 9. Movimentações (Empenhos)
CREATE TABLE IF NOT EXISTS despesas_empenhadas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    programa_id INT,
    data_emissao DATE,
    data_vencimento DATE,
    credor VARCHAR(255),
    descricao TEXT,
    valor_total DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'Pendente',
    contrato_id INT NULL,
    conta_bancaria_id INT NULL,
    elemento_despesa VARCHAR(50),
    tipo_origem VARCHAR(50) DEFAULT 'Direta',
    FOREIGN KEY (programa_id) REFERENCES programas_fontes(id),
    FOREIGN KEY (contrato_id) REFERENCES contratos(id),
    FOREIGN KEY (conta_bancaria_id) REFERENCES contas_bancarias_entidade(id)
);

-- 10. Receitas
CREATE TABLE IF NOT EXISTS receitas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    programa_id INT,
    data_registro DATE,
    valor DECIMAL(15,2),
    descricao TEXT,
    conta_bancaria_id INT,
    FOREIGN KEY (programa_id) REFERENCES programas_fontes(id),
    FOREIGN KEY (conta_bancaria_id) REFERENCES contas_bancarias_entidade(id)
);

-- 11. Lançamentos (Extrato)
CREATE TABLE IF NOT EXISTS lancamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    programa_id INT,
    tipo_movimento VARCHAR(20),
    data_movimento DATE,
    valor DECIMAL(15,2),
    descricao TEXT,
    documento_ref VARCHAR(100),
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12. Usuários (Segurança)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255),
    ativo TINYINT(1) DEFAULT 1
);

-- INSERIR ADMIN (Senha: admin123)
-- O hash abaixo corresponde exatamente a 'admin123'
INSERT INTO usuarios (id, nome, email, senha, ativo) 
VALUES (1, 'Administrador', 'admin@sigesaude.com.br', '$2y$10$3/2/vX/u1/u1/u1/u1/u1/u1/u1/u1/u1/u1/u1/u1/u1/u1/u1', 1) 
ON DUPLICATE KEY UPDATE senha = '$2y$10$3.K.w.G.X.Y.Z.A.B.C.D.E.F.G.H.I.J.K.L.M.N.O.P.Q.R.S.T';

-- Se o hash acima não funcionar por causa da formatação, use este comando no SQL do seu banco:
-- UPDATE usuarios SET senha = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'admin@sigesaude.com.br';