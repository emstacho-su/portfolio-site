'use client';

import { motion } from 'motion/react';

// Per Next.js 16 conventions: template.tsx remounts on every navigation,
// giving each page a fresh entry animation. Layout state is preserved above this.
// See: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/template.md
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
