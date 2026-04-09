-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 08/04/2026 às 23:35
-- Versão do servidor: 8.4.7
-- Versão do PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `laravel`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `aditivos`
--

DROP TABLE IF EXISTS `aditivos`;
CREATE TABLE IF NOT EXISTS `aditivos` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `contrato_id` bigint UNSIGNED NOT NULL,
  `numero_aditivo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('Valor','Prazo','Valor e Prazo','Outros') COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor_adicionado` decimal(15,2) NOT NULL DEFAULT '0.00',
  `nova_data_fim` date DEFAULT NULL,
  `data_assinatura` date NOT NULL,
  `motivo` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `aditivos_contrato_id_foreign` (`contrato_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `atas`
--

DROP TABLE IF EXISTS `atas`;
CREATE TABLE IF NOT EXISTS `atas` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `processo_id` bigint UNSIGNED NOT NULL,
  `fornecedor_id` bigint UNSIGNED NOT NULL,
  `numero_ata` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor_total_ata` decimal(15,2) NOT NULL,
  `data_assinatura` date NOT NULL,
  `vigencia_fim` date NOT NULL,
  `status` enum('Ativa','Vencida','Cancelada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Ativa',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `atas_processo_id_foreign` (`processo_id`),
  KEY `atas_fornecedor_id_foreign` (`fornecedor_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `cache`
--

DROP TABLE IF EXISTS `cache`;
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `contas_bancarias`
--

DROP TABLE IF EXISTS `contas_bancarias`;
CREATE TABLE IF NOT EXISTS `contas_bancarias` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `banco` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `agencia` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `conta` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('Corrente','Poupança','Investimento','Caixa') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Corrente',
  `saldo_inicial` decimal(15,2) NOT NULL DEFAULT '0.00',
  `saldo_atual` decimal(15,2) NOT NULL DEFAULT '0.00',
  `status` enum('Ativa','Inativa') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Ativa',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `contratos`
--

DROP TABLE IF EXISTS `contratos`;
CREATE TABLE IF NOT EXISTS `contratos` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `ata_id` bigint UNSIGNED NOT NULL,
  `fornecedor_id` bigint UNSIGNED NOT NULL,
  `numero_contrato` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor_global` decimal(15,2) NOT NULL,
  `data_assinatura` date NOT NULL,
  `vigencia_inicio` date NOT NULL,
  `vigencia_fim` date NOT NULL,
  `status` enum('Ativo','Vencido','Rescindido','Suspenso') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Ativo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contratos_ata_id_foreign` (`ata_id`),
  KEY `contratos_fornecedor_id_foreign` (`fornecedor_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `entidades`
--

DROP TABLE IF EXISTS `entidades`;
CREATE TABLE IF NOT EXISTS `entidades` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome_fundo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cnpj` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gestor_nome` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gestor_cpf` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cep` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endereco` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bairro` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cidade` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Sairé',
  `uf` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PE',
  `telefone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `fornecedores`
--

DROP TABLE IF EXISTS `fornecedores`;
CREATE TABLE IF NOT EXISTS `fornecedores` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `razao_social` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cnpj_cpf` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endereco` text COLLATE utf8mb4_unicode_ci,
  `tipo` enum('Física','Jurídica') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Jurídica',
  `status` enum('Ativo','Inativo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Ativo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fornecedores_cnpj_cpf_unique` (`cnpj_cpf`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `lancamentos`
--

DROP TABLE IF EXISTS `lancamentos`;
CREATE TABLE IF NOT EXISTS `lancamentos` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `conta_bancaria_id` bigint UNSIGNED NOT NULL,
  `fornecedor_id` bigint UNSIGNED DEFAULT NULL,
  `plano_conta_id` bigint UNSIGNED DEFAULT NULL,
  `numero_empenho` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `processo_licitatorio` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fonte_recurso` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('Receita','Despesa') COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor` decimal(15,2) NOT NULL,
  `data_vencimento` date NOT NULL,
  `data_pagamento` date DEFAULT NULL,
  `status` enum('Pendente','Pago','Atrasado','Cancelado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pendente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lancamentos_conta_bancaria_id_foreign` (`conta_bancaria_id`),
  KEY `lancamentos_fornecedor_id_foreign` (`fornecedor_id`),
  KEY `lancamentos_plano_conta_id_foreign` (`plano_conta_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_03_14_000000_create_plano_contas_table', 1),
(5, '2026_03_15_192210_create_conta_bancarias_table', 1),
(6, '2026_03_15_192216_create_fornecedors_table', 1),
(7, '2026_03_15_215328_create_lancamentos_table', 1),
(8, '2026_03_16_175505_create_entidades_table', 1),
(9, '2026_03_22_011340_create_programa_trabalhos_table', 1),
(10, '2026_03_28_170438_create_processos_table', 1),
(11, '2026_03_28_170440_create_atas_table', 1),
(12, '2026_03_28_170454_create_contratos_table', 1),
(13, '2026_03_28_232502_create_aditivos_table', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `plano_contas`
--

DROP TABLE IF EXISTS `plano_contas`;
CREATE TABLE IF NOT EXISTS `plano_contas` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('Receita','Despesa') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `processos`
--

DROP TABLE IF EXISTS `processos`;
CREATE TABLE IF NOT EXISTS `processos` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `numero_processo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modalidade` enum('Pregão Eletrônico','Pregão Presencial','Inexigibilidade','Dispensa','Concorrência','Adesão (Carona)') COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_modalidade` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objeto` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ano` year NOT NULL,
  `valor_total_licitado` decimal(15,2) NOT NULL DEFAULT '0.00',
  `status` enum('Em Andamento','Homologado','Deserto/Fracassado','Suspenso','Concluído') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Em Andamento',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `programa_trabalhos`
--

DROP TABLE IF EXISTS `programa_trabalhos`;
CREATE TABLE IF NOT EXISTS `programa_trabalhos` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bloco` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `acao_detalhada` text COLLATE utf8mb4_unicode_ci,
  `portaria` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_repasse` enum('Fundo a Fundo','Convênio','Emenda Parlamentar','Recurso Próprio','Outros') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Fundo a Fundo',
  `status` enum('Ativo','Inativo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Ativo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'PROGRAMADOR', 'programacao@sigesaude.com', '2026-04-09 02:31:36', '$2y$12$uvk6IiGEThSWDI3q4VHfu./ss4ZcqFMZV8.taf33YowoUbuGR5ALC', 'QQCQxr39R1', '2026-04-09 02:31:36', '2026-04-09 02:31:36');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
