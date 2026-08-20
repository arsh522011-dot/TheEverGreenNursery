import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  scale?: boolean;
  className?: string;
  viewportOnce?: boolean;
  viewportMargin?: string;
}

/**
 * ScrollReveal: Premium viewport-triggered smooth reveal animation
 * Automatically hardware accelerated with opacity & transform.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.65,
  distance = 28,
  scale = false,
  className = '',
  viewportOnce = true,
  viewportMargin = '-40px',
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialPos = getInitialPosition();

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...initialPos,
        scale: scale ? 0.96 : 1,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{ once: viewportOnce, margin: viewportMargin }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Custom cubic bezier for high-end agency smoothness
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
  viewportOnce?: boolean;
  viewportMargin?: string;
}

const containerVariants = (staggerDelay: number, delayChildren: number): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.08,
  delayChildren = 0.05,
  className = '',
  viewportOnce = true,
  viewportMargin = '-40px',
}) => {
  return (
    <motion.div
      variants={containerVariants(staggerDelay, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewportOnce, margin: viewportMargin }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  scale?: boolean;
}

const itemVariants = (distance: number, scale: boolean): Variants => ({
  hidden: {
    opacity: 0,
    y: distance,
    scale: scale ? 0.95 : 1,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className = '',
  distance = 24,
  scale = false,
}) => {
  return (
    <motion.div variants={itemVariants(distance, scale)} className={className}>
      {children}
    </motion.div>
  );
};

interface HoverLiftCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  lift?: number;
  scale?: number;
}

/**
 * Interactive card wrapper with smooth micro-hover lift and click response
 */
export const HoverLiftCard: React.FC<HoverLiftCardProps> = ({
  children,
  className = '',
  lift = 5,
  scale = 1.01,
  ...props
}) => {
  return (
    <motion.div
      whileHover={{
        y: -lift,
        scale,
        transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
      }}
      whileTap={{
        scale: 0.985,
        transition: { duration: 0.15 },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Micro-interactive button with tactile press feedback and subtle hover glow
 */
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      whileTap={{
        scale: 0.96,
        transition: { duration: 0.1 },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
};

/**
 * Smooth view container with fade and slight scale transition
 */
export const ViewTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
