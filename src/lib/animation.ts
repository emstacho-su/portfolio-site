export const TIMING = {
  SECTION_REVEAL: 0.6,
  STAGGER_CHILDREN: 0.1,
  HERO_TYPING_SPEED: 50,
  CARD_HOVER: 0.3,
  NAV_TRANSITION: 0.3,
  MENU_STAGGER: 0.08,
} as const;

export const EASE = {
  OUT: [0.0, 0.0, 0.2, 1.0] as const,
  IN_OUT: [0.4, 0.0, 0.2, 1.0] as const,
};

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: TIMING.SECTION_REVEAL, ease: EASE.OUT },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: TIMING.SECTION_REVEAL, ease: EASE.OUT },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: TIMING.SECTION_REVEAL, ease: EASE.OUT },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: TIMING.STAGGER_CHILDREN,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
