import ConstellationMap from "@/components/ConstellationMap";

export default function Home() {
  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-mark">Aris</span>
          <span className="nav-status">
            <span className="status-dot" />
            1 device online
          </span>
          <div className="nav-links">
            <a href="#how">How it works</a>
            <a
              href="https://github.com/bitbyrizbit/aris-ai"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <main className="grid-shell">
        <section className="hero">
          <h1>Aris</h1>
          <div className="hero-meta">
            <p className="hero-tag">On-device AI network</p>
            <p className="body-copy">
              Devices converge and run the model together. No cloud
              inference, no central server - the computation happens
              where you are.
            </p>
          </div>
        </section>

        <section className="map-module">
          <div className="map-index">
            <span className="num">01</span>
            <span className="map-label">Connection map</span>
            <p className="body-copy">
              Live status of every device currently joined to this
              session. Nothing shown here passes through a server.
            </p>
          </div>
          <div className="map-canvas-frame">
            <ConstellationMap />
          </div>
        </section>
      </main>
    </>
  );
}