import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Loader } from "@/components/Loader";
import { useTheme } from "@/hooks/useTheme";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-light-accent focus:px-4 focus:py-2 focus:text-sm focus:text-white dark:focus:bg-dark-accent dark:focus:text-black"
      >
        Skip to content
      </a>

      <ScrollProgress />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </motion.div>
    </>
  );
}
