package com.brasileirao.api.player;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller (Controlador) é a camada que recebe as requisições HTTP
 * e retorna as respostas adequadas.
 *
 * @RestController combina @Controller e @ResponseBody:
 * - @Controller: marca a classe como um componente Spring MVC
 * - @ResponseBody: indica que os métodos retornam dados (JSON), não views
 *
 * @RequestMapping define o caminho base para todos os endpoints
 * desta classe: /api/v1/jogadores
 */
@RestController
@RequestMapping("/api/v1/jogadores")
public class PlayerController {

    // Dependency Injection do Service
    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    /**
     * Lista jogadores com filtros opcionais.
     *
     * @RequestParam torna o parâmetro opcional na query string.
     * Exemplo de URL: /api/v1/jogadores?clube=Flamengo&posicao=Atacante
     *
     * @param clube Filtro por clube (opcional)
     * @param posicao Filtro por posição (opcional)
     * @param nome Busca por nome (opcional)
     * @return Lista de jogadores que satisfação os filtros
     */
    @GetMapping
    public ResponseEntity<List<Player>> listarJogadores(
            @RequestParam(required = false) String clube,
            @RequestParam(required = false) String posicao,
            @RequestParam(required = false) String nome) {

        // Se informado nome, busca por nome (independente dos outros filtros)
        if (nome != null && !nome.isBlank()) {
            return ResponseEntity.ok(playerService.buscarPorNome(nome));
        }

        // Filtros combinados: clube + posição
        if (clube != null && posicao != null) {
            return ResponseEntity.ok(playerService.filtrarPorClubeEPosicao(clube, posicao));
        }

        // Filtro apenas por clube
        if (clube != null && !clube.isBlank()) {
            return ResponseEntity.ok(playerService.filtrarPorClube(clube));
        }

        // Filtro apenas por posição
        if (posicao != null && !posicao.isBlank()) {
            return ResponseEntity.ok(playerService.filtrarPorPosicao(posicao));
        }

        // Sem filtros: retorna todos
        return ResponseEntity.ok(playerService.listarTodos());
    }

    /**
     * Busca um jogador específico pelo ID.
     *
     * @PathVariable extrai o ID da URL: /api/v1/jogadores/1
     *
     * @param id ID do jogador
     * @return Jogador se encontrado, ou 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Player> buscarJogador(@PathVariable Long id) {
        return playerService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cadastra um novo jogador.
     *
     * @RequestBody Desserializa o JSON do corpo da requisição
     * para um objeto Player.
     *
     * @param player Dados do jogador a criar
     * @return Jogador criado com status 201 Created
     */
    @PostMapping
    public ResponseEntity<Player> adicionarJogador(@RequestBody Player player) {
        Player novoJogador = playerService.adicionar(player);
        // HttpStatus.CREATED = 201 (recurso criado com sucesso)
        return ResponseEntity.status(HttpStatus.CREATED).body(novoJogador);
    }

    /**
     * Atualiza um jogador existente.
     *
     * @PathVariable extrai o ID da URL
     * @RequestBody contém os novos dados do jogador
     *
     * @param id ID do jogador a atualizar
     * @param player Novos dados
     * @return Jogador atualizado se encontrado, ou 404 Not Found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Player> atualizarJogador(@PathVariable Long id, @RequestBody Player player) {
        return playerService.atualizar(id, player)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Remove um jogador pelo ID.
     *
     * @param id ID do jogador a remover
     * @return 204 No Content se removido, ou 404 Not Found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarJogador(@PathVariable Long id) {
        if (playerService.deletar(id)) {
            // 204 No Content = requisição bem-sucedida sem conteúdo para retornar
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Lista todos os clubes distintos cadastrados.
     *
     * Útil para популярны um dropdown de clubes na interface.
     *
     * @return Lista de nomes de clubes ordenados alfabeticamente
     */
    @GetMapping("/clubes")
    public ResponseEntity<List<String>> listarClubes() {
        return ResponseEntity.ok(playerService.listarClubes());
    }
}
