import { useReveal } from '../hooks/useReveal'
import './HeroGraphic.css'

// Spine: the core "research becomes product" flow — gets the traveling packets.
const SPINE_NODES = [
  { id: 'research', x: 70, y: 268, r: 32, label: 'Research' },
  { id: 'agent', x: 372, y: 262, r: 46, label: 'Agent', hub: true },
  { id: 'product', x: 654, y: 256, r: 50, label: 'Product', dest: true },
]

const SPINE_EDGES = [
  { id: 's1', d: 'M70,268 C170,268 240,264 372,262' },
  { id: 's2', d: 'M372,262 C470,260 560,258 654,256' },
]

// Satellites: the domains this work actually spans — orbiting the Agent hub.
const SATELLITES = [
  { id: 'agentic-ai', x: 190, y: 96, r: 23, label: 'Agentic AI' },
  { id: 'genai', x: 320, y: 52, r: 21, label: 'Generative AI' },
  { id: 'rag', x: 462, y: 58, r: 19, label: 'RAG' },
  { id: 'xai', x: 566, y: 108, r: 19, label: 'Explainable AI' },
  { id: 'automation', x: 210, y: 448, r: 21, label: 'Automation' },
  { id: 'fullstack', x: 350, y: 482, r: 21, label: 'Full Stack' },
  { id: 'product-gtm', x: 500, y: 452, r: 21, label: 'Product & GTM' },
]

const HUB = SPINE_NODES[1]

function curveTo(sat) {
  const midX = (HUB.x + sat.x) / 2
  const midY = (HUB.y + sat.y) / 2 + (sat.y < HUB.y ? -18 : 18)
  return `M${HUB.x},${HUB.y} Q${midX},${midY} ${sat.x},${sat.y}`
}

export default function HeroGraphic() {
  const ref = useReveal({ threshold: 0.25 })

  return (
    <div className="hero-graphic" ref={ref} aria-hidden="true">
      <svg
        className="hero-graphic__svg"
        viewBox="0 0 720 520"
        preserveAspectRatio="xMidYMid meet"
      >
        <g className="hero-graphic__branches">
          {SATELLITES.map((sat, i) => (
            <path
              key={sat.id}
              className="hg-branch"
              d={curveTo(sat)}
              style={{ transitionDelay: `${1100 + i * 90}ms` }}
            />
          ))}
        </g>

        <g className="hero-graphic__edges">
          {SPINE_EDGES.map((edge, i) => (
            <path
              key={edge.id}
              className="hg-edge"
              d={edge.d}
              style={{ transitionDelay: `${i * 420}ms` }}
            />
          ))}
        </g>

        <g className="hero-graphic__packets">
          {SPINE_EDGES.map((edge, i) => (
            <circle
              key={edge.id}
              r="4"
              className="hg-packet"
              style={{
                offsetPath: `path('${edge.d}')`,
                animationDelay: `${900 + i * 700}ms`,
              }}
            />
          ))}
        </g>

        <g className="hero-graphic__satellites">
          {SATELLITES.map((sat, i) => (
            <g key={sat.id} transform={`translate(${sat.x},${sat.y})`}>
              <g
                className="hg-node hg-node--satellite"
                style={{ transitionDelay: `${1250 + i * 110}ms`, animationDelay: `${2400 + i * 240}ms` }}
              >
                <circle r={sat.r} />
              </g>
              <text className="hg-label hg-label--sat" y={sat.r + 16} textAnchor="middle" style={{ transitionDelay: `${1500 + i * 110}ms` }}>
                {sat.label}
              </text>
            </g>
          ))}
        </g>

        <g className="hero-graphic__nodes">
          {SPINE_NODES.map((node, i) => (
            <g key={node.id} transform={`translate(${node.x},${node.y})`}>
              <g
                className={`hg-node ${node.hub ? 'hg-node--hub' : ''} ${node.dest ? 'hg-node--dest' : ''}`}
                style={{ transitionDelay: `${i * 260}ms`, animationDelay: `${1600 + i * 260}ms` }}
              >
                <circle r={node.r} />
              </g>
              <text className="hg-label" y={node.r + 20} textAnchor="middle" style={{ transitionDelay: `${300 + i * 260}ms` }}>
                {node.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
