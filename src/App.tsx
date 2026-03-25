import { useSystemStore } from './store/systemStore';
import BootScreen from './components/BootScreen';
import LockScreen from './components/LockScreen';
import Desktop from './components/Desktop';

function App() {
  const { isBooted, isLocked } = useSystemStore();

  return (
    <div className="h-screen w-screen overflow-hidden selection:bg-blue-500/30">
      {!isBooted && <BootScreen />}
      {isBooted && isLocked && <LockScreen />}
      {isBooted && !isLocked && <Desktop />}
    </div>
  );
}

export default App;
