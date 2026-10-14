# Planejamento das correções obrigatórias

## Objetivo

Corrigir os 2 itens obrigatórios da avaliação:

1. Total do carrinho
2. Produtos esgotados

Sem alterar os itens do Grupo 1 e Grupo 2 por enquanto.

---

## 1) Total do carrinho

### Arquivo principal

- src/utils/carrinho.js

### Problema observado

Os testes locais mostraram que o total pode ficar errado quando o valor do produto não é tratado como número válido antes da soma.

O problema real não é só a soma em si; é a conversão e a validação do dado antes do cálculo.

Casos que devem ser tratados:

- `price` em string
- `price` em valor nulo ou vazio
- produto sem preço definido
- item do carrinho com quantidade/estrutura diferente

Isso pode gerar totais como:

- 0,00 em uma compra que deveria somar valor
- 49,90 em uma compra parcial

### Correção recomendada

A lógica deve converter o valor para número antes de somar e descartar itens que não possam ser vendidos.

Regra prática:

- aceitar apenas itens com preço numérico e positivo
- converter `price` para `Number(price)` antes da soma
- ignorar produtos sem preço definido
- manter a soma consistente com a quantidade real do item no carrinho

### Estado atual

A correção foi aplicada na lógica do carrinho e na prevenção de compra para itens sem preço válido.

---

## 2) Produtos esgotados

### Arquivos principais

- src/pages/Loja.jsx
- src/pages/PaginaProduto.jsx
- src/pages/Estoque.jsx
- src/App.jsx

### Requisito do enunciado

O enunciado exige dois comportamentos para estoques zerados:

1. Produto esgotado não aparece mais na loja
2. Cliente que chega por link direto ainda consegue pedir aviso quando voltar
3. Área interna registra quem está esperando cada produto, com nome e e-mail

### Correção planejada

#### A) Loja principal

A vitrine deve remover produtos com `estoque === 0` da grade principal.

```js
const produtosVisiveis = produtos.filter((produto) => produto.estoque > 0)
```

Além disso, o produto sem preço também deve ser removido da loja principal, porque ele também é não vendável.

```js
const precoValido =
  Number.isFinite(Number(produto && produto.price)) && Number(produto.price) > 0

const produtosVisiveis = produtos.filter(
  (produto) => produto.estoque > 0 && precoValido
)
```

#### B) Página do produto esgotado

A página do produto deve continuar acessível por URL direta mesmo quando `estoque === 0`.

Nessa tela, o comportamento esperado é:

- exibir que o produto está esgotado
- mostrar um formulário para nome e e-mail
- permitir o cadastro na lista de espera

#### C) Área interna / estoque

A área de estoque precisa mostrar o status real de cada item:

- `Esgotado` quando `estoque === 0`
- `Sem preço` quando o preço não está definido ou é inválido
- `Repor` quando `estoque > 0 && estoque < 5`
- `OK` quando `estoque >= 5` e o produto é comercializável

Além disso, deve aparecer a lista de clientes esperando para cada produto, com nome e e-mail.

#### D) Estado do produto em memória

Para manter em app real, o ideal é ter um estado central de espera por produto, por exemplo:

```js
const [listaEspera, setListaEspera] = useState({})
```

Onde a chave seria o `id` do produto e o valor seria um array com:

```js
{ nome: 'Maria', email: 'maria@email.com' }
```

Isso permite:

- mostrar a fila de espera por produto
- manter o estado ao longo da sessão
- representar a demanda interna do time de estoque

---

## Pontos importantes para manter em mente

### 1. Não misturar regras diferentes

- `estoque === 0` = esgotado
- `price` ausente/inválido = sem preço
- ambos devem ser tratados como situações diferentes e separadas

### 2. O produto esgotado não sumirá do sistema

Ele deve sumir da vitrine, mas continuar acessível por link direto e com funcionalidade de aviso.

### 3. O time de estoque precisa enxergar o problema corretamente

Na área interna, o status deve refletir:

- esgotado
- sem preço
- repor
- OK

### 4. A regra de preços pendentes continua separada

A regra de sem preço é diferente da regra de esgotado. Ela foi tratada no primeiro obrigatório e continua separada no segundo.

---

## Status do planejamento

- [x] Revisão do problema do total do carrinho
- [x] Revisão do problema de produtos esgotados
- [x] Separação da regra de sem preço da regra de esgotado
- [x] Registro do fluxo de lista de espera
- [x] Documento atualizado para acompanhamento
- [ ] Correção do segundo item obrigatório
- [ ] Validação final em execução
