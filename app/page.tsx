import Scene from "../components/three/Scene";
import Overlay from "../components/ui/Overlay";

export default function HomePage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <Scene />
      <Overlay />
    </main>
  );
}
