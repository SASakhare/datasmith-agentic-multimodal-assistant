import { motion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
    children: ReactNode;
    delay?: number;
}

export function Reveal({
    children,
    delay = 0,
}: RevealProps) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 60,
                scale: 0.96,
                filter: "blur(8px)",
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
            }}
            viewport={{
                once: true,
                amount: 0.15,
            }}
            transition={{
                duration: 0.9,
                delay,
                type: "spring",
                stiffness: 90,
                damping: 18,
            }}
        >
            {children}
        </motion.div>
    );
}