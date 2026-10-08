/**
 * Importação única: Excel → Supabase
 * Uso: node --env-file=.env.local scripts/importar-excel.mjs
 *
 * Lê a planilha Gerenciamento_Planejamento_Instalacao_Volga.xlsx
 * e insere:
 *  - Aba Carteira  → public.obras  (upsert por código)
 *  - Aba Histórico → public.eventos (delete + insert — rodar 1x)
 */
import { createClient } from '@supabase/supabase-js'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const XLSX = require('xlsx')

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const caminhoXlsx = join(root, 'Gerenciamento_Planejamento_Instalacao_Volga.xlsx')

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!URL || !KEY) {
  console.error('❌ Rode com: node --env-file=.env.local scripts/importar-excel.mjs')
  process.exit(1)
}

const supabase = createClient(URL, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// ─── helpers ───────────────────────────────────────────
const txt = (v) => {
  if (v === undefined || v === null) return null
  const s = String(v).trim()
  return s === '' || s === '—' ? null : s
}

const dt = (v) => {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  return null
}

// ─── main ──────────────────────────────────────────────
async function main() {
  console.log('📂 Lendo', caminhoXlsx)
  const wb = XLSX.readFile(caminhoXlsx, { cellDates: true })

  // ═══════════════════════════════════════════════════
  // 1) CARTEIRA → obras
  // ═══════════════════════════════════════════════════
  const carteira = XLSX.utils.sheet_to_json(wb.Sheets['Carteira'], {
    header: 1,
    range: 4, // começa da linha 5 (índice 4)
    defval: null,
  })

  const obras = []
  for (const r of carteira) {
    const codigo = txt(r[0])
    if (!codigo || !/^\d+$/.test(codigo)) continue

    const mobil = r[8]
    const dataMob = dt(mobil)
    const textoMob = dataMob ? null : txt(mobil)

    obras.push({
      codigo,
      cliente: txt(r[1]),
      pm_nome: txt(r[2]),
      origem_demanda: txt(r[3]),
      situacao_cronograma: txt(r[5]),
      cadencia_reuniao: txt(r[6]),
      agenda_reuniao: txt(r[7]),
      data_mobilizacao: dataMob,
      mobilizacao_texto: textoMob,
      situacao_mobilizacao: txt(r[9]),
      status: txt(r[13]) ?? 'Não avaliado',
      pendencia: txt(r[14]),
      resumo_executivo: txt(r[15]),
    })
  }
  console.log(`  📊 ${obras.length} obras`)

  const { error: e1 } = await supabase
    .from('obras')
    .upsert(obras, { onConflict: 'codigo' })
  if (e1) throw e1
  console.log(`  ✅ obras upsertadas`)

  // ─── mapa codigo → id ───────────────────────────────
  const { data: existentes, error: e2 } = await supabase
    .from('obras')
    .select('id, codigo')
  if (e2) throw e2
  const idDe = Object.fromEntries(existentes.map((o) => [o.codigo, o.id]))

  // ═══════════════════════════════════════════════════
  // 2) HISTÓRICO → eventos
  // ═══════════════════════════════════════════════════
  const hist = XLSX.utils.sheet_to_json(wb.Sheets['Histórico'], {
    header: 1,
    range: 4,
    defval: null,
  })

  const eventos = []
  for (const r of hist) {
    const codigo = txt(r[1])
    if (!codigo || !idDe[codigo]) continue
    const tipo = txt(r[3])
    if (!tipo) continue

    eventos.push({
      obra_id: idDe[codigo],
      data_evento: dt(r[0]), // pode ser null
      tipo_evento: tipo,
      descricao: txt(r[4]),
    })
  }
  console.log(`  📅 ${eventos.length} eventos`)

  // apaga eventos existentes para evitar duplicação
  const { error: e3 } = await supabase
    .from('eventos')
    .delete()
    .in('obra_id', Object.values(idDe))
  if (e3) throw e3

  const { error: e4 } = await supabase.from('eventos').insert(eventos)
  if (e4) throw e4
  console.log(`  ✅ eventos inseridos`)

  console.log('\n🎉 Importação concluída')
}

main().catch((err) => {
  console.error('\n❌ Erro na importação:')
  console.error(err)
  process.exit(1)
})