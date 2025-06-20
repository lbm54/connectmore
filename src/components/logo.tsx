/* components/Logo.tsx  —  place in src/components */
export default function Logo(props: React.SVGProps<SVGSVGElement>) {
    /* board geometry */
    const cols = [12, 24, 36, 48];  // x‑centres of 4 columns
    const rows = [15, 30, 45, 60];  // y‑centres (top→bottom)
  
    /* which rows will the yellow chips land on? (bottom‑left diag) */
    const diagTargets = [3, 2, 1, 0]; // row index for col 0‑3
  
    /* helper: return static chips that sit *below* each animated target */
    const staticChips = [];
    diagTargets.forEach((targetRow, col) => {
      for (let r = rows.length - 1; r > targetRow; r -= 1) {
        staticChips.push({
          cx: cols[col],
          cy: rows[r],
          color: (r + col) % 2 === 0 ? "url(#redPiece)" : "url(#yellowPiece)",
        });
      }
    });
  
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <svg {...props} viewBox="0 0 450 120" xmlns="http://www.w3.org/2000/svg">
        {/* ─── Paint definitions ─── */}
        <defs>
          <radialGradient id="redPiece" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#ff1744" />
            <stop offset="100%" stopColor="#d50000" />
          </radialGradient>
          <radialGradient id="yellowPiece" cx="50%" cy="30%">
            <stop offset="0%" stopColor="#ffd600" />
            <stop offset="100%" stopColor="#ff8f00" />
          </radialGradient>
          <linearGradient id="neonPurple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
  
          {/* glow filters only used in the mini board */}
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
  
        <rect width="450" height="120" fill="#000" />
  
        {/* ─── Mini 4×4 Connect‑Four board ─── */}
        <g transform="translate(350 20)">
          {/* frame */}
          <rect
            width={60}
            height={80}
            rx={8}
            fill="none"
            stroke="url(#neonPurple)"
            strokeWidth={2}
            filter="url(#neonGlow)"
          >
            <animate
              attributeName="stroke-width"
              values="2;3;2"
              dur="3s"
              repeatCount="indefinite"
            />
          </rect>
  
          {/* gray holes */}
          {rows.flatMap((cy) =>
            cols.map((cx) => (
              <circle key={`hole-${cx}-${cy}`} cx={cx} cy={cy} r={5} fill="#222" />
            ))
          )}
  
          {/* static red/yellow chips (provide the "stack") */}
          {staticChips.map(({ cx, cy, color }, i) => (
            <circle key={`static-${i}`} cx={cx} cy={cy} r={4} fill={color} />
          ))}
  
          {/* animated yellow chips building the diagonal */}
          {[0, 1, 2, 3].map((colIdx) => {
            const cx = cols[colIdx];
            const cyTarget = rows[diagTargets[colIdx]];
            const delay = 0.6 * colIdx;    // chips drop one‑by‑one
  
            /* timeline: drop (0‑1 s) → stay (1‑3 s) → reset (3‑4 s) */
            return (
              <circle
                key={`anim-${colIdx}`}
                cx={cx}
                cy={-10}
                r={4}
                fill="url(#yellowPiece)"
                filter="url(#softGlow)"
              >
                <animate
                  attributeName="cy"
                  values={`-10;${cyTarget};${cyTarget};-10`}
                  keyTimes="0;0.25;0.75;1"
                  dur="4s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}
        </g>
  
        {/* ─── CONNECTMORE word‑mark ─── */}
        <g
          fontFamily="'Poppins','Inter',sans-serif"
          fontSize={36}
          fontWeight={700}
          fill="url(#neonPurple)"
        >
          <text x={20}  y={70}>C</text>
          <circle cx={61} cy={57} r={13} fill="url(#redPiece)" />
          <text x={78}  y={70}>N</text>
          <text x={106} y={70}>N</text>
          <text x={134} y={70}>E</text>
          <text x={162} y={70}>C</text>
          <text x={190} y={70}>T</text>
          <text x={215} y={70}>M</text>
          <circle cx={263} cy={57} r={13} fill="url(#yellowPiece)" />
          {/* RE shifted a bit left */}
          <text x={281} y={70}>R</text>
          <text x={309} y={70}>E</text>
        </g>
      </svg>
    );
  }