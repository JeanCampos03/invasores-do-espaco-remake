Este projeto foi inicialmente baseado em [Space Invaders, de @manualdodev](https://github.com/manualdodev/space-invaders). A estrutura segue a separação simples entre classes, utilitários e recursos, com funcionalidades adicionais de relatório e loja local de skins.

## Como executar

O jogo é uma aplicação estática, sem backend, instalação de pacotes ou configuração de banco de dados.

1. Abra a pasta do projeto no VS Code.
2. Inicie `index.html` com a extensão **Live Server**. Alternativamente, na raiz do projeto, execute `python -m http.server 8000`.
3. Se usou o servidor Python, abra `http://localhost:8000` no navegador.
4. No menu, selecione **Jogar**. Use **A** e **D** para mover a nave e **Enter** para atirar.

## Recursos

- **Meta e relatório:** mostra um exemplo de meta e um relatório com dados fictícios; não representa atividade ou movimentação financeira real.
- **Loja e skins:** desbloqueie skins demonstrativas e selecione uma nave. A propriedade e a seleção são salvas no armazenamento local do navegador; não há cobrança real.

## Estrutura

```text
index.html
src/
  classes/   # Jogo, jogador, inimigos, efeitos e interface da meta
  utils/     # Constantes e catálogo de skins
  assets/    # Imagens e sons
  index.js   # Inicialização do jogo e da interface
  style.css  # Estilos do jogo e do menu
  goal-panel.css
```
