import { readFile, writeFile, chmod } from 'node:fs/promises'
import { createBlindPack } from './blind-evaluation'

async function main() {
  const inputPath = process.argv[2]
  const outputPrefix = process.argv[3] || 'blind-benchmark'
  if (!inputPath) {
    console.error('Usage: npm run benchmark:blind -- <candidates.jsonl> [output-prefix]')
    process.exitCode = 2
    return
  }

  const raw = await readFile(inputPath, 'utf8')
  const candidates = raw.split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line))
  const pack = createBlindPack(candidates)
  const { private_key, ...publicPack } = pack
  await writeFile(`${outputPrefix}.ballots.json`, JSON.stringify(publicPack, null, 2), 'utf8')
  const keyPath = `${outputPrefix}.private-key.json`
  await writeFile(keyPath, JSON.stringify(private_key, null, 2), { encoding: 'utf8', mode: 0o600 })
  await chmod(keyPath, 0o600)
  console.log(`Created ${publicPack.ballots.length} blinded candidates.`)
  console.log(`Reviewer pack: ${outputPrefix}.ballots.json`)
  console.log(`Private key (keep confidential): ${keyPath}`)
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
