import { Link, useParams } from 'react-router'
import { useMemo, useState } from 'react'
import ProdutoCard from '../components/ProdutoCard'
import { formatarPreco } from '../utils/formatarPreco'
import { getStatusFrete } from '../utils/frete'

export default function PaginaProduto({ produtos, onAdicionar, listaEspera = {}, onRegistrarInteresse }) {
  const { id } = useParams()
  const [form, setForm] = useState({ nome: '', email: '' })
  const [mensagem, setMensagem] = useState('')
  const [adicionado, setAdicionado] = useState(false)
  const [adicionadosRelacionados, setAdicionadosRelacionados] = useState({})

  const produto = produtos.find((item) => Number(item.id) === Number(id))

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const precoValido =
    Number.isFinite(Number(produto && produto.price)) && Number(produto.price) > 0
  const produtoEsgotado = produto.estoque === 0 && precoValido
  const produtoSemPreco = !precoValido
  const statusFrete = getStatusFrete(produto.price)

  const relacionados = useMemo(
    () =>
      produtos
        .filter((item) => {
          const itemPrecoValido =
            Number.isFinite(Number(item && item.price)) && Number(item.price) > 0

          return (
            item.category === produto.category &&
            item.id !== produto.id &&
            item.estoque > 0 &&
            itemPrecoValido
          )
        })
        .slice(0, 4),
    [produto.category, produto.id, produtos]
  )

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.nome.trim() || !form.email.trim()) {
      setMensagem('Preencha nome e e-mail para receber o aviso.')
      return
    }

    onRegistrarInteresse?.(produto.id, form.nome.trim(), form.email.trim())
    setForm({ nome: '', email: '' })
    setMensagem('Você entrou na lista de espera. Vamos avisar quando o produto voltar!')
  }

  function handleAdicionarAoCarrinho() {
    onAdicionar(produto)
    setAdicionado(true)
    window.setTimeout(() => setAdicionado(false), 1200)
  }

  function handleAdicionarRelacionado(item) {
    onAdicionar(item)
    setAdicionadosRelacionados((atual) => ({
      ...atual,
      [item.id]: true,
    }))
    window.setTimeout(() => {
      setAdicionadosRelacionados((atual) => ({
        ...atual,
        [item.id]: false,
      }))
    }, 1200)
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {produtoSemPreco ? 'Preço indisponível' : formatarPreco(produto.price)}
          </p>
          {!produtoSemPreco && (
            <p className={statusFrete.tipo === 'gratis' ? 'detalhe-frete detalhe-frete-gratis' : 'detalhe-frete'}>
              {statusFrete.texto}
            </p>
          )}
          <p className="detalhe-descricao">{produto.description}</p>

          {produtoSemPreco ? (
            <p className="detalhe-estoque">Produto indisponível no momento</p>
          ) : (
            <p className="detalhe-estoque">
              {produto.estoque === 0 ? 'Esgotado' : `${produto.estoque} unidades disponíveis`}
            </p>
          )}

          {!produtoSemPreco && (
            <button
              className="botao botao-grande"
              onClick={handleAdicionarAoCarrinho}
              disabled={produto.estoque === 0 || !precoValido}
            >
              {produto.estoque === 0
                ? 'Esgotado'
                : adicionado
                  ? 'Adicionado'
                  : 'Adicionar ao carrinho'}
            </button>
          )}

          {produtoSemPreco && (
            <button className="botao botao-grande" disabled>
              Produto indisponível
            </button>
          )}

          {produtoEsgotado && (
            <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
              <h2>Avise-me quando voltar</h2>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={form.nome}
                  onChange={(event) => setForm((atual) => ({ ...atual, nome: event.target.value }))}
                />
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  value={form.email}
                  onChange={(event) => setForm((atual) => ({ ...atual, email: event.target.value }))}
                />
                <button type="submit" className="botao botao-secundario">
                  Quero ser avisado
                </button>
              </div>
              {mensagem && <p style={{ marginTop: '0.75rem' }}>{mensagem}</p>}
            </form>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.length === 0 ? (
          <p>Não há produtos relacionados disponíveis no momento.</p>
        ) : (
          relacionados.map((item) => (
            <ProdutoCard
              key={item.id}
              produto={item}
              onAdicionar={() => handleAdicionarRelacionado(item)}
            />
          ))
        )}
      </div>
    </section>
  )
}
