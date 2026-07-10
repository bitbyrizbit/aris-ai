import ConstellationMap from "@/components/ConstellationMap";

export default function Home() {
  return (
    <main className="shell">
      <header className="hero">
        <p className="eyebrow">on-device ai · no cloud inference</p>
        <h1>Aris</h1>
        <p className="tagline">
          Devices converge. The AI runs where you are — every one of them,
          together.
        </p>
      </header>

      <hr className="hairline" />

      <section className="map-section">
        <ConstellationMap />
        <p className="map-caption">
          Connect a device to begin. Nothing here talks to a server.
        </p>
      </section>
    </main>
  );
}