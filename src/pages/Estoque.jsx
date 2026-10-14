// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos, listaEspera = {} }) {
  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)

  const getStatus = (produto) => {
    const precoValido =
      Number.isFinite(Number(produto && produto.price)) && Number(produto.price) > 0

    if (!precoValido) {
      return <span className="selo selo-alerta">Sem preço</span>
    }

    if (produto.estoque === 0) {
      return <span className="selo selo-esgotado">Esgotado</span>
    }

    if (produto.estoque < 5) {
      return <span className="selo selo-alerta">Repor</span>
    }

    return <span className="selo selo-ok">OK</span>
  }

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
              <th>Lista de espera</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => {
              const interessados = listaEspera[Number(produto.id)] || []

              return (
                <tr key={produto.id}>
                  <td>{produto.title}</td>
                  <td>{produto.category}</td>
                  <td>{produto.estoque}</td>
                  <td>{getStatus(produto)}</td>
                  <td>
                    {interessados.length === 0 ? (
                      <span>Nenhum</span>
                    ) : (
                      <ul>
                        {interessados.map((interessado) => (
                          <li key={interessado.id}>
                            {interessado.nome} — {interessado.email}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
