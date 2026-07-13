import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Cpu, MessageSquare, CornerDownLeft, ShieldCheck } from "lucide-react";



const AIWaveform = () => (
  <div className="flex items-end gap-0.5 h-4 w-6">
    {[0.6, 1.2, 0.9, 1.5, 0.7].map((delay, i) => (
      <motion.div
        key={i}
        className="w-0.5 bg-cyan-400 rounded-full"
        animate={{ height: ["20%", "100%", "20%"] }}
        transition={{ duration: 1, repeat: Infinity, delay: delay, ease: "easeInOut" }}
      />
    ))}
  </div>
);

// 2. Component للأزرار السريعة بستايل تقني
const QuickCmdButton = ({ label, icon }: { label: string; icon: React.ReactNode }) => (
  <motion.button 
    whileHover={{ scale: 1.05, borderColor: "rgba(34, 211, 238, 0.5)" }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-1.5 px-3 py-1 text-[10px] bg-[#111e21] border border-slate-700 rounded-full text-slate-300 hover:text-cyan-300 transition-colors"
  >
    {icon}
    {label}
  </motion.button>
);

const AmanAssistantDesign = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", content: "Aman Intelligent Core v1.0 online. Awaiting system command..." },
    { role: "ai", content: "Tip: Try 'Filter: Weapon' or 'Show critical'." },

  ]);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll automatically to the bottom on new messages
    if (isOpen) {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isOpen]);

  return (
    
    <div className="fixed bottom-6 right-6 z-[999] font-mono">
      <AnimatePresence>
        {isOpen ? (
         
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 30, scale: 0.8, rotate: 2 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-96 h-[550px] bg-[#0c1417]/90 border border-cyan-500/20 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.15)] backdrop-blur-2xl flex flex-col overflow-hidden"
          >
            {/* 1. Header (Aman Intelligence + Waveform) */}
            <div className="p-5 border-b border-white/5 bg-cyan-950/20 flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <AIWaveform />
                <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">Aman Assistant</h3>
                    <p className="text-[9px] text-slate-500 tracking-wider">SECURE-LINK ACTIVE</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ rotate: 90, color: "#fff" }}
                onClick={() => setIsOpen(false)} 
                className="text-slate-500 transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* 2. منطقة الرسائل (messages) */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-cyan-900/50 scrollbar-track-transparent text-[11px] leading-relaxed">
              {messages.map((msg, i) => (
                <motion.div 
                    key={i} 
                    initial={{opacity:0, y:10}} 
                    animate={{opacity:1, y:0}}
                    className={`flex gap-3 ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  {msg.role === 'ai' && <div className="w-6 h-6 rounded-full bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5"><Cpu size={14} className="text-cyan-500"/></div>}
                  
                  <div className={`max-w-[75%] p-3.5 rounded-2xl ${
                    msg.role === 'ai' 
                    ? 'bg-[#111e21] text-cyan-100 rounded-bl-none border border-slate-800' 
                    : 'bg-cyan-600 text-white rounded-br-none shadow-lg shadow-cyan-500/10'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              
              {/* إشعار "يفكر" */}
              {isThinking && (
                 <div className="text-[10px] text-slate-600 pl-9 animate-pulse">AI is processing...</div>
              )}
            </div>

            {/* 3. منطقة الإدخال والأزرار السريعة */}
            <div className="p-4 border-t border-white/5 bg-black/20">
              
              {/* الأزرار السريعة (Quick Actions) */}
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                 <QuickCmdButton label="Filter Weapon" icon={<ShieldCheck size={12} className="text-red-500"/>}/>
                 <QuickCmdButton label="Reset View" icon={<CornerDownLeft size={12}/>}/>
                 <QuickCmdButton label="System Status" icon={<Cpu size={12}/>}/>
              </div>

              {/* حقل الإدخال وزر الإرسال */}
              <form className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter security command (e.g. 'Show fight')..."
                  className="w-full bg-[#111e21] border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-[11px] text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
                />
                <motion.button 
                    whileHover={{ scale: 1.1, color: "#fff" }}
                    type="submit" 
                    className="absolute right-3 top-2.5 text-cyan-500 hover:text-cyan-400 p-1"
                >
                  <Send size={18} />
                </motion.button>
              </form>
              <p className="text-center text-[9px] text-slate-700 mt-2 font-sans">Aman Command Interface v1.0 | Authorized Personnel Only</p>
            </div>
          </motion.div>
        ) : (
          // --- ديزاين الأيقونة العائمة لما يكون مقفول ---
          <motion.button
            layoutId="assistant-button"
            whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(6,182,212,0.3)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-[#0c1417] rounded-full flex items-center justify-center text-cyan-500 shadow-2xl shadow-cyan-500/20 border-2 border-cyan-500/30 backdrop-blur-xl relative"
          >
            <MessageSquare size={26} />
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/10 animate-pulse"/>
            {/* نقطة خضراء تبين إنه Active */}
            <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#0c1417]"/>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AmanAssistantDesign;