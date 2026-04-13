/**
 * Brasileirao Stats - Frontend JavaScript
 * Consome a API REST do backend Spring Boot
 */

// ==================== Configuração ====================
const API_BASE_URL = 'http://localhost:8080/api/v1';

// URLs dos escudos dos clubes do Brasileirão (TheSportsDB API - gratuita)
const ESCUDOS_CLUBES = {
    'Athletico Paranaense': 'https://r2.thesportsdb.com/images/media/team/badge/irzu1u1554237406.png/medium',
    'Atlético Mineiro': 'https://r2.thesportsdb.com/images/media/team/badge/x5lixs1743742872.png/medium',
    'Bahia': 'https://r2.thesportsdb.com/images/media/team/badge/xuvtsv1473539308.png/medium',
    'Botafogo': 'https://r2.thesportsdb.com/images/media/team/badge/bs5mbw1733004596.png/medium',
    'Bragantino': 'https://r2.thesportsdb.com/images/media/team/badge/2p7tl41701423595.png/medium',
    'Chapecoense': 'https://r2.thesportsdb.com/images/media/team/badge/wy0e1i1765900601.png/medium',
    'Corinthians': 'https://r2.thesportsdb.com/images/media/team/badge/vvuvps1473538042.png/medium',
    'Coritiba': 'https://r2.thesportsdb.com/images/media/team/badge/ywwsyu1473538050.png/medium',
    'Cruzeiro': 'https://r2.thesportsdb.com/images/media/team/badge/upsvvu1473538059.png/medium',
    'Flamengo': 'https://r2.thesportsdb.com/images/media/team/badge/syptwx1473538074.png/medium',
    'Fluminense': 'https://r2.thesportsdb.com/images/media/team/badge/stvvwp1473538082.png/medium',
    'Grêmio': 'https://r2.thesportsdb.com/images/media/team/badge/uvpwyt1473538089.png/medium',
    'Internacional': 'https://r2.thesportsdb.com/images/media/team/badge/yprvxx1473538097.png/medium',
    'Mirassol': 'https://r2.thesportsdb.com/images/media/team/badge/pw8uo11765900737.png/medium',
    'Palmeiras': 'https://r2.thesportsdb.com/images/media/team/badge/vsqwqp1473538105.png/medium',
    'Remo': 'https://r2.thesportsdb.com/images/media/team/badge/u36jfy1579341655.png/medium',
    'Santos': 'https://r2.thesportsdb.com/images/media/team/badge/j8xk9g1679447486.png/medium',
    'São Paulo': 'https://r2.thesportsdb.com/images/media/team/badge/sxpupx1473538135.png/medium',
    'Vasco da Gama': 'https://r2.thesportsdb.com/images/media/team/badge/ynqlxo1630521109.png/medium',
    'Vitória': 'https://r2.thesportsdb.com/images/media/team/badge/tysrrx1473538156.png/medium',
    // Nomes alternativos
    'Athletico-PR': 'https://r2.thesportsdb.com/images/media/team/badge/irzu1u1554237406.png/medium',
    'Atlético-MG': 'https://r2.thesportsdb.com/images/media/team/badge/x5lixs1743742872.png/medium',
    'São Paulo': 'https://r2.thesportsdb.com/images/media/team/badge/sxpupx1473538135.png/medium'
};

// Mapeamento de clubes para suas cores (para usar como background)
const CORES_CLUBES = {
    'Flamengo': '#8c1c13',
    'Fluminense': '#7b2d40',
    'Corinthians': '#111111',
    'Palmeiras': '#004703',
    'São Paulo': '#ec1c24',
    'Santos': '#fffafa',
    'Grêmio': '#0e6e17',
    'Internacional': '#e30613',
    'Athletico Paranaense': '#af1e2d',
    'Athletico-PR': '#af1e2d',
    'Coritiba': '#006b3f',
    'Botafogo': '#fff',
    'Vasco da Gama': '#000',
    'Vasco': '#000',
    'Cruzeiro': '#0033a0',
    'Atlético Mineiro': '#000',
    'Atlético-MG': '#000',
    'Bahia': '#0033a0',
    'Vitória': '#ed1c24',
    'Fortaleza': '#004a8d',
    'Ceará': '#ff6600',
    'Sport': '#e30613',
    'Leonardo': '#ff0000',
    'América-MG': '#006633',
    'Cuiabá': '#006b3f',
    'Bragantino': '#fff',
    'Chapecoense': '#006b3f',
    'Mirassol': '#ffc800',
    'Remo': '#0033a0'
};

// ==================== Estado Global ====================
let todosJogadores = [];
let clubesDisponiveis = [];
let jogadorSelecionadoId = null;
let modalJogador = null;
let modalVisualizar = null;
let modalConfirmar = null;

// ==================== Inicialização ====================
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializa os modais do Bootstrap
    modalJogador = new bootstrap.Modal(document.getElementById('modalJogador'));
    modalVisualizar = new bootstrap.Modal(document.getElementById('modalVisualizarJogador'));
    modalConfirmar = new bootstrap.Modal(document.getElementById('modalConfirmarExclusao'));

    // Event listeners para busca em tempo real
    document.getElementById('filtroNome').addEventListener('input', debounce(aplicarFiltros, 400));

    // Event listener para fechar modal de detalhes
    document.getElementById('btnEditarJogador').addEventListener('click', editarJogadorSelecionado);
    document.getElementById('btnExcluirJogador').addEventListener('click', confirmarExcluirJogador);
    document.getElementById('btnConfirmarExclusao').addEventListener('click', excluirJogadorConfirmado);

    // Carrega dados iniciais
    await carregarDadosIniciais();
});

// ==================== APIs ====================

/**
 * Carrega dados iniciais: clubes e jogadores
 */
async function carregarDadosIniciais() {
    try {
        await Promise.all([
            carregarClubes(),
            carregarJogadores()
        ]);
        document.getElementById('loadingSpinner').classList.add('d-none');
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarToast('Erro ao conectar com o servidor. Verifique se a API está rodando.', 'danger');
        document.getElementById('loadingSpinner').classList.add('d-none');
        document.getElementById('semResultados').classList.remove('d-none');
    }
}

/**
 * Carrega todos os jogadores do backend
 */
async function carregarJogadores() {
    const response = await fetch(`${API_BASE_URL}/jogadores`);
    if (!response.ok) throw new Error('Erro ao carregar jogadores');

    todosJogadores = await response.json();
    renderizarJogadores(todosJogadores);
    atualizarEstatisticasGerais();
}

/**
 * Carrega lista de clubes distintos do backend
 */
async function carregarClubes() {
    const response = await fetch(`${API_BASE_URL}/jogadores/clubes`);
    if (!response.ok) throw new Error('Erro ao carregar clubes');

    clubesDisponiveis = await response.json();
    popularSelectClubes();
    renderizarClubes();
}

/**
 * Salva um novo jogador no backend
 */
async function salvarJogador() {
    const form = document.getElementById('formJogador');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const id = document.getElementById('jogadorId').value;
    const jogador = {
        nome: document.getElementById('jogadorNome').value,
        clube: document.getElementById('jogadorClube').value,
        posicao: document.getElementById('jogadorPosicao').value,
        idade: parseInt(document.getElementById('jogadorIdade').value) || null,
        nacionalidade: document.getElementById('jogadorNacionalidade').value || null,
        partidas_jogadas: parseInt(document.getElementById('jogadorPartidas').value) || 0,
        gols: parseInt(document.getElementById('jogadorGols').value) || 0,
        assistencias: parseInt(document.getElementById('jogadorAssistencias').value) || 0,
        cartoes_amarelos: parseInt(document.getElementById('jogadorAmarelos').value) || 0,
        cartoes_vermelhos: parseInt(document.getElementById('jogadorVermelhos').value) || 0
    };

    try {
        const url = id ? `${API_BASE_URL}/jogadores/${id}` : `${API_BASE_URL}/jogadores`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jogador)
        });

        if (!response.ok) throw new Error('Erro ao salvar');

        modalJogador.hide();
        mostrarToast(id ? 'Jogador atualizado com sucesso!' : 'Jogador criado com sucesso!');
        await carregarDadosIniciais();

    } catch (error) {
        console.error('Erro ao salvar:', error);
        mostrarToast('Erro ao salvar jogador. Tente novamente.', 'danger');
    }
}

/**
 * Exclui um jogador do backend
 */
async function excluirJogador(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/jogadores/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erro ao excluir');

        mostrarToast('Jogador excluído com sucesso!');
        await carregarDadosIniciais();

    } catch (error) {
        console.error('Erro ao excluir:', error);
        mostrarToast('Erro ao excluir jogador. Tente novamente.', 'danger');
    }
}

// ==================== Renderização ====================

/**
 * Renderiza o grid de jogadores na página
 */
function renderizarJogadores(jogadores) {
    const grid = document.getElementById('jogadoresGrid');
    const semResultados = document.getElementById('semResultados');

    if (jogadores.length === 0) {
        grid.innerHTML = '';
        semResultados.classList.remove('d-none');
        return;
    }

    semResultados.classList.add('d-none');

    grid.innerHTML = jogadores.map(jogador => `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="player-card" onclick="visualizarJogador(${jogador.id})">
                ${gerarImagemJogador(jogador)}
                <div class="player-card-body">
                    <h5 class="player-card-nome">${jogador.nome}</h5>
                    <p class="player-card-posicao">${jogador.posicao}</p>
                    <p class="player-card-clube">
                        <i class="bi bi-shield-check"></i>
                        ${jogador.clube}
                    </p>
                    <div class="player-stats">
                        <div class="player-stat player-stat-goals">
                            <span class="player-stat-value">${jogador.gols || 0}</span>
                            <span class="player-stat-label">Gols</span>
                        </div>
                        <div class="player-stat player-stat-assists">
                            <span class="player-stat-value">${jogador.assistencias || 0}</span>
                            <span class="player-stat-label">Assists</span>
                        </div>
                        <div class="player-stat">
                            <span class="player-stat-value">${jogador.partidas_jogadas || 0}</span>
                            <span class="player-stat-label">Jogos</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Gera a tag de imagem do jogador (com fallback)
 */
function gerarImagemJogador(jogador) {
    const nomeFormatado = jogador.nome.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const caminhoImg = `images/jogadores/${nomeFormatado}.jpg`;
    const caminhoImgDefault = 'images/jogadores/default.jpg';

    return `
        <img src="${caminhoImg}"
             alt="${jogador.nome}"
             class="player-card-img"
             onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(jogador.nome)}&background=009c3b&color=fff&size=200&font-size=0.4'">
    `;
}

/**
 * Renderiza o grid de clubes
 */
function renderizarClubes() {
    const grid = document.getElementById('clubesGrid');

    if (clubesDisponiveis.length === 0) {
        grid.innerHTML = '<p class="text-muted">Nenhum clube cadastrado.</p>';
        return;
    }

    grid.innerHTML = clubesDisponiveis.map(clube => {
        const cor = CORES_CLUBES[clube] || '#009c3b';
        const quantidade = todosJogadores.filter(j => j.clube === clube).length;

        return `
            <div class="col-lg-2 col-md-3 col-sm-4 col-6">
                <div class="clube-card" onclick="filtrarPorClube('${clube}')">
                    ${gerarEscudoClube(clube, cor)}
                    <div class="clube-card-body">
                        <h6 class="clube-card-nome">${clube}</h6>
                        <p class="clube-card-qtd">${quantidade} jogadores</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Gera o escudo do clube (imagem da API ou placeholder)
 * Usa TheSportsDB API para escudos oficiais dos clubes do Brasileirão
 */
function gerarEscudoClube(clube, cor) {
    // Tenta encontrar o escudo na API (TheSportsDB)
    const escudoUrl = ESCUDOS_CLUBES[clube];

    if (escudoUrl) {
        return `
            <img src="${escudoUrl}"
                 alt="${clube}"
                 class="clube-card-img"
                 onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(clube)}&background=${encodeURIComponent(cor.replace('#', ''))}&color=fff&size=100&bold=true'">
        `;
    }

    // Fallback: usa ui-avatars.com
    return `
        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(clube)}&background=${encodeURIComponent(cor.replace('#', ''))}&color=fff&size=100&bold=true"
             alt="${clube}"
             class="clube-card-img">
    `;
}

/**
 * Popula o select de clubes nos filtros
 */
function popularSelectClubes() {
    const select = document.getElementById('filtroClube');
    const datalist = document.getElementById('listaClubes');

    // Limpa opções existentes (exceto a primeira)
    select.innerHTML = '<option value="">Todos os Clubes</option>';
    datalist.innerHTML = '';

    clubesDisponiveis.forEach(clube => {
        select.innerHTML += `<option value="${clube}">${clube}</option>`;
        datalist.innerHTML += `<option value="${clube}">`;
    });
}

/**
 * Atualiza as estatísticas gerais no hero
 */
function atualizarEstatisticasGerais() {
    const totalGols = todosJogadores.reduce((acc, j) => acc + (j.gols || 0), 0);

    document.getElementById('totalJogadores').textContent = todosJogadores.length;
    document.getElementById('totalClubes').textContent = clubesDisponiveis.length;
    document.getElementById('totalGols').textContent = totalGols;
}

// ==================== Filtros ====================

/**
 * Aplica os filtros selecionados e atualiza a lista
 */
async function aplicarFiltros() {
    const clube = document.getElementById('filtroClube').value;
    const posicao = document.getElementById('filtroPosicao').value;
    const nome = document.getElementById('filtroNome').value;

    // Se houver nome, usa busca por nome (independente dos outros filtros)
    if (nome) {
        const response = await fetch(`${API_BASE_URL}/jogadores?nome=${encodeURIComponent(nome)}`);
        if (!response.ok) {
            console.error('Erro ao buscar por nome');
            return;
        }
        todosJogadores = await response.json();
        renderizarJogadores(todosJogadores);
        return;
    }

    // Filtros por clube e posição
    let url = `${API_BASE_URL}/jogadores`;
    const params = [];

    if (clube) params.push(`clube=${encodeURIComponent(clube)}`);
    if (posicao) params.push(`posicao=${encodeURIComponent(posicao)}`);

    if (params.length > 0) {
        url += '?' + params.join('&');
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao filtrar');

        const jogadoresFiltrados = await response.json();
        renderizarJogadores(jogadoresFiltrados);
    } catch (error) {
        console.error('Erro ao aplicar filtros:', error);
    }
}

/**
 * Filtra por clube (chamado ao clicar em um clube)
 */
function filtrarPorClube(clube) {
    document.getElementById('filtroClube').value = clube;
    document.getElementById('filtroNome').value = '';
    document.getElementById('filtroPosicao').value = '';

    const sectionJogadores = document.getElementById('jogadores');
    sectionJogadores.scrollIntoView({ behavior: 'smooth' });

    aplicarFiltros();
}

// ==================== Modal Visualização ====================

/**
 * Abre o modal de visualização do jogador
 */
async function visualizarJogador(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/jogadores/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar jogador');

        const jogador = await response.json();
        jogadorSelecionadoId = id;

        const corClube = CORES_CLUBES[jogador.clube] || '#009c3b';
        const nomeFormatado = jogador.nome.toLowerCase().replace(/\s+/g, '-');

        document.getElementById('detalhesJogadorCorpo').innerHTML = `
            <div class="mb-4">
                <img src="images/jogadores/${nomeFormatado}.jpg"
                     alt="${jogador.nome}"
                     class="rounded-circle mb-3"
                     style="width: 120px; height: 120px; object-fit: cover; border: 4px solid ${corClube};"
                     onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(jogador.nome)}&background=009c3b&color=fff&size=200'">
                <h4 class="fw-bold">${jogador.nome}</h4>
                <p class="text-muted mb-1">
                    <i class="bi bi-shield-check me-1" style="color: ${corClube}"></i>
                    ${jogador.clube}
                </p>
                <span class="badge bg-primary">${jogador.posicao}</span>
            </div>

            <div class="row text-start">
                <div class="col-6 mb-3">
                    <small class="text-muted text-uppercase">Idade</small>
                    <p class="mb-0 fw-semibold">${jogador.idade || '-'}</p>
                </div>
                <div class="col-6 mb-3">
                    <small class="text-muted text-uppercase">Nacionalidade</small>
                    <p class="mb-0 fw-semibold">${jogador.nacionalidade || '-'}</p>
                </div>
                <div class="col-4 mb-3">
                    <small class="text-muted text-uppercase">Partidas</small>
                    <p class="mb-0 fw-bold fs-5">${jogador.partidas_jogadas || 0}</p>
                </div>
                <div class="col-4 mb-3">
                    <small class="text-muted text-uppercase">Gols</small>
                    <p class="mb-0 fw-bold fs-5 text-success">${jogador.gols || 0}</p>
                </div>
                <div class="col-4 mb-3">
                    <small class="text-muted text-uppercase">Assistências</small>
                    <p class="mb-0 fw-bold fs-5 text-primary">${jogador.assistencias || 0}</p>
                </div>
                <div class="col-6 mb-3">
                    <small class="text-muted text-uppercase">Cartões Amarelos</small>
                    <p class="mb-0 fw-bold fs-5 text-warning">${jogador.cartoes_amarelos || 0}</p>
                </div>
                <div class="col-6 mb-3">
                    <small class="text-muted text-uppercase">Cartões Vermelhos</small>
                    <p class="mb-0 fw-bold fs-5 text-danger">${jogador.cartoes_vermelhos || 0}</p>
                </div>
            </div>
        `;

        modalVisualizar.show();

    } catch (error) {
        console.error('Erro ao visualizar jogador:', error);
        mostrarToast('Erro ao carregar dados do jogador.', 'danger');
    }
}

/**
 * Abre o modal para criar novo jogador
 */
function abrirModalCriarJogador() {
    document.getElementById('modalJogadorTitulo').innerHTML = '<i class="bi bi-person-plus me-2"></i>Novo Jogador';
    document.getElementById('formJogador').reset();
    document.getElementById('jogadorId').value = '';

    // Reseta valores numéricos para 0
    document.getElementById('jogadorPartidas').value = 0;
    document.getElementById('jogadorGols').value = 0;
    document.getElementById('jogadorAssistencias').value = 0;
    document.getElementById('jogadorAmarelos').value = 0;
    document.getElementById('jogadorVermelhos').value = 0;

    modalJogador.show();
}

/**
 * Abre modal para editar o jogador selecionado
 */
function editarJogadorSelecionado() {
    modalVisualizar.hide();

    setTimeout(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/jogadores/${jogadorSelecionadoId}`);
            if (!response.ok) throw new Error('Erro ao buscar jogador');

            const jogador = await response.json();

            document.getElementById('modalJogadorTitulo').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Jogador';
            document.getElementById('jogadorId').value = jogador.id;
            document.getElementById('jogadorNome').value = jogador.nome;
            document.getElementById('jogadorClube').value = jogador.clube;
            document.getElementById('jogadorPosicao').value = jogador.posicao;
            document.getElementById('jogadorIdade').value = jogador.idade || '';
            document.getElementById('jogadorNacionalidade').value = jogador.nacionalidade || '';
            document.getElementById('jogadorPartidas').value = jogador.partidas_jogadas || 0;
            document.getElementById('jogadorGols').value = jogador.gols || 0;
            document.getElementById('jogadorAssistencias').value = jogador.assistencias || 0;
            document.getElementById('jogadorAmarelos').value = jogador.cartoes_amarelos || 0;
            document.getElementById('jogadorVermelhos').value = jogador.cartoes_vermelhos || 0;

            modalJogador.show();

        } catch (error) {
            console.error('Erro ao carregar dados para edição:', error);
            mostrarToast('Erro ao carregar dados do jogador.', 'danger');
        }
    }, 300);
}

/**
 * Abre modal de confirmação de exclusão
 */
function confirmarExcluirJogador() {
    modalVisualizar.hide();
    setTimeout(() => modalConfirmar.show(), 300);
}

/**
 * Confirma e executa a exclusão
 */
async function excluirJogadorConfirmado() {
    modalConfirmar.hide();
    await excluirJogador(jogadorSelecionadoId);
    jogadorSelecionadoId = null;
}

// ==================== Utilitários ====================

/**
 * Exibe um toast com mensagem
 */
function mostrarToast(mensagem, tipo = 'success') {
    const toast = document.getElementById('toastMensagem');
    const toastCorpo = document.getElementById('toastCorpo');

    toastCorpo.textContent = mensagem;
    toast.classList.remove('bg-success', 'bg-danger', 'bg-warning');
    toast.classList.add(`bg-${tipo}`);

    const bootstrapToast = new bootstrap.Toast(toast);
    bootstrapToast.show();
}

/**
 * Função debounce para limitar chamadas frequentes
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
