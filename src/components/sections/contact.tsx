'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { Mail, Link, Code } from 'lucide-react';
import { staggerContainer, staggerItem, EASE } from '@/lib/animation';

const CONTACT_LINKS = [
  {
    label: 'Email',
    value: 'emstacho@syr.edu',
    href: 'mailto:emstacho@syr.edu',
    icon: Mail,
  },
  {
    label: 'LinkedIn',
    value: 'evan-stachowiak',
    href: 'https://www.linkedin.com/in/evan-stachowiak-449119349',
    icon: Link,
  },
  {
    label: 'GitHub',
    value: 'emstacho-su',
    href: 'https://github.com/emstacho-su',
    icon: Code,
  },
] as const;

interface ContactSectionProps {
  onContactClick?: (contactType: string) => void;
}

export function ContactSection() {
  return <ContactSectionClient />;
}

export function ContactSectionClient({ onContactClick }: ContactSectionProps = {}) {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' });

  return (
    <Section id="contact">
      <div ref={headingRef} className="mb-4">
        <Reveal>
          <h2 className="font-mono text-2xl md:text-3xl text-terminal-green">
            Get In Touch
          </h2>
        </Reveal>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isHeadingInView ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE.OUT }}
          className="h-px bg-gradient-to-r from-terminal-green/60 via-terminal-green/20 to-transparent mt-3 origin-left"
        />
      </div>

      <Reveal delay={0.1}>
        <p className="text-muted-foreground text-sm max-w-md mb-10 mt-6">
          Looking to connect about opportunities, projects, or ideas? Reach out
          through any of the channels below.
        </p>
      </Reveal>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl"
      >
        {CONTACT_LINKS.map((link, i) => {
          const Icon = link.icon;
          return (
            <motion.a
              key={link.label}
              variants={staggerItem}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel={
                link.href.startsWith('mailto')
                  ? undefined
                  : 'noopener noreferrer'
              }
              onClick={() => onContactClick?.(link.label.toLowerCase())}
              className="group flex flex-col items-center gap-3 p-6 bg-card border border-border rounded-lg
                         hover:border-terminal-green/40 hover:terminal-glow transition-all duration-300
                         hover:-translate-y-0.5 relative overflow-hidden"
            >
              {/* Radar pulse rings on scroll-in */}
              <div className="relative">
                <Icon
                  size={22}
                  className="text-muted-foreground group-hover:text-terminal-green transition-colors relative z-10"
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0.6 }}
                  whileInView={{ scale: 2.5, opacity: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 1, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border border-terminal-green/40"
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0.4 }}
                  whileInView={{ scale: 3.5, opacity: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + i * 0.15, duration: 1.2, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border border-terminal-green/20"
                />
              </div>
              <div className="text-center">
                <p className="font-mono text-xs text-muted-foreground mb-1">
                  {link.label}
                </p>
                <p className="font-mono text-sm text-foreground group-hover:text-terminal-green transition-colors">
                  {link.value}
                </p>
              </div>
            </motion.a>
          );
        })}
      </motion.div>
    </Section>
  );
}
