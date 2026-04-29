export default function SplashScreen() {
  return (
    <div 
      data-testid="splash-screen"
      className="fixed inset-0 flex flex-col items-center justify-center bg-purple-700 text-white z-50 animate-in fade-in duration-300"
    >
      <div className="relative p-10 text-center">
        {/* Creative Glow */}
        <div className="absolute inset-0 bg-purple-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <h1 className="relative text-5xl font-black tracking-tighter italic">
          Habit <span className="text-purple-200">Tracker</span>
        </h1>
        <p className="relative mt-4 text-purple-100 font-medium tracking-widest uppercase text-xs">
          Your Personal Evolution Journey
        </p>
      </div>
      
      <div className="mt-10 flex space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}