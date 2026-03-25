import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, MapPin, AlignLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, getDaysInMonth } from 'date-fns';

export default function CalendarApp({ windowId }: { windowId: string }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<{id: number, date: Date, title: string, time: string}[]>([
    { id: 1, date: new Date(), title: 'React Project Meeting', time: '10:00 AM' },
    { id: 2, date: new Date(), title: 'Lunch with team', time: '1:00 PM' }
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('12:00');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      const hasEvents = events.some(e => isSameDay(e.date, cloneDay));

      days.push(
        <div
          className={`flex flex-col items-center justify-start p-2 border-r border-b border-white/5 cursor-pointer transition-colors relative h-20 ${
            !isSameMonth(day, monthStart)
              ? "text-slate-500 bg-slate-900/40"
              : isSameDay(day, selectedDate)
              ? "bg-blue-600/30 text-white border border-blue-500"
              : isSameDay(day, new Date())
              ? "bg-blue-900/40 text-blue-300 font-bold"
              : "text-slate-300 hover:bg-white/10"
          }`}
          key={day.toString()}
          onClick={() => setSelectedDate(cloneDay)}
        >
          <span className="text-sm">{formattedDate}</span>
          
          {hasEvents && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {events.filter(e => isSameDay(e.date, cloneDay)).map((_, idx) => (
                <div key={idx} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              ))}
            </div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  const selectedEvents = events.filter(e => isSameDay(e.date, selectedDate));

  return (
    <div className="flex h-full bg-[#1e1e1e] text-slate-200">
      
      {/* Sidebar / Agenda */}
      <div className="w-72 border-r border-white/10 bg-[#191919] flex flex-col pt-12 relative overflow-hidden">
         {showAdd ? (
            <div className="absolute inset-x-0 top-0 bg-[#252525] p-4 h-full z-10 flex flex-col shadow-2xl">
              <h3 className="font-semibold text-lg mb-4 text-white">New Event</h3>
              <input 
                type="text" 
                placeholder="Event title" 
                className="w-full bg-[#191919] border border-white/10 rounded px-3 py-2 mb-4 outline-none focus:border-blue-500 text-white"
                value={newEventTitle}
                onChange={e => setNewEventTitle(e.target.value)}
                autoFocus
              />
              
              <div className="flex gap-2 items-center mb-4 text-sm bg-[#191919] border border-white/10 rounded px-3 py-2">
                <CalendarIcon size={16} className="opacity-60" />
                <span>{format(selectedDate, 'MMM d, yyyy')}</span>
              </div>
              
               <div className="flex gap-2 items-center mb-6 text-sm bg-[#191919] border border-white/10 rounded px-3 py-2">
                <Clock size={16} className="opacity-60" />
                <input 
                  type="time" 
                  value={newEventTime}
                  onChange={e => setNewEventTime(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-white"
                />
              </div>

              <div className="mt-auto flex gap-2 justify-end">
                <button 
                  className="px-4 py-2 rounded border border-white/10 hover:bg-white/10"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
                  onClick={() => {
                    if (newEventTitle) {
                      setEvents([...events, { id: Date.now(), date: selectedDate, title: newEventTitle, time: newEventTime }]);
                      setNewEventTitle('');
                      setShowAdd(false);
                    }
                  }}
                >
                  Save
                </button>
              </div>
            </div>
         ) : (
            <>
              <div className="px-6 mb-8 mt-4">
                <div className="text-5xl font-light text-white mb-2">{format(selectedDate, 'd')}</div>
                <div className="text-lg text-slate-400 font-medium">{format(selectedDate, 'eeee')}</div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Agenda</h4>
                  <button 
                    className="p-1 hover:bg-white/10 rounded-full"
                    onClick={() => setShowAdd(true)}
                  >
                    <Plus size={16} className="text-blue-400" />
                  </button>
                </div>

                {selectedEvents.length === 0 ? (
                  <div className="text-slate-500 text-sm italic px-2">No events scheduled.</div>
                ) : (
                  <div className="space-y-2">
                    {selectedEvents.map(e => (
                      <div key={e.id} className="bg-white/5 rounded-lg p-3 border-l-2 border-blue-500 hover:bg-white/10 transition group">
                        <div className="font-semibold text-white truncate pr-6 relative">
                           {e.title}
                           <button 
                             className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/20 rounded text-slate-400 hover:text-white"
                             onClick={(ev) => { ev.stopPropagation(); setEvents(events.filter(evn => evn.id !== e.id)) }}
                           >
                             &times;
                           </button>
                        </div>
                        <div className="text-sm text-slate-400 mt-1">{e.time}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
         )}
      </div>

      {/* Main Calendar View */}
      <div className="flex-1 flex flex-col bg-[#202020]">
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
           <div className="text-2xl font-light tracking-wide text-white">
             {format(currentDate, 'MMMM yyyy')}
           </div>
           
           <div className="flex gap-2">
             <button 
               className="p-2 border border-white/10 rounded hover:bg-white/10 transition disabled:opacity-50"
               onClick={() => setCurrentDate(subMonths(currentDate, 1))}
             >
               <ChevronLeft size={20} />
             </button>
             <button 
               className="p-2 border border-white/10 rounded hover:bg-white/10 transition px-4 text-sm font-medium"
               onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}
             >
               Today
             </button>
             <button 
               className="p-2 border border-white/10 rounded hover:bg-white/10 transition disabled:opacity-50"
               onClick={() => setCurrentDate(addMonths(currentDate, 1))}
             >
               <ChevronRight size={20} />
             </button>
           </div>
        </div>

        <div className="grid grid-cols-7 border-b border-white/5 text-center text-xs font-semibold py-2 text-slate-500">
           <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {rows}
        </div>
      </div>

    </div>
  );
}
