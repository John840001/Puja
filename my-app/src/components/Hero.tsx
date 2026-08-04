import { NAMES, START_DATE, BIKE_NAME } from "../data";

function daysTogether() {
  const start = new Date(START_DATE + "T00:00:00");
  const now = new Date();
  const diff = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  return diff;
}

export default function Hero() {
  const days = daysTogether();
  return (
    <div className="hero">
      <svg className="dangle" viewBox="0 0 64 64" fill="none">
        <path
          d="M32 4 C20 4 12 14 12 26 C12 40 32 58 32 58 C32 58 52 40 52 26 C52 14 44 4 32 4 Z"
          fill="#f5abc9"
        />
        <circle cx="32" cy="26" r="9" fill="#fff" />
        <path d="M27 26a5 5 0 0 1 5-5" stroke="#f5abc9" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="eyebrow">
        {NAMES.him} &amp; {NAMES.her}
      </div>
      <h1>
        One Year
        <br />
        of <span className="amp">Us</span>
      </h1>
      <div className="sub">
        Bike rides on {BIKE_NAME}, biryani debates, and too much ice cream.
      </div>

      <div className="counter">
        <span className="num">{days}</span>
        <span className="label">
          days of
          <br />
          choosing
          <br />
          each other
        </span>
      </div>

      <div className="bike-strip">
        <div className="road"></div>
        <svg className="bike" viewBox="0 0 100 60" fill="none">
          <circle cx="22" cy="46" r="11" stroke="#3a2e3d" strokeWidth="3" />
          <circle cx="78" cy="46" r="11" stroke="#3a2e3d" strokeWidth="3" />
          <path
            d="M22 46L40 26H60L78 46"
            stroke="#3a2e3d"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M40 26L48 46" stroke="#3a2e3d" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 20H70" stroke="#3a2e3d" strokeWidth="3" strokeLinecap="round" />
          <circle cx="60" cy="20" r="3" fill="#ec80ab" />
        </svg>
        <div className="caption">{BIKE_NAME}, somewhere on a long road</div>
      </div>
    </div>
  );
}
