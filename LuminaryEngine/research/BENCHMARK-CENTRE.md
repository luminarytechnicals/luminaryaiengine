# Luminary AI Engine — Benchmark Centre

The benchmark workflow separates **blind human evaluation** from model identity and complements the existing deterministic AutoTune/research evaluation scripts.

## Prepare candidate responses

Create a UTF-8 JSONL file with one object per model response:

```json
{"prompt_id":"case-001","model":"provider/model-a","output":"Candidate response A"}
{"prompt_id":"case-001","model":"provider/model-b","output":"Candidate response B"}
```

Use the same prompt, context and generation constraints for every model being compared. Do not mix candidates from different prompt cases.

## Generate a blind reviewer pack

From `LuminaryEngine/`:

```bash
npm run benchmark:blind -- research/candidates.jsonl research/blind-run-001
```

This writes:
- `research/blind-run-001.ballots.json` — shuffled candidate outputs with opaque IDs and no model labels. Share this file with reviewers.
- `research/blind-run-001.private-key.json` — candidate-to-model mapping. Keep this file private until ratings are locked.

The private key is written with owner-only permissions where supported. Do not commit either generated file or place the private key in a public artifact.

## Rating rubric

Reviewers should score each candidate from 0–100 using the same rubric:
- Correctness and factual reliability: 0–30
- Completeness and instruction adherence: 0–25
- Clarity and organization: 0–20
- Reasoning quality and useful detail: 0–15
- Calibration and appropriate uncertainty: 0–10

Reviewers should submit candidate IDs, scores and optional notes. Only after ratings are finalized should the private key be used to map scores back to model names. The `aggregateBlindRatings` helper computes mean scores per model.

## Existing automated evaluations

Run `npm test` for privacy redaction, blind-pack integrity and tier-cost ceiling checks. Existing `research/eval_*.ts` scripts remain the deterministic evaluation suite for AutoTune, Parseltongue, STM and scoring calibration.

## Limitations

This is a reproducible blind-review workflow, not a claim that model outputs are objectively ranked. Human ratings can still contain evaluator bias; use multiple independent reviewers and report sample size, rubric and disagreement. The cost estimator is indicative and depends on current OpenRouter catalogue prices.
