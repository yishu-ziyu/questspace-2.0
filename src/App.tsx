import { ReactFlowProvider } from '@xyflow/react';

import { Canvas } from './components/Canvas';
import { Composer } from './components/Composer';

function App() {
  return (
    <ReactFlowProvider>
      <div className="app-shell">
        <Canvas />
        <Composer />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
