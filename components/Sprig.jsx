// The signature graphic: the logo's ring, scrollwork and coffee-cherry
// branch, redrawn as a lightweight line-art SVG divider. Used sparingly —
// once per page, never as a repeating decorative pattern.
export default function Sprig({
  className = "",
  tone = "brass", // brass | cream | teal
  flourish = true,
}) {
  const stroke =
    tone === "cream" ? "#E8DFC8" : tone === "teal" ? "#0B6E7C" : "#C9A667";

  return (
    <svg
      viewBox="0 0 400 60"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {/* left scroll */}
      <path
        d="M0 30 H130"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {flourish && (
        <path
          d="M130 30c0-9-8-14-16-14s-14 6-14 13 6 11 12 11 9-4 9-8-3-6-6-6"
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      )}

      {/* right scroll (mirrored) */}
      <path
        d="M400 30 H270"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {flourish && (
        <path
          d="M270 30c0-9 8-14 16-14s14 6 14 13-6 11-12 11-9-4-9-8 3-6 6-6"
          stroke={stroke}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      )}

      {/* center ring */}
      <circle
        cx="200"
        cy="24"
        r="17"
        stroke={stroke}
        strokeWidth="1.4"
      />

      {/* coffee branch inside the ring */}
      <path
        d="M200 34c0-14 -2-19 -2-22"
        stroke="#4C8C4A"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M198 24c-4-1-7-4-7-8"
        stroke="#4C8C4A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M200 20c4-1 7-4 7-8"
        stroke="#4C8C4A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="191" cy="17" r="2.3" fill="#B23A2E" />
      <circle cx="209" cy="13" r="2.3" fill="#B23A2E" />

      {/* base rule under the ring, echoing the wordmark banner */}
      <path
        d="M150 46 Q200 54 250 46"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
