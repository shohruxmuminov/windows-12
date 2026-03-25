import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Calendar, Star, AlertCircle } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  important: boolean;
}

export default function TodoApp({ windowId }: { windowId: string }) {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('windows12-todos');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: '1', text: 'Explore Windows 12 Simulator', completed: true, important: true },
      { id: '2', text: 'Test window dragging and resizing', completed: false, important: true },
      { id: '3', text: 'Customize desktop wallpaper', completed: false, important: false },
    ];
  });

  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'important' | 'planned'>('all');

  useEffect(() => {
    localStorage.setItem('windows12-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([{ id: Math.random().toString(), text: input, completed: false, important: filter === 'important' }, ...todos]);
    setInput('');
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleImportant = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, important: !t.important } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'important') return t.important;
    if (filter === 'planned') return !t.completed;
    return true;
  });

  return (
    <div className="flex h-full bg-[#f3f2f1] dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors">
      
      {/* Sidebar */}
      <div className="w-56 border-r border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50 flex flex-col pt-8">
         <div className="flex items-center gap-3 px-6 mb-8">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">DU</div>
            <div>
               <div className="font-semibold text-sm">Demo User</div>
               <div className="text-xs text-slate-500">Tasks Account</div>
            </div>
         </div>

         <div className="flex-1 space-y-1 px-2">
            <SidebarItem icon={AlertCircle} label="Tasks" count={todos.length} active={filter === 'all'} onClick={() => setFilter('all')} />
            <SidebarItem icon={Star} label="Important" color="text-red-500" count={todos.filter(t=>t.important).length} active={filter === 'important'} onClick={() => setFilter('important')} />
            <SidebarItem icon={Calendar} label="Planned" count={todos.filter(t=>!t.completed).length} active={filter === 'planned'} onClick={() => setFilter('planned')} />
         </div>
      </div>

      {/* Main List */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#1e1e1e] p-8 shadow-inner overflow-hidden relative">
         <div className="mb-6 flex justify-between items-end">
           <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
             {filter === 'all' ? 'Tasks' : filter === 'important' ? 'Important' : 'Planned'}
           </h2>
         </div>

         <form onSubmit={addTodo} className="bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg flex items-center px-4 py-3 mb-6 shadow-sm focus-within:ring-2 ring-blue-500/50 ring-offset-1 dark:ring-offset-[#1e1e1e] transition-shadow">
            <Plus size={20} className="text-blue-500 mr-3" />
            <input 
              type="text" 
              placeholder="Add a task" 
              className="bg-transparent border-none outline-none flex-1 placeholder:text-blue-500/60 dark:placeholder:text-blue-400/60"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
         </form>

         <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {filteredTodos.map(todo => (
              <div 
                key={todo.id} 
                className={`bg-white dark:bg-[#2a2a2a] border border-slate-200 dark:border-white/5 rounded-lg p-3.5 flex items-center shadow-sm group transition-all hover:-translate-y-0.5 hover:shadow-md ${todo.completed ? 'opacity-60 bg-slate-50 dark:bg-[#222]' : ''}`}
              >
                 <button 
                   className={`mr-4 transition-colors ${todo.completed ? 'text-blue-500' : 'text-slate-400 dark:text-slate-500 hover:text-blue-500'}`}
                   onClick={() => toggleComplete(todo.id)}
                 >
                   {todo.completed ? <CheckCircle2 size={22} className="fill-blue-500 text-white dark:text-[#2a2a2a]" /> : <Circle size={22} />}
                 </button>
                 
                 <span className={`flex-1 ${todo.completed ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                   {todo.text}
                 </span>
                 
                 <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 mr-2">
                    <button 
                      className="p-1.5 text-slate-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-500/20 rounded-md transition"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                 </div>
                 
                 <button 
                   className={`transition-colors p-1 ${todo.important ? 'text-red-500' : 'text-slate-300 dark:text-slate-600 hover:text-red-400'}`}
                   onClick={() => toggleImportant(todo.id)}
                 >
                   <Star size={20} className={todo.important ? 'fill-red-500/20' : ''} />
                 </button>
              </div>
            ))}

            {filteredTodos.length === 0 && (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 mt-12">
                 <img src="/vite.svg" className="w-16 h-16 opacity-10 mb-6 grayscale" alt="" />
                 <p>Nothing left to do. Enjoy your day!</p>
              </div>
            )}
         </div>
         
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />
      </div>

    </div>
  );
}

function SidebarItem({ icon: Icon, label, count, color = "text-slate-500 dark:text-slate-400", active = false, onClick }: any) {
  return (
    <div 
      className={`flex items-center gap-3 px-4 py-2.5 rounded-md cursor-pointer transition-colors ${
        active 
          ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-medium' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5'
      }`}
      onClick={onClick}
    >
      <Icon size={18} className={active ? (color === "text-red-500" ? color : "text-blue-500") : "opacity-70 text-slate-500 dark:text-slate-400"} />
      <span className="flex-1 text-sm">{label}</span>
      {count > 0 && <span className="text-xs opacity-60 font-medium bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded-full">{count}</span>}
    </div>
  );
}
