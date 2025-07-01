export default function MobileLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 120 32" xmlns="http://www.w3.org/2000/svg">
      <g
        fontFamily="'Poppins','Inter',sans-serif"
        fontSize={14}
        fontWeight={700}
        fill="#a855f7"
      >
        <text x={0} y={20}>C</text>
        <circle cx={14} cy={16} r={4} fill="#ff1744" />
        <text x={18} y={20}>N</text>
        <text x={28} y={20}>N</text>
        <text x={38} y={20}>E</text>
        <text x={48} y={20}>C</text>
        <text x={58} y={20}>T</text>
        <text x={66} y={20}>M</text>
        <circle cx={83} cy={16} r={4} fill="#ffd600" />
        <text x={88} y={20}>RE</text>
      </g>
    </svg>
  );
}