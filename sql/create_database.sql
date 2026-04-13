-- Script para criar o banco de dados e tabela do Campeonato Brasileiro
-- Execute no PostgreSQL (psql ou pgAdmin)

-- Criar banco de dados (execute separado se o banco já existir)
-- CREATE DATABASE brasileirao_db;

-- Conectar ao banco antes de executar o resto
-- \c brasileirao_db;

-- Criar a tabela jogadores_stats
CREATE TABLE IF NOT EXISTS jogadores_stats (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    clube VARCHAR(255) NOT NULL,
    posicao VARCHAR(100) NOT NULL,
    idade INTEGER,
    nacionalidade VARCHAR(100),
    partidas_jogadas INTEGER DEFAULT 0,
    gols INTEGER DEFAULT 0,
    assistencias INTEGER DEFAULT 0,
    cartoes_amarelos INTEGER DEFAULT 0,
    cartoes_vermelhos INTEGER DEFAULT 0
);

-- Inserir dados de exemplo
INSERT INTO jogadores_stats (nome, clube, posicao, idade, nacionalidade, partidas_jogadas, gols, assistencias, cartoes_amarelos, cartoes_vermelhos) VALUES
('Weverton', 'Palmeiras', 'Goleiro', 36, 'Brasileira', 38, 0, 0, 2, 0),
('Marinho', 'Flamengo', 'Atacante', 31, 'Brasileira', 35, 18, 8, 5, 1),
('Gabigol', 'Flamengo', 'Atacante', 27, 'Brasileira', 30, 15, 6, 3, 0),
('Arrascaeta', 'Flamengo', 'Meio-Campo', 29, 'Uruguaia', 32, 12, 10, 4, 0),
('Palmeiras', 'Palmeiras', 'Meio-Campo', 26, 'Brasileira', 36, 10, 7, 2, 0),
('Bruno Guimarães', 'Newcastle', 'Meio-Campo', 25, 'Brasileira', 28, 8, 5, 3, 0),
('Rodrigo Nestor', 'São Paulo', 'Meio-Campo', 23, 'Brasileira', 33, 7, 9, 6, 0),
('Vitor Roque', 'Barcelona-ESP', 'Atacante', 19, 'Brasileira', 25, 14, 4, 2, 0),
('Endrick', 'Real Madrid', 'Atacante', 18, 'Brasileira', 20, 6, 2, 1, 0),
('Lucas Paquetá', 'West Ham', 'Meio-Campo', 26, 'Brasileira', 30, 9, 6, 4, 0);
