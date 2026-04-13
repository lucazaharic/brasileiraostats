package com.brasileirao.api.player;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository (Repositório) é a camada de acesso a dados.
 *
 * Esta interface estende JpaRepository, que já fornece operações CRUD
 * básicas (create, read, update, delete) sem precisarmos implementar nada.
 *
 * O Spring Data JPA gera a implementação automaticamente em tempo de execução
 * com base nos nomes dos métodos que definimos.
 *
 * Convenções de nomenclatura de métodos do Spring Data JPA:
 * - findBy + Campo = busca exata
 * - findBy + Campo + Containing = busca parcial ( LIKE %valor% )
 * - ContainingIgnoreCase = não diferencia maiúsculas de minúsculas
 */
@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {

    /**
     * Busca jogadores por clube (busca parcial, ignorando maiúsculas/minúsculas).
     *
     * Exemplo: "findByClubeContainingIgnoreCase("Flamengo")"
     * retorna jogadores do "Flamengo", "flamengo", "CLUBE DO FLAMENGO", etc.
     *
     * O Spring Data JPA traduz automaticamente para:
     * SELECT * FROM jogadores_stats WHERE LOWER(clube) LIKE LOWER('%Flamengo%')
     */
    List<Player> findByClubeContainingIgnoreCase(String clube);

    /**
     * Busca jogadores por nome (busca parcial).
     *
     * Útil para implementar autocomplete ou busca por parte do nome.
     */
    List<Player> findByNomeContainingIgnoreCase(String nome);

    /**
     * Busca jogadores por posição.
     */
    List<Player> findByPosicaoContainingIgnoreCase(String posicao);

    /**
     * Busca jogadores por clube E posição combinados.
     * Retorna apenas jogadores que satisfação AMBOS os critérios.
     */
    List<Player> findByClubeAndPosicaoContainingIgnoreCase(String clube, String posicao);

    /**
     * Query customizada usando JPQL (Java Persistence Query Language).
     *
     * @Query permite escrever consultas personalizadas.
     * @Paramliga o parâmetro do método ao placeholder na query.
     *
     * JPQL é similar ao SQL, mas trabalha com entidades e não com tabelas.
     * Usamos "p" (alias) para referenciar a entidade Player.
     */
    @Query("SELECT p FROM Player p WHERE p.clube = :clube AND p.posicao = :posicao")
    List<Player> buscarPorClubeEPosicao(@Param("clube") String clube, @Param("posicao") String posicao);

    /**
     * Lista todos os clubes distintos cadastrados, ordenados alfabeticamente.
     *
     * Útil para популярны список de clubes em um dropdown, por exemplo.
     */
    @Query("SELECT DISTINCT p.clube FROM Player p ORDER BY p.clube")
    List<String> findAllClubes();
}
