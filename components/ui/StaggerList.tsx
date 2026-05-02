"use client";

import { motion } from "framer-motion";

/**
 * StaggerList - rendert een lijst items waarvan elk item subtiel
 * fade-up komt met een per-item delay. Ideaal voor features-lijsten,
 * stappen, status-timelines, etc.
 *
 * Container = <ul>; items = <motion.li>. Voor andere elementen pak
 * StaggerChildren (zelfde principe, eigen elementen).
 */
export function StaggerList<T>({
  items,
  renderItem,
  baseDelay = 0,
  step = 0.06,
  className,
  itemClassName,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  baseDelay?: number;
  step?: number;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <motion.ul
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: step,
            delayChildren: baseDelay,
          },
        },
      }}
    >
      {items.map((item, i) => (
        <motion.li
          key={i}
          className={itemClassName}
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {renderItem(item, i)}
        </motion.li>
      ))}
    </motion.ul>
  );
}

/**
 * StaggerChildren - generieke container die directe React-children
 * staggered laat verschijnen (elk kind = motion.div wrapper).
 * Gebruik wanneer je geen list-semantiek wil.
 */
export function StaggerChildren({
  children,
  baseDelay = 0,
  step = 0.06,
  className,
}: {
  children: React.ReactNode[];
  baseDelay?: number;
  step?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: step,
            delayChildren: baseDelay,
          },
        },
      }}
    >
      {children.map((child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
