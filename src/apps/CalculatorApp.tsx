import { useState } from 'react';
import { History, Maximize2 } from 'lucide-react';

export default function CalculatorApp({ windowId }: { windowId: string }) {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleNum = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op);
    setDisplay('0');
  };

  const handleCalc = () => {
    try {
      // Very simple eval for demo purposes. In prod, use a safer math parser.
      const result = eval(equation + ' ' + display);
      const resStr = String(result);
      
      setHistory([`${equation} ${display} = ${resStr}`, ...history]);
      setDisplay(resStr);
      setEquation('');
    } catch {
      setDisplay('Error');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setEquation('');
  };

  const buttons = [
    { label: '%', action: () => handleOp('%') },
    { label: 'CE', action: clearAll },
    { label: 'C', action: clearAll },
    { label: '⌫', action: () => setDisplay(display.length > 1 ? display.slice(0, -1) : '0') },
    { label: '1/x', action: () => setDisplay(String(1 / parseFloat(display))) },
    { label: 'x²', action: () => setDisplay(String(Math.pow(parseFloat(display), 2))) },
    { label: '√x', action: () => setDisplay(String(Math.sqrt(parseFloat(display)))) },
    { label: '÷', action: () => handleOp('/') },
    { label: '7', action: () => handleNum('7'), color: 'bg-white/5 hover:bg-white/10' },
    { label: '8', action: () => handleNum('8'), color: 'bg-white/5 hover:bg-white/10' },
    { label: '9', action: () => handleNum('9'), color: 'bg-white/5 hover:bg-white/10' },
    { label: '×', action: () => handleOp('*') },
    { label: '4', action: () => handleNum('4'), color: 'bg-white/5 hover:bg-white/10' },
    { label: '5', action: () => handleNum('5'), color: 'bg-white/5 hover:bg-white/10' },
    { label: '6', action: () => handleNum('6'), color: 'bg-white/5 hover:bg-white/10' },
    { label: '-', action: () => handleOp('-') },
    { label: '1', action: () => handleNum('1'), color: 'bg-white/5 hover:bg-white/10' },
    { label: '2', action: () => handleNum('2'), color: 'bg-white/5 hover:bg-white/10' },
    { label: '3', action: () => handleNum('3'), color: 'bg-white/5 hover:bg-white/10' },
    { label: '+', action: () => handleOp('+') },
    { label: '+/-', action: () => setDisplay(String(parseFloat(display) * -1)) },
    { label: '0', action: () => handleNum('0'), color: 'bg-white/5 hover:bg-white/10' },
    { label: '.', action: () => !display.includes('.') && setDisplay(display + '.') },
    { label: '=', action: handleCalc, color: 'bg-blue-600 hover:bg-blue-500 text-white' },
  ];

  return (
    <div className="flex bg-[#202020] h-full text-white font-sans relative">
      <div className="flex-1 flex flex-col p-1">
        
        {/* Header */}
        <div className="flex items-center justify-between p-2">
           <div className="font-semibold text-sm px-2">Standard</div>
           <button 
             className="p-1.5 hover:bg-white/10 rounded"
             onClick={() => setShowHistory(!showHistory)}
           >
             <History size={16} />
           </button>
        </div>

        {/* Display */}
        <div className="flex flex-col items-end justify-end px-4 py-6 gap-2">
           <div className="text-sm text-slate-400 h-5" suppressHydrationWarning>{equation}</div>
           <div className="text-5xl font-semibold tracking-tighter w-full text-right overflow-hidden text-ellipsis" suppressHydrationWarning>{display}</div>
        </div>

        {/* History Overlay (mobile style) */}
        {showHistory && (
          <div className="absolute top-12 left-0 right-0 bottom-0 bg-[#202020] z-10 p-4 border-t border-white/5 overflow-y-auto">
             <h4 className="font-semibold text-sm mb-4">History</h4>
             {history.length === 0 ? (
               <p className="text-sm text-slate-400">There's no history yet</p>
             ) : (
               history.map((h, i) => (
                 <div key={i} className="text-right text-lg py-2 border-b border-white/5 hover:bg-white/5 cursor-pointer px-2 rounded">
                    {h}
                 </div>
               ))
             )}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-4 gap-[2px] flex-1 p-1">
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              className={`rounded-md flex items-center justify-center text-lg active:scale-95 transition-transform ${btn.color || 'bg-black/20 hover:bg-white/10'}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
