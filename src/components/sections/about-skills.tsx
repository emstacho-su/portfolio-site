'use client';

import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { skillCategories } from '@/data/about';
import { staggerItem } from '@/lib/animation';

export function AboutSkills() {
  return (
    <div className="flex flex-col justify-between h-full">
      {skillCategories.map((category) => (
        <div key={category.label}>
          <p className="font-mono text-xs text-terminal-green mb-2 uppercase tracking-wider">
            {category.label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {category.skills.map((skill) => (
              <motion.div key={skill} variants={staggerItem}>
                <Badge
                  variant="secondary"
                  className="font-mono text-xs bg-surface border border-border
                             hover:border-terminal-green/40 hover:text-terminal-green
                             transition-colors cursor-default"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
