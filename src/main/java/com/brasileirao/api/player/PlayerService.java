package com.brasileirao.api.player;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service (Serviço) contém a lógica de negócio da aplicação.
 *
 * Esta camada fica entre o Controller (que recebe as requisições HTTP)
 * e o Repository (que acesso o banco de dados).
 *
 * @Service marca esta classe como um componente Spring (bean).
 * @Transactional garante que todas as operações com o banco sejam
 * executadas dentro de uma transação (commit no sucesso, rollback em erro).
 */
@Service
@Transactional
public class PlayerService {

    // Dependency Injection: o Spring injeta automaticamente o Repository
    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    /**
     * Lista todos os jogadores do banco de dados.
     *
     * @return Lista com todos os jogadores cadastrados
     */
    public List<Player> listarTodos() {
        return playerRepository.findAll();
    }

    /**
     * Filtra jogadores por clube.
     *
     * @param clube Nome do clube (busca parcial, ignorando maiúsculas)
     * @return Lista de jogadores do clube especificado
     */
    public List<Player> filtrarPorClube(String clube) {
        if (clube == null || clube.isBlank()) {
            return playerRepository.findAll();
        }
        return playerRepository.findByClubeContainingIgnoreCase(clube);
    }

    /**
     * Filtra jogadores por posição.
     *
     * @param posicao Posição em campo (busca parcial)
     * @return Lista de jogadores da posição especificada
     */
    public List<Player> filtrarPorPosicao(String posicao) {
        if (posicao == null || posicao.isBlank()) {
            return playerRepository.findAll();
        }
        return playerRepository.findByPosicaoContainingIgnoreCase(posicao);
    }

    /**
     * Filtra jogadores por clube E posição combinados.
     *
     * Se ambos os parâmetros forem fornecidos, retorna apenas jogadores
     * que satisfação ambos os critérios.
     */
    public List<Player> filtrarPorClubeEPosicao(String clube, String posicao) {
        if ((clube == null || clube.isBlank()) && (posicao == null || posicao.isBlank())) {
            return playerRepository.findAll();
        }
        if (clube == null || clube.isBlank()) {
            return filtrarPorPosicao(posicao);
        }
        if (posicao == null || posicao.isBlank()) {
            return filtrarPorClube(clube);
        }
        return playerRepository.findByClubeAndPosicaoContainingIgnoreCase(clube, posicao);
    }

    /**
     * Busca um jogador específico pelo ID.
     *
     * @param id ID do jogador
     * @return Optional com o jogador se encontrado, ou Optional vazio se não existir
     */
    public Optional<Player> buscarPorId(Long id) {
        return playerRepository.findById(id);
    }

    /**
     * Busca jogadores pelo nome (busca parcial).
     *
     * @param nome Nome ou parte do nome a buscar
     * @return Lista de jogadores com nomes que contenham o texto informado
     */
    public List<Player> buscarPorNome(String nome) {
        if (nome == null || nome.isBlank()) {
            return playerRepository.findAll();
        }
        return playerRepository.findByNomeContainingIgnoreCase(nome);
    }

    /**
     * Adiciona um novo jogador ao banco de dados.
     *
     * @param player Jogador a ser criado
     * @return O jogador criado com o ID gerado
     */
    public Player adicionar(Player player) {
        return playerRepository.save(player);
    }

    /**
     * Atualiza um jogador existente.
     *
     * Usa map() do Optional para transformar o valor se presente,
     * ou retornar Optional vazio se não encontrar o jogador.
     *
     * @param id ID do jogador a atualizar
     * @param playerDetails Novos dados do jogador
     * @return Optional com o jogador atualizado, ou vazio se não encontrado
     */
    public Optional<Player> atualizar(Long id, Player playerDetails) {
        return playerRepository.findById(id)
                .map(player -> {
                    // Atualiza cada campo individualmente
                    player.setNome(playerDetails.getNome());
                    player.setClube(playerDetails.getClube());
                    player.setPosicao(playerDetails.getPosicao());
                    player.setIdade(playerDetails.getIdade());
                    player.setNacionalidade(playerDetails.getNacionalidade());
                    player.setPartidasJogadas(playerDetails.getPartidasJogadas());
                    player.setGols(playerDetails.getGols());
                    player.setAssistencias(playerDetails.getAssistencias());
                    player.setCartoesAmarelos(playerDetails.getCartoesAmarelos());
                    player.setCartoesVermelhos(playerDetails.getCartoesVermelhos());
                    return playerRepository.save(player);
                });
    }

    /**
     * Remove um jogador pelo ID.
     *
     * @param id ID do jogador a remover
     * @return true se o jogador foi encontrado e removido, false se não existia
     */
    public boolean deletar(Long id) {
        if (playerRepository.existsById(id)) {
            playerRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Lista todos os clubes distintos cadastrados.
     *
     * Útil para популярны um dropdown de clubes na interface.
     *
     * @return Lista de nomes de clubes ordenados alfabeticamente
     */
    public List<String> listarClubes() {
        return playerRepository.findAllClubes();
    }
}
