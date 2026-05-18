# EstruturaViz

**Visualizador Interativo de Estruturas de Dados**

Desenvolvido por L. A. Leandro - São José dos Campos - SP - 18/05/2026

---

## Sumário

1. [Objetivo do Programa](#1-objetivo-do-programa)
2. [Requisitos](#2-requisitos)
3. [Especificações Técnicas](#3-especificações-técnicas)
4. [Arquitetura do Sistema](#4-arquitetura-do-sistema)
5. [Stack e Tecnologias](#5-stack-e-tecnologias)
6. [Dependências](#6-dependências)
7. [Instalação](#7-instalação)
8. [Manual do Usuário](#8-manual-do-usuário)
9. [Testes](#9-testes)
10. [Estrutura do Projeto](#10-estrutura-do-projeto)
11. [Licença](#11-licença)

---

## 1. Objetivo do Programa

O **EstruturaViz** é uma aplicação web interativa desenvolvida com fins educacionais que permite a visualização dinâmica e animada de estruturas de dados fundamentais da Ciência da Computação. O programa funciona como um laboratório visual onde estudantes, professores e profissionais podem observar o comportamento de algoritmos em tempo real.

### Aplicações Práticas

- **Ambiente Acadêmico:** Recurso didático para disciplinas de Estruturas de Dados e Algoritmos, permitindo que alunos visualizem o comportamento interno de pilhas, filas, árvores binárias e grafos durante as operações.
- **Preparação para Entrevistas Técnicas:** Simulação visual de algoritmos clássicos como busca binária (BST), BFS e DFS, auxiliando na compreensão dos conceitos cobrados em coding interviews.
- **Autoaprendizado:** Estudo autodidata com controle de velocidade para acompanhar cada passo dos algoritmos em detalhe.
- **Demonstrações em Sala de Aula:** Projeção interativa durante explicações, com capacidade de inserir dados em tempo real.

---

## 2. Requisitos

### Requisitos Funcionais

| ID | Requisito | Módulo |
|:---|:----------|:-------|
| RF01 | O sistema deve permitir operações de Push e Pop em uma Pilha com animação visual | Pilha |
| RF02 | O sistema deve permitir operações de Enqueue e Dequeue em uma Fila com animação visual | Fila |
| RF03 | O sistema deve permitir a inserção de nós numéricos em uma Árvore Binária de Busca | BST |
| RF04 | O sistema deve exibir a árvore organizada visualmente no canvas SVG | BST |
| RF05 | O sistema deve destacar o caminho percorrido durante a busca de um valor na BST | BST |
| RF06 | O sistema deve permitir a criação visual de nós em um grafo | Grafo |
| RF07 | O sistema deve permitir a criação de arestas entre nós do grafo | Grafo |
| RF08 | O sistema deve simular visualmente o algoritmo de Busca em Largura (BFS) | Grafo |
| RF09 | O sistema deve simular visualmente o algoritmo de Busca em Profundidade (DFS) | Grafo |
| RF10 | O sistema deve exibir a complexidade de tempo (Big O Notation) das operações | Global |
| RF11 | O sistema deve possuir um controle deslizante para ajustar a velocidade da animação | Global |
| RF12 | O sistema deve possuir um botão de Reset que limpe o estado atual | Global |
| RF13 | O sistema deve exibir legenda dinâmica de cores conforme o módulo ativo | Global |

### Requisitos Não Funcionais

| ID | Requisito |
|:---|:----------|
| RNF01 | A interface deve ser responsiva e funcionar em navegadores modernos (Chrome, Firefox, Edge) |
| RNF02 | As animações devem ser suaves e não bloquear a thread principal |
| RNF03 | O código deve ser modular com separação clara entre lógica de dados e apresentação |
| RNF04 | Os testes unitários devem cobrir a lógica computacional das estruturas de dados |
| RNF05 | A aplicação deve ser entregue como uma Single Page Application (SPA) |

---

## 3. Especificações Técnicas

### Módulo Pilha (Stack)

- Estrutura LIFO (Last In, First Out)
- Operações: `Push` (inserir no topo), `Pop` (remover do topo), `Limpar`
- Representação visual: blocos empilhados verticalmente com seta indicando o topo
- Complexidade: O(1) para Push e Pop
- Destaque animado no elemento recém-adicionado

### Módulo Fila (Queue)

- Estrutura FIFO (First In, First Out)
- Operações: `Enqueue` (inserir no fim), `Dequeue` (remover do início), `Limpar`
- Representação visual: blocos enfileirados horizontalmente com seta indicando a frente
- Complexidade: O(1) para Enqueue e Dequeue
- Destaque animado no elemento recém-adicionado

### Módulo Árvore Binária de Busca (BST)

- Inserção recursiva respeitando a regra: menores à esquerda, maiores à direita
- Remoção com tratamento de três casos: nó folha, nó com um filho, nó com dois filhos (sucessor)
- Busca com destaque passo a passo do caminho percorrido
- Layout SVG calculado automaticamente por função recursiva de coordenadas
- Complexidade: O(log n) médio para inserção, remoção e busca
- Esquema de cores:
  - Azul: nó sendo visitado (atual)
  - Verde: nó encontrado (resultado)
  - Azul escuro: nós do caminho já percorrido
  - Cinza: nós não visitados

### Módulo Grafo

- Grafo não-direcionado representado por lista de adjacência
- Criação de nós com posicionamento circular automático
- Criação de arestas por seleção de dois nós consecutivos
- Algoritmos de busca:
  - **BFS (Breadth-First Search):** utiliza fila, exibe a fila em tempo real
  - **DFS (Depth-First Search):** utiliza pilha, exibe a pilha em tempo real
- Complexidade: O(V + E) para BFS e DFS
- Esquema de cores:
  - Âmbar: nó sendo visitado no momento
  - Verde: nó já visitado
  - Arestas destacadas em verde quando ambos os nós conectados foram visitados

### Painel de Controle Global

- Seletor de módulo com botões de ícone + rótulo
- Controle deslizante de velocidade (3 níveis)
- Botão de Reset
- Legenda dinâmica que se adapta ao módulo ativo

---

## 4. Arquitetura do Sistema

```
+----------------------------------------------------------+
|                     index.html                            |
|                     (Entry Point)                         |
+----------------------------------------------------------+
                            |
                    +-------v--------+
                    |   main.tsx     |
                    | (React DOM)    |
                    +-------+--------+
                            |
                    +-------v--------+
                    |    App.tsx     |
                    | (Layout +      |
                    |  Estado Global)|-------> ControlPanel.tsx
                    +-------+--------+         (Módulo, Velocidade,
                            |                   Reset, Legenda)
                            |
          +-----------------+------------------+
          |                 |                  |
   +------v------+  +------v------+   +-------v-------+
   | LinearPanel |  |  BSTPanel   |   |  GraphPanel   |
   | (Stack/Fila)|  | (Árvore)    |   |  (Grafo)      |
   +------+------+  +------+------+   +-------+-------+
          |                 |                  |
   +------v------+  +------v------+   +-------v-------+
   | utils/      |  | utils/      |   |  utils/       |
   | stack.ts    |  | bst.ts      |   |  graph.ts     |
   | queue.ts    |  |             |   |               |
   +-------------+  +-------------+   +---------------+
          |                 |                  |
   +------v------+  +------v------+   +-------v-------+
   | utils/      |  | utils/      |   |  utils/       |
   | animation.ts|  | animation.ts|   |  animation.ts |
   +-------------+  +-------------+   +---------------+

                  +------------------+
                  |    Testes        |
                  | (Vitest)         |
                  +------------------+
```

### Fluxo de Dados

```
Usuário interage (clique/input)
       |
       v
Componente React (ex: BSTPanel)
       |
       v
Chama método na classe pura (ex: BST.insert())
       |
       v
Atualiza estado React (useState)
       |
       v
Re-renderiza SVG com novos dados
       |
       v
Animações via setTimeout encadeado
       |
       v
Estado volta a "idle" após conclusão
```

### Separação de Camadas

- **Camada de Lógica Pura** (`src/utils/`): Classes TypeScript sem dependência de React. Contêm apenas a lógica computacional das estruturas de dados (BST, Stack, Queue, Graph). Testáveis isoladamente.
- **Camada de Apresentação** (`src/components/`): Componentes React que consomem as classes de lógica pura e renderizam SVG. Gerenciam estado de animação e UI.
- **Camada de Layout** (`App.tsx`): Orquestra a seleção de módulo, velocidade e reset.
- **Camada de Estilos**: Tailwind CSS para estilização utilitária.

---

## 5. Stack e Tecnologias

| Tecnologia | Versão | Finalidade |
|:-----------|:-------|:-----------|
| **React** | 19 | Biblioteca para construção da interface |
| **TypeScript** | 6 | Tipagem estática e segurança do código |
| **Vite** | 8 | Bundler e servidor de desenvolvimento |
| **Tailwind CSS** | 4 | Framework de estilização utilitária |
| **Lucide React** | 1.16 | Ícones vetoriais |
| **SVG puro** | — | Renderização das estruturas de dados |
| **Vitest** | 4 | Framework de testes unitários |
| **@testing-library/jest-dom** | 6 | Matchers para testes DOM |
| **jsdom** | 29 | Ambiente DOM para testes |

---

## 6. Dependências

### Produção

```
react
react-dom
tailwindcss
@tailwindcss/vite
lucide-react
```

### Desenvolvimento

```
vite
@vitejs/plugin-react
typescript
vitest
@testing-library/jest-dom
jsdom
eslint
@eslint/js
typescript-eslint
eslint-plugin-react-hooks
eslint-plugin-react-refresh
globals
```

---

## 7. Instalação

### Pré-requisitos

- Node.js 18 ou superior
- npm 9 ou superior (ou yarn, pnpm)

### Passos para instalação

```bash
# Clone o repositório
git clone https://github.com/L-A-Leandro/estrutura-viz.git
cd estrutura-viz

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse no navegador: `http://localhost:5173`

### Comandos disponíveis

```bash
npm run dev       # Inicia servidor de desenvolvimento (HMR)
npm run build     # Compila para produção
npm run preview   # Visualiza o build de produção
npm test          # Executa todos os testes
npm run test:watch # Executa testes em modo watch
npm run lint      # Verifica o código com ESLint
```

---

## 8. Manual do Usuário

### Primeiros Passos

1. Ao abrir a aplicação, o módulo **Árvore BST** é exibido por padrão
2. No painel à esquerda, selecione o módulo desejado:
   - **Pilha**: blocos empilhados verticalmente
   - **Fila**: blocos enfileirados horizontalmente
   - **Árvore BST**: árvore binária com nós circulares
   - **Grafo**: rede de nós conectados por arestas

### Operando a Pilha

1. Digite um valor numérico no campo "Valor numérico"
2. Clique em **Push** para inserir no topo (ou pressione Enter)
3. Clique em **Pop** para remover do topo
4. Use **Limpar** para esvaziar a estrutura

### Operando a Fila

1. Digite um valor numérico
2. Clique em **Enqueue** para inserir ao final da fila
3. Clique em **Dequeue** para remover o primeiro elemento
4. Use **Limpar** para esvaziar

### Operando a Árvore BST

1. Digite um valor numérico e clique em **Inserir** (ou Enter)
2. A árvore se reorganiza automaticamente no canvas
3. Para buscar, digite um valor e clique em **Buscar**
4. Observe o caminho percorrido destacado em azul
5. Se encontrado, o nó fica verde com animação pulse

### Operando o Grafo

1. Digite um rótulo e clique em **Adicionar Nó**
2. Para criar uma aresta:
   - Clique em um nó para selecioná-lo (borda azul)
   - Clique em um segundo nó para conectá-los
3. Clique em **BFS** ou **DFS** para executar os algoritmos
4. Observe a fila/pilha atual sendo exibida acima do canvas

### Ajustando a Velocidade

- Arraste o controle deslizante no painel esquerdo
- **Lenta** (800ms por passo): ideal para estudo detalhado
- **Normal** (400ms por passo): equilíbrio padrão
- **Rápida** (150ms por passo): para visualizar o resultado rapidamente

### Interpretando as Cores

| Cor | Módulo | Significado |
|:----|:-------|:------------|
| Azul | BST | Nó sendo visitado durante a busca |
| Verde | BST | Nó encontrado (resultado da busca) |
| Azul escuro | BST | Caminho já percorrido |
| Âmbar | Grafo | Nó sendo visitado no momento |
| Verde | Grafo | Nó já visitado |
| Azul | Pilha/Fila | Elemento recém-adicionado (ativo) |

### Reset

Clique no botão **Reset** (ícone de seta circular) no painel esquerdo para limpar a estrutura atual e retornar ao estado inicial.

---

## 9. Testes

O projeto utiliza **Vitest** como framework de testes unitários, totalizando **36 testes** distribuídos em 4 suites.

### Suite BST (11 testes)

| Teste | Descrição |
|:------|:----------|
| `starts empty` | Verifica que a árvore inicia com root nulo |
| `inserts a single node as root` | Insere nó raiz |
| `inserts smaller values to the left` | Insere valor menor à esquerda |
| `inserts larger values to the right` | Insere valor maior à direita |
| `inserts multiple levels correctly` | Inserção em múltiplos níveis |
| `ignores duplicate values` | Valores duplicados são ignorados |
| `deletes a leaf node` | Remove nó folha |
| `deletes a node with one child` | Remove nó com um filho |
| `deletes a node with two children` | Remove nó com dois filhos (sucessor) |
| `searches and returns path steps` | Busca retorna caminho percorrido |
| `search returns empty for missing value` | Busca de valor ausente |
| `clears the tree` | Limpa a árvore |
| `inOrder returns sorted values` | Percurso in-order retorna valores ordenados |

### Suite Stack (7 testes)

| Teste | Descrição |
|:------|:----------|
| `starts empty` | Pilha inicia vazia |
| `pushes items` | Inserção de itens |
| `pops items in LIFO order` | Remoção respeita ordem LIFO |
| `peek returns top without removing` | Peek não remove o elemento |
| `pop returns undefined on empty stack` | Pop em pilha vazia |
| `clear empties the stack` | Limpa a pilha |
| `toArray returns a copy` | toArray retorna cópia |

### Suite Queue (7 testes)

| Teste | Descrição |
|:------|:----------|
| `starts empty` | Fila inicia vazia |
| `enqueues items` | Inserção de itens |
| `dequeues items in FIFO order` | Remoção respeita ordem FIFO |
| `front returns first without removing` | Front não remove o elemento |
| `dequeue returns undefined on empty queue` | Dequeue em fila vazia |
| `clear empties the queue` | Limpa a fila |
| `toArray returns a copy` | toArray retorna cópia |

### Suite Graph (11 testes)

| Teste | Descrição |
|:------|:----------|
| `starts empty` | Grafo inicia vazio |
| `adds nodes` | Adiciona nós |
| `adds edges` | Adiciona arestas |
| `does not add duplicate edges` | Arestas duplicadas são ignoradas |
| `does not add self-loop` | Self-loops são ignorados |
| `gets neighbors` | Obtém vizinhos do nó |
| `bfs visits all nodes` | BFS visita todos os nós |
| `dfs visits all nodes` | DFS visita todos os nós |
| `clear removes all nodes and edges` | Limpa o grafo |

### Executando os Testes

```bash
# Executa todos os testes
npm test

# Executa em modo watch
npm run test:watch
```

---

## 10. Estrutura do Projeto

```
estrutura-viz/
├── index.html                     # Ponto de entrada HTML
├── package.json                   # Dependências e scripts
├── vite.config.ts                 # Configuração do Vite + Vitest
├── eslint.config.js               # Configuração do ESLint
├── tsconfig.json                  # Configuração TypeScript
├── tsconfig.app.json              # Configuração TS para o app
├── tsconfig.node.json             # Configuração TS para Node
├── public/
│   └── favicon.svg                # Ícone do site
├── src/
│   ├── main.tsx                   # Inicialização React
│   ├── App.tsx                    # Layout principal e estado global
│   ├── index.css                  # Estilos globais (Tailwind)
│   ├── components/
│   │   ├── ControlPanel.tsx       # Painel de controle lateral
│   │   ├── LinearPanel.tsx        # Visualizador de Pilha e Fila
│   │   ├── BSTPanel.tsx           # Visualizador de Árvore BST
│   │   └── GraphPanel.tsx         # Visualizador de Grafo
│   ├── utils/
│   │   ├── bst.ts                 # Lógica da BST + layout SVG
│   │   ├── stack.ts               # Implementação de Pilha
│   │   ├── queue.ts               # Implementação de Fila
│   │   ├── graph.ts               # Implementação de Grafo
│   │   └── animation.ts           # Controle de velocidade
│   └── test/
│       ├── setup.ts               # Setup do Vitest
│       ├── bst.test.ts            # Testes da BST
│       ├── stack.test.ts          # Testes da Pilha
│       ├── queue.test.ts          # Testes da Fila
│       └── graph.test.ts          # Testes do Grafo
└── README.md                      # Documentação
```

---

## 11. Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais informações.

---

Desenvolvido por L. A. Leandro - São José dos Campos - SP - 18/05/2026
