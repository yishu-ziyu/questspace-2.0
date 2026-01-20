import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';

function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <Canvas />
    </div>
  );
}

export default App;
