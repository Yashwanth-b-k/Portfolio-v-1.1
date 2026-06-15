import { motion } from "framer-motion";
import { profile } from "@/data/resume";

export function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-light-bg dark:bg-dark-bg"
    >
      <div className="flex flex-col items-center gap-5">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-light-accent text-2xl font-bold text-white dark:bg-dark-accent dark:text-black"
        >
          Y
        </motion.div>
        <div className="h-0.5 w-32 overflow-hidden rounded-full bg-light-border dark:bg-dark-border">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-1/2 bg-light-accent dark:bg-dark-accent"
          />
        </div>
        <p className="sr-only">Loading {profile.name}'s portfolio</p>
      </div>
    </motion.div>
  );
}
