import { motion } from "framer-motion";

const WHATSAPP_NUMBER = "2347062921566";
const INTRO_MESSAGE = `Hello AishaADe Fashion & Gadgets Hub! 👋

I found you on your website and I'd like to:
• Browse your latest collection
• Place an order
• Ask about pricing & delivery

Please assist me. Thank you! 🛍️`;

export function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(INTRO_MESSAGE)}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl"
      style={{ background: "linear-gradient(135deg, #25d366, #128C7E)" }}
    >
      {/* Ripple ring */}
      <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: "#25d366" }} />

      {/* WhatsApp SVG */}
      <svg viewBox="0 0 32 32" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.434.651 4.714 1.789 6.68L2 30l7.52-1.756A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="#fff"/>
        <path d="M16 4.2c-6.507 0-11.8 5.293-11.8 11.8 0 2.158.585 4.18 1.607 5.913L4.6 27.4l5.607-1.193A11.76 11.76 0 0016 27.8c6.507 0 11.8-5.293 11.8-11.8S22.507 4.2 16 4.2z" fill="#25d366"/>
        <path d="M21.8 19.013c-.293-.147-1.733-.857-2-.953-.267-.1-.46-.147-.654.147-.193.293-.754.953-.923 1.147-.167.193-.337.22-.63.073-.293-.147-1.24-.457-2.36-1.457-.873-.78-1.46-1.74-1.633-2.033-.173-.293-.02-.453.127-.6.133-.133.293-.347.44-.52.147-.173.193-.293.293-.487.1-.193.05-.367-.025-.513-.073-.147-.654-1.58-.897-2.167-.24-.573-.48-.493-.653-.5l-.56-.013c-.193 0-.507.073-.773.367-.267.293-1.02 1-1.02 2.44s1.043 2.833 1.19 3.027c.147.193 2.06 3.147 4.993 4.413.7.3 1.247.48 1.673.613.703.22 1.343.19 1.847.113.563-.087 1.733-.71 1.98-1.393.247-.683.247-1.267.173-1.393-.073-.127-.267-.2-.56-.347z" fill="#fff"/>
      </svg>
    </motion.a>
  );
}
