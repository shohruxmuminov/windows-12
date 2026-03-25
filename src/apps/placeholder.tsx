export const createPlaceholderApp = (name: string) => {
  return ({ windowId }: { windowId: string }) => (
    <div className="flex items-center justify-center h-full w-full bg-slate-900 text-white p-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">{name} App</h2>
        <p className="text-slate-400">Window ID: {windowId}</p>
        <p className="text-slate-500 text-sm mt-4">Working on it...</p>
      </div>
    </div>
  );
};
