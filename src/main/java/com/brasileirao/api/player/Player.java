package com.brasileirao.api.player;

import jakarta.persistence.*;
import java.util.Objects;

/**
 * Entidade que representa um jogador no sistema de estatísticas.
 *
 * A anotação @Entity indica que esta classe será persistida no banco de dados.
 * A anotação @Table define o nome da tabela no banco (jogadores_stats).
 *
 * Cada atributo da classe corresponde a uma coluna na tabela do banco de dados.
 * O Spring Data JPA cuida da conversão automática entre objetos Java e registros SQL.
 */
@Entity
@Table(name = "jogadores_stats")
public class Player {

    /**
     * ID único do jogador.
     *
     * @Id marca este campo como chave primária.
     * @GeneratedValue com GenerationType.IDENTITY habilita o auto-incremento
     * (no PostgreSQL, a coluna é criada como SERIAL).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome completo do jogador.
     * @Column(nullable = false) = este campo não pode ser nulo no banco
     */
    @Column(nullable = false)
    private String nome;

    /**
     * Clube atual do jogador.
     * Mapeado para a coluna "clube" (snake_case no banco, clube em Java).
     */
    @Column(name = "clube", nullable = false)
    private String clube;

    /**
     * Posição do jogador em campo.
     * Exemplos: Goleiro, Lateral, Zagueiro, Meio-Campo, Atacante
     */
    @Column(nullable = false)
    private String posicao;

    /**
     * Idade do jogador (em anos).
     */
    private Integer idade;

    /**
     * Nacionalidade do jogador.
     * Exemplos: Brasileira, Argentina, Colombiana, etc.
     */
    private String nacionalidade;

    /**
     * Total de partidas jogadas pelo jogador.
     * Mapeado para a coluna "partidas_jogadas" no banco.
     */
    @Column(name = "partidas_jogadas")
    private Integer partidasJogadas;

    /**
     * Total de gols marcados pelo jogador.
     */
    private Integer gols;

    /**
     * Total de assistências para gols.
     */
    private Integer assistencias;

    /**
     * Total de cartões amarelos recebidos.
     * Mapeado para a coluna "cartoes_amarelos" no banco.
     */
    @Column(name = "cartoes_amarelos")
    private Integer cartoesAmarelos;

    /**
     * Total de cartões vermelhos recebidos.
     * Mapeado para a coluna "cartoes_vermelhos" no banco.
     */
    @Column(name = "cartoes_vermelhos")
    private Integer cartoesVermelhos;

    /**
     * Construtor padrão (obrigatório para o JPA).
     * O JPA precisa de um construtor sem argumentos para criar objetos
     * ao ler dados do banco.
     */
    public Player() {
    }

    /**
     * Construtor completo para criar um jogador com todos os dados.
     * Útil para testes e criação direta de objetos.
     */
    public Player(String nome, String clube, String posicao, Integer idade, String nacionalidade,
                  Integer partidasJogadas, Integer gols, Integer assistencias,
                  Integer cartoesAmarelos, Integer cartoesVermelhos) {
        this.nome = nome;
        this.clube = clube;
        this.posicao = posicao;
        this.idade = idade;
        this.nacionalidade = nacionalidade;
        this.partidasJogadas = partidasJogadas;
        this.gols = gols;
        this.assistencias = assistencias;
        this.cartoesAmarelos = cartoesAmarelos;
        this.cartoesVermelhos = cartoesVermelhos;
    }

    // ==================== Getters e Setters ====================
    // Métodos de acesso aos atributos privados.
    // O JPA usa reflection para ler/escrever campos, mas também precisamos
    // de getters e setters para uso normal no código Java.

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getClube() {
        return clube;
    }

    public void setClube(String clube) {
        this.clube = clube;
    }

    public String getPosicao() {
        return posicao;
    }

    public void setPosicao(String posicao) {
        this.posicao = posicao;
    }

    public Integer getIdade() {
        return idade;
    }

    public void setIdade(Integer idade) {
        this.idade = idade;
    }

    public String getNacionalidade() {
        return nacionalidade;
    }

    public void setNacionalidade(String nacionalidade) {
        this.nacionalidade = nacionalidade;
    }

    public Integer getPartidasJogadas() {
        return partidasJogadas;
    }

    public void setPartidasJogadas(Integer partidasJogadas) {
        this.partidasJogadas = partidasJogadas;
    }

    public Integer getGols() {
        return gols;
    }

    public void setGols(Integer gols) {
        this.gols = gols;
    }

    public Integer getAssistencias() {
        return assistencias;
    }

    public void setAssistencias(Integer assistencias) {
        this.assistencias = assistencias;
    }

    public Integer getCartoesAmarelos() {
        return cartoesAmarelos;
    }

    public void setCartoesAmarelos(Integer cartoesAmarelos) {
        this.cartoesAmarelos = cartoesAmarelos;
    }

    public Integer getCartoesVermelhos() {
        return cartoesVermelhos;
    }

    public void setCartoesVermelhos(Integer cartoesVermelhos) {
        this.cartoesVermelhos = cartoesVermelhos;
    }

    // ==================== Métodos do Object ====================

    /**
     * equals() - Usado para comparar jogadores pelo ID.
     * Dois jogadores são iguais se têm o mesmo ID.
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Player player = (Player) o;
        return Objects.equals(id, player.id);
    }

    /**
     * hashCode() - Retorna um código hash baseado no ID.
     * Usado em coleções como HashSet e HashMap.
     */
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    /**
     * toString() - Representação em texto do jogador.
     * Útil para logs e depuração.
     */
    @Override
    public String toString() {
        return "Player{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", clube='" + clube + '\'' +
                ", posicao='" + posicao + '\'' +
                ", idade=" + idade +
                ", nacionalidade='" + nacionalidade + '\'' +
                ", partidasJogadas=" + partidasJogadas +
                ", gols=" + gols +
                ", assistencias=" + assistencias +
                ", cartoesAmarelos=" + cartoesAmarelos +
                ", cartoesVermelhos=" + cartoesVermelhos +
                '}';
    }
}
