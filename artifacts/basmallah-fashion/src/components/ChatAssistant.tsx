import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, ChevronRight } from "lucide-react";
import { AishaAdeLogo } from "@/components/AishaAdeLogo";

const WHATSAPP_NUMBER = "2347062921566";

type Message = { from: "bot" | "user"; text: string; time: string };

const now = () =>
  new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });

const FAQS: { q: string; a: string; whatsapp?: boolean }[] = [
  {
    q: "🛍️ How do I place an order?",
    a: "It's easy! Browse our catalog, pick your item, then tap the **WhatsApp Order** button on the product page. We'll confirm your order and arrange delivery.",
  },
  {
    q: "🚚 What's the delivery time?",
    a: "📍 Within **Lagos** — 1 to 3 business days.\n📦 **Outside Lagos** — 3 to 5 business days.\n🚀 Same-day delivery available in some areas (call to confirm).",
  },
  {
    q: "💳 Payment methods?",
    a: "We accept:\n• Bank transfer\n• Cash on delivery\n• POS on delivery\n\nPayment details will be shared after you confirm your order via WhatsApp.",
  },
  {
    q: "📏 Custom sizes available?",
    a: "Yes! We cater for custom measurements on selected fashion items. Chat with us on WhatsApp and our team will guide you through the process.",
    whatsapp: true,
  },
  {
    q: "🔄 Returns & exchanges?",
    a: "We accept returns within **7 days** of delivery for items that are unused and in their original condition. Contact us on WhatsApp to initiate a return.",
    whatsapp: true,
  },
  {
    q: "📱 What gadgets do you sell?",
    a: "We stock Phones & Accessories, Laptops, Smart Watches, Audio & Earphones, Power Banks, and more — all genuine products at great prices!",
  },
];

const GREETING: Message = {
  from: "bot",
  text: "👋 Hello! I'm Aisha, your shopping assistant at **AishaADe Fashion & Gadgets Hub**.\n\nHow can I help you today? Pick a question below or type your own!",
  time: now(),
};

function formatText(text: string) {
  return text.split("\n").map((line, i) => {
    const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return (
      <span key={i} className={i > 0 ? "block mt-1" : ""} dangerouslySetInnerHTML={{ __html: formatted }} />
    );
  });
}

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const addBotReply = (text: string) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { from: "bot", text, time: now() }]);
    }, 900);
  };

  const handleFaq = (faq: typeof FAQS[0]) => {
    setMessages(m => [...m, { from: "user", text: faq.q, time: now() }]);
    let reply = faq.a;
    if (faq.whatsapp) reply += "\n\n👇 Tap **Chat on WhatsApp** below to speak with us directly!";
    addBotReply(reply);
  };

  const handleSend = () => {
    const q = input.trim();
    if (!q) return;
    setInput("");
    setMessages(m => [...m, { from: "user", text: q, time: now() }]);

    const lower = q.toLowerCase();
    const match = FAQS.find(f =>
      f.q.toLowerCase().includes(lower) ||
      lower.includes("order") && f.q.includes("order") ||
      lower.includes("deliver") && f.q.includes("deliver") ||
      lower.includes("pay") && f.q.includes("pay") ||
      lower.includes("size") && f.q.includes("size") ||
      lower.includes("return") && f.q.includes("return") ||
      lower.includes("gadget") && f.q.includes("gadget") ||
      lower.includes("phone") && f.q.includes("gadget")
    );

    if (match) {
      let reply = match.a;
      if (match.whatsapp) reply += "\n\n👇 Tap **Chat on WhatsApp** below to speak with us directly!";
      addBotReply(reply);
    } else {
      addBotReply(
        "Thanks for your message! I'm still learning 😊\n\nFor the quickest help, please **chat with us on WhatsApp** and our team will respond right away!"
      );
    }
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I need assistance from AishaADe Fashion & Gadgets Hub.")}`;

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.8, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, hsl(163 60% 17%), hsl(163 50% 28%))" }}
        aria-label="Open chat assistant"
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary" />
            <Bot className="w-6 h-6 text-white" />
          </>
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-[9px] font-bold text-white flex items-center justify-center">
            AI
          </span>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 left-4 z-50 w-[calc(100vw-32px)] max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: "70vh", background: "#fff" }}
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-sm">Aisha — Order Assistant</div>
                <div className="text-xs text-white/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Online now
                </div>
              </div>
              <div className="shrink-0">
                <AishaAdeLogo size={28} variant="mark" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3" style={{ background: "hsl(40 33% 97%)" }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.from === "user"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-white text-foreground rounded-bl-sm shadow-sm border border-border/30"
                    }`}
                  >
                    <div>{formatText(msg.text)}</div>
                    <div className={`text-[10px] mt-1 ${msg.from === "user" ? "text-white/50 text-right" : "text-muted-foreground"}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white text-foreground px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm border border-border/30 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-3 pb-2 pt-1 border-t border-border/30 bg-white">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {FAQS.slice(0, 4).map((faq, i) => (
                  <button
                    key={i}
                    onClick={() => handleFaq(faq)}
                    className="shrink-0 text-[11px] font-medium px-2.5 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-white transition-all whitespace-nowrap"
                  >
                    {faq.q.substring(0, 20)}…
                  </button>
                ))}
              </div>
            </div>

            {/* Input Row */}
            <div className="px-3 pb-3 pt-1 bg-white flex gap-2 items-center border-t border-border/20">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Type a question…"
                className="flex-1 px-3 py-2.5 rounded-xl bg-muted/50 text-sm border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* WhatsApp Escalation */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors"
              style={{ background: "#25d366", color: "#fff" }}
            >
              <svg viewBox="0 0 32 32" width="18" height="18" fill="none">
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.434.651 4.714 1.789 6.68L2 30l7.52-1.756A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="#fff"/>
                <path d="M21.8 19.013c-.293-.147-1.733-.857-2-.953-.267-.1-.46-.147-.654.147-.193.293-.754.953-.923 1.147-.167.193-.337.22-.63.073-.293-.147-1.24-.457-2.36-1.457-.873-.78-1.46-1.74-1.633-2.033-.173-.293-.02-.453.127-.6.133-.133.293-.347.44-.52.147-.173.193-.293.293-.487.1-.193.05-.367-.025-.513-.073-.147-.654-1.58-.897-2.167-.24-.573-.48-.493-.653-.5l-.56-.013c-.193 0-.507.073-.773.367-.267.293-1.02 1-1.02 2.44s1.043 2.833 1.19 3.027c.147.193 2.06 3.147 4.993 4.413.7.3 1.247.48 1.673.613.703.22 1.343.19 1.847.113.563-.087 1.733-.71 1.98-1.393.247-.683.247-1.267.173-1.393-.073-.127-.267-.2-.56-.347z" fill="#25d366"/>
              </svg>
              Chat with us on WhatsApp
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
