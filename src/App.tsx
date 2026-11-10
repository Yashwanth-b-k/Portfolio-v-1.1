import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader } from "@/components/Loader";
import { ClickDebris } from "@/mc/Ambient";
import { useTheme } from "@/hooks/useTheme";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      <a
        href="#main"
        className="mc-btn sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70]"
      >
        Skip to content
      </a>

      <ClickDebris />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: loading ? 0 : 1 }} transition={{ duration: 0.5 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </motion.div>
    </>
  );
}
