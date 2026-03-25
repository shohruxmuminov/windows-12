import { useState, useRef, useEffect } from 'react';
import { useFileSystemStore } from '@/store/fileSystemStore';
import { useSystemStore } from '@/store/systemStore';
import { useWindowStore } from '@/store/windowStore';

export default function TerminalApp({ windowId }: { windowId: string }) {
  const { files, createFile, createFolder, deleteFile } = useFileSystemStore();
  const { setTheme, theme } = useSystemStore();
  const { closeWindow, windows } = useWindowStore();
  
  const [history, setHistory] = useState<{ type: 'input' | 'output', text: string }[]>([
    { type: 'output', text: 'Windows 12 PowerShell v1.0.0' },
    { type: 'output', text: 'Copyright (C) Microsoft Corporation. All rights reserved.' },
    { type: 'output', text: 'Type "help" for a list of available commands.' },
    { type: 'output', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState(['root']);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const currentFolderId = currentPath[currentPath.length - 1];
  const pathString = `C:\\${currentPath.slice(1).map(id => files.find(f => f.id === id)?.name || id).join('\\')}`;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    const args = cmd.split(' ');
    const command = args[0].toLowerCase();
    
    const newHistory = [...history, { type: 'input', text: `${pathString}> ${cmd}` } as const];

    let outputText = '';

    switch (command) {
      case 'help':
        outputText = 'Available commands:\n  help    - Show this message\n  clear   - Clear terminal output\n  echo    - Print text\n  date    - Show current date/time\n  whoami  - Show current user\n  ls/dir  - List directory contents\n  cd      - Change directory\n  mkdir   - Create directory\n  touch   - Create file\n  pwd     - Print working directory\n  theme   - Toggle system theme\n  exit    - Close terminal';
        break;
      case 'clear':
      case 'cls':
        setHistory([]);
        setInput('');
        return;
      case 'echo':
        outputText = args.slice(1).join(' ');
        break;
      case 'date':
      case 'time':
        outputText = new Date().toString();
        break;
      case 'whoami':
        outputText = useSystemStore.getState().user?.name || 'Unknown User';
        break;
      case 'pwd':
        outputText = pathString;
        break;
      case 'ls':
      case 'dir':
        const dirFiles = files.filter(f => f.parentId === currentFolderId);
        outputText = dirFiles.length > 0 
          ? dirFiles.map(f => `${f.type === 'folder' ? '<DIR> ' : '      '}  ${f.name}`).join('\n')
          : 'Directory is empty';
        break;
      case 'cd':
        if (args[1] === '..') {
          if (currentPath.length > 1) setCurrentPath(prev => prev.slice(0, -1));
        } else if (args[1]) {
          const target = files.find(f => f.parentId === currentFolderId && f.name.toLowerCase() === args[1].toLowerCase() && f.type === 'folder');
          if (target) {
            setCurrentPath(prev => [...prev, target.id]);
          } else {
            outputText = `cd: cannot find path '${args[1]}' because it does not exist.`;
          }
        } else {
           setCurrentPath(['root']);
        }
        break;
      case 'mkdir':
        if (args[1]) {
          createFolder(args[1], currentFolderId);
          outputText = `Directory '${args[1]}' created.`;
        } else {
          outputText = 'mkdir: missing operand';
        }
        break;
      case 'touch':
        if (args[1]) {
          createFile({ name: args[1], type: 'file', mimeType: 'text/plain', parentId: currentFolderId, content: '' });
          outputText = `File '${args[1]}' created.`;
        } else {
          outputText = 'touch: missing operand';
        }
        break;
      case 'theme':
        setTheme(theme === 'dark' ? 'light' : 'dark');
        outputText = `Theme changed to ${theme === 'dark' ? 'light' : 'dark'}.`;
        break;
      case 'exit':
        closeWindow(windowId);
        break;
      default:
        outputText = `'${command}' is not recognized as an internal or external command, operable program or batch file.`;
    }

    if (outputText) {
      newHistory.push({ type: 'output', text: outputText });
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div 
      className="h-full w-full bg-[#0c0c0c] text-[#cccccc] font-mono text-sm p-2 overflow-y-auto"
      onClick={() => document.getElementById(`terminal-input-${windowId}`)?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap break-all mb-1">
          {line.text}
        </div>
      ))}
      <form onSubmit={handleCommand} className="flex">
        <span className="mr-2 shrink-0">{pathString}&gt;</span>
        <input
          id={`terminal-input-${windowId}`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-[#cccccc]"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </form>
      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
