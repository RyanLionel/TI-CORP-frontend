import { expect, it } from 'vitest'
import { formatarData } from './datas'

it('CA-04, CA-06: datas em dd/mm/aaaa no fuso de São Paulo', () => {
  expect(formatarData('2026-12-04T13:00:00.000Z')).toBe('04/12/2026')
  // 01h UTC do dia 5 ainda é dia 4 em São Paulo (UTC-3)
  expect(formatarData('2026-12-05T01:00:00.000Z')).toBe('04/12/2026')
})
