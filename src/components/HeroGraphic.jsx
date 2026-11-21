import { useEffect, useRef, useState } from 'react'
import './HeroGraphic.css'

// The story: a CS seed grows into Web Dev, curiosity pulls it into AI & RAG,
// more curiosity opens it up into the full crown. "curiosity" is an edge label,
// not a node. Coordinates are in a 640 x 680 space (the viewBox crops the empty top).
const CX = 320
const GROUND_Y = 668
const SEED = { x: CX, y: 640, r: 24 }
const NODES = [
  { id: 'webdev', y: 558, r: 44, label: 'Web Dev', at: 900 },
  { id: 'ai-rag', y: 422, r: 48, label: 'AI & RAG', at: 1750 },
]
const CROWN_FROM = 326 // trunk height where the first branch leaves
const CROWN_TO = 62 // top of the trunk

// The trunk leans gently left and right as it climbs, straight at the base.
const trunkX = (y) =>
  CX + 8 * Math.min(Math.max((600 - y) / 200, 0), 1) * Math.sin(y / 48)

function trunkPath(from, to) {
  const step = from > to ? -8 : 8
  let d = `M${trunkX(from).toFixed(1)},${from}`
  for (let y = from + step; step < 0 ? y > to : y < to; y += step) {
    d += ` L${trunkX(y).toFixed(1)},${y}`
  }
  return `${d} L${trunkX(to).toFixed(1)},${to}`
}

// Trunk segments in growth order, thicker at the base. `at`/`ms` are in ms.
const SEGMENTS = [
  { id: 'stem', from: SEED.y - SEED.r, to: NODES[0].y + NODES[0].r, at: 500, ms: 400, w: 4.5 },
  { id: 'curiosity', from: NODES[0].y - NODES[0].r, to: NODES[1].y + NODES[1].r, at: 1300, ms: 450, w: 4 },
  { id: 'more-curiosity', from: NODES[1].y - NODES[1].r, to: CROWN_FROM, at: 2250, ms: 400, w: 3.4 },
]
const CROWN_AT = 2750
const CROWN_MS = 1300
const CROWN_LEN = CROWN_FROM - CROWN_TO
const GROWN_AT = CROWN_AT + CROWN_MS + 900 // when everything has settled

// The words riding on the two edges.
const EDGE_LABELS = [
  { text: 'curiosity', x: trunkX(492) + 14, y: 492, anchor: 'start', at: 1550 },
  { text: 'more curiosity', x: trunkX(350) - 14, y: 350, anchor: 'end', at: 2450 },
]

// One leaf per area of work, none overlapping in meaning. They alternate right
// and left, climbing the trunk in the order they grow. `sy` is where the branch
// leaves the trunk; the leaf attaches at (ex, sy - RISE). A label may be two lines.
const LEAVES = [
  { id: 'agentic', label: ['Agentic AI'], side: 1, sy: 326, ex: 380 },
  { id: 'ml', label: ['Machine Learning'], side: -1, sy: 302, ex: 266 },
  { id: 'nlp', label: ['NLP'], side: 1, sy: 278, ex: 388 },
  { id: 'rl', label: ['RL'], side: -1, sy: 254, ex: 258 },
  { id: 'xai', label: ['Explainable AI'], side: 1, sy: 230, ex: 376 },
  { id: 'data', label: ['Data & Analytics'], side: -1, sy: 206, ex: 270 },
  { id: 'automation', label: ['Automation'], side: 1, sy: 182, ex: 390 },
  { id: 'cloud', label: ['Cloud & Backend'], side: -1, sy: 158, ex: 256 },
  { id: 'product', label: ['Product & GTM'], side: 1, sy: 134, ex: 382 },
  { id: 'ux', label: ['UX'], side: -1, sy: 110, ex: 262 },
  { id: 'research', label: ['Research'], side: 1, sy: 86, ex: 386 },
]

const LEAF_LEN = 50
const RISE = 24 // how far above its branch start a leaf attaches

// Pointed leaf: base at the origin, tip at (LEAF_LEN, 0), and a midrib.
const LEAF_PATH = `M0,0 C${LEAF_LEN * 0.22},-${LEAF_LEN * 0.3} ${LEAF_LEN * 0.72},-${LEAF_LEN * 0.3} ${LEAF_LEN},0 C${LEAF_LEN * 0.72},${LEAF_LEN * 0.3} ${LEAF_LEN * 0.22},${LEAF_LEN * 0.3} 0,0 Z`
const VEIN_PATH = `M3,0 L${LEAF_LEN * 0.82},0`

// Lower leaves are a little larger and flatter, upper ones smaller and steeper.
function leafGeometry(leaf, index) {
  const angle = 34 + (index % 3) * 6 // degrees above horizontal
  const scale = 1.12 - index * 0.03
  const rad = (angle * Math.PI) / 180
  const ey = leaf.sy - RISE
  return {
    ey,
    angle,
    scale,
    tipX: leaf.ex + leaf.side * Math.cos(rad) * LEAF_LEN * scale,
    tipY: ey - Math.sin(rad) * LEAF_LEN * scale,
  }
}

function branchPath({ side, sy, ex }, ey) {
  const tx = trunkX(sy)
  return `M${tx.toFixed(1)},${sy} C${(tx + side * 34).toFixed(1)},${sy + 2} ${ex - side * 26},${ey + 30} ${ex},${ey}`
}

const SAP_PATH = trunkPath(SEED.y - SEED.r, CROWN_TO)

// Eases --px/--py (-1..1) toward the cursor so labels can drift slightly in CSS.
function useCursorDepth() {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || calm) return

    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let raf = 0

    const tick = () => {
      current.x += (target.x - current.x) * 0.06
      current.y += (target.y - current.y) * 0.06
      node.style.setProperty('--px', current.x.toFixed(4))
      node.style.setProperty('--py', current.y.toFixed(4))
      const settled =
        Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001
      raf = settled ? 0 : requestAnimationFrame(tick)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onMove = (e) => {
      const r = node.getBoundingClientRect()
      target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2))
      target.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2))
      kick()
    }
    const onLeave = () => {
      target.x = 0
      target.y = 0
      kick()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return ref
}

// True once the element has scrolled into view, so the growth is never played
// off-screen (on phones the plant sits below the copy).
function useSeen() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, seen]
}

export default function HeroGraphic({ active = false }) {
  const ref = useCursorDepth()
  const [seenRef, seen] = useSeen()

  return (
    <div
      className={`hero-graphic ${active && seen ? 'is-visible' : ''}`}
      ref={(node) => {
        ref.current = node
        seenRef.current = node
      }}
      aria-hidden="true"
    >
      <svg
        className="hero-graphic__svg"
        viewBox="0 18 640 660"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ground, and a ripple when the seed sprouts */}
        <line
          className="hg-ground"
          x1={CX - 110}
          x2={CX + 110}
          y1={GROUND_Y}
          y2={GROUND_Y}
        />
        <ellipse
          className="hg-ripple"
          cx={CX}
          cy={GROUND_Y}
          rx="70"
          ry="7"
          style={{ '--delay': '450ms' }}
        />

        {/* trunk: seed -> Web Dev -> AI & RAG -> crown */}
        {SEGMENTS.map((seg) => (
          <path
            key={seg.id}
            className="hg-draw hg-trunk"
            pathLength="1"
            d={trunkPath(seg.from, seg.to)}
            style={{ '--delay': `${seg.at}ms`, '--dur': `${seg.ms}ms`, strokeWidth: seg.w }}
          />
        ))}
        <path
          className="hg-draw hg-trunk"
          pathLength="1"
          d={trunkPath(CROWN_FROM, CROWN_TO)}
          style={{ '--delay': `${CROWN_AT}ms`, '--dur': `${CROWN_MS}ms`, strokeWidth: 2.6 }}
        />

        {/* sap: a slow pulse of light rising from the seed once it has grown */}
        <circle
          className="hg-sap"
          r="3.5"
          style={{
            offsetPath: `path('${SAP_PATH}')`,
            '--delay': `${GROWN_AT}ms`,
          }}
        />

        {/* bud at the top */}
        <circle
          className="hg-bud"
          cx={trunkX(CROWN_TO)}
          cy={CROWN_TO}
          r="6"
          style={{ '--delay': `${CROWN_AT + CROWN_MS - 200}ms` }}
        />

        {/* words on the edges */}
        {EDGE_LABELS.map((e) => (
          <text
            key={e.text}
            className="hg-edge-label"
            x={e.x}
            y={e.y}
            textAnchor={e.anchor}
            dominantBaseline="central"
            style={{ '--delay': `${e.at}ms` }}
          >
            {e.text}
          </text>
        ))}

        {/* leaves */}
        {LEAVES.map((leaf, i) => {
          const grown = CROWN_AT + ((CROWN_FROM - leaf.sy) / CROWN_LEN) * CROWN_MS
          const { ey, angle, scale, tipX, tipY } = leafGeometry(leaf, i)
          const rotation = leaf.side > 0 ? -angle : -(180 - angle)
          const lines = leaf.label
          return (
            <g className="hg-leafgroup" key={leaf.id}>
              <path
                className="hg-draw hg-branch"
                pathLength="1"
                d={branchPath(leaf, ey)}
                style={{
                  '--delay': `${grown}ms`,
                  '--dur': '560ms',
                  strokeWidth: 2.2 - i * 0.06,
                }}
              />
              <g transform={`translate(${leaf.ex},${ey}) rotate(${rotation}) scale(${scale})`}>
                <g className="hg-sway" style={{ '--delay': `${grown + 420}ms` }}>
                  <g className="hg-leafbody" style={{ '--delay': `${grown + 420}ms` }}>
                    <path className="hg-leaf" d={LEAF_PATH} />
                    <path className="hg-vein" d={VEIN_PATH} />
                  </g>
                </g>
              </g>
              <text
                className="hg-label"
                x={tipX + leaf.side * 10}
                y={tipY}
                textAnchor={leaf.side > 0 ? 'start' : 'end'}
                dominantBaseline="central"
                style={{ '--delay': `${grown + 780}ms` }}
              >
                {lines.map((line, li) => (
                  <tspan
                    key={line}
                    x={tipX + leaf.side * 10}
                    dy={lines.length === 1 ? 0 : li === 0 ? '-0.6em' : '1.2em'}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          )
        })}

        {/* nodes on the trunk: ring draws, fill and label follow, one soft pulse */}
        {NODES.map((n) => {
          const nx = trunkX(n.y)
          return (
            <g className="hg-node" key={n.id} style={{ '--delay': `${n.at}ms` }}>
              <circle className="hg-disc" cx={nx} cy={n.y} r={n.r} />
              <circle
                className="hg-draw hg-ring"
                pathLength="1"
                cx={nx}
                cy={n.y}
                r={n.r}
                transform={`rotate(-90 ${nx} ${n.y})`}
                style={{ '--dur': '700ms' }}
              />
              <circle className="hg-pulse" cx={nx} cy={n.y} r={n.r} />
              <text
                className="hg-node-text"
                x={nx}
                y={n.y}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {n.label}
              </text>
            </g>
          )
        })}

        {/* seed, half buried in a mound of soil */}
        <g className="hg-seed">
          <circle cx={SEED.x} cy={SEED.y} r={SEED.r} />
          <text x={SEED.x} y={SEED.y} textAnchor="middle" dominantBaseline="central">
            CS
          </text>
        </g>
        <path
          className="hg-mound"
          d={`M${CX - 84},${GROUND_Y} C${CX - 50},${GROUND_Y} ${CX - 40},${GROUND_Y - 18} ${CX},${GROUND_Y - 18} C${CX + 40},${GROUND_Y - 18} ${CX + 50},${GROUND_Y} ${CX + 84},${GROUND_Y}`}
        />
      </svg>
    </div>
  )
}
