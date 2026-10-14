import { formatarPreco } from './formatarPreco'

export const VALOR_MINIMO_FRETE_GRATIS = 200

export function getStatusFrete(valor) {
  const valorNumerico = Number(valor)

  if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
    return {
      tipo: 'indisponivel',
      texto: 'Frete não disponível',
    }
  }

  if (valorNumerico >= VALOR_MINIMO_FRETE_GRATIS) {
    return {
      tipo: 'gratis',
      texto: 'Frete grátis',
    }
  }

  const restante = VALOR_MINIMO_FRETE_GRATIS - valorNumerico

  return {
    tipo: 'faltando',
    texto: `Faltam ${formatarPreco(restante)} para ganhar frete grátis`,
  }
}
