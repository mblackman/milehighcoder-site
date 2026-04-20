// Efraimidis-Spirakis A-Res weighted reservoir sampling.
// Pick top-K rows by key = random()^(1/weight). One pass, O(n log K).
export function weightedSample(rows, k, weightFn = r => r.w) {
  if (rows.length <= k) return rows.slice();
  const heap = []; // min-heap by key, kept at size k
  for (const row of rows) {
    const w = Math.max(weightFn(row), 1e-9);
    const u = Math.random();
    const key = Math.pow(u, 1 / w);
    if (heap.length < k) {
      heap.push({ key, row });
      siftUp(heap, heap.length - 1);
    } else if (key > heap[0].key) {
      heap[0] = { key, row };
      siftDown(heap, 0);
    }
  }
  return heap.map(h => h.row);
}

function siftUp(h, i) {
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (h[p].key <= h[i].key) break;
    [h[p], h[i]] = [h[i], h[p]];
    i = p;
  }
}

function siftDown(h, i) {
  const n = h.length;
  for (;;) {
    const l = 2 * i + 1, r = 2 * i + 2;
    let m = i;
    if (l < n && h[l].key < h[m].key) m = l;
    if (r < n && h[r].key < h[m].key) m = r;
    if (m === i) break;
    [h[m], h[i]] = [h[i], h[m]];
    i = m;
  }
}
