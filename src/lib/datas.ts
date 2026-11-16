// dd/mm/aaaa no fuso de São Paulo (spec 001 do front, regra 8).
const formato = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'America/Sao_Paulo',
})

export const formatarData = (iso: string) => formato.format(new Date(iso))
