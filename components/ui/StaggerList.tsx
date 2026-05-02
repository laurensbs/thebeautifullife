"use client";

import { motion } from "framer-motion";
import { Children, isValidElement } from "react";

/**
 * StaggerList - rendert een lijst items waarvan elk item subtiel
 * fade-up komt met een per-item delay. Ideaal voor features-lijsten,
 * stappen, status-timelines, etc.
 *
 * BELANGRIJK: deze component accepteert **children** (al gerenderd
 * door de parent), niet een renderItem-functie. Reden: StaggerList
 * is een client component, maar wordt vaak vanuit een server component
 * aangeroepen — en functies kunnen niet over de server/client grens
 * gestuurd worden.
 *
 * Gebruik:
 *   <StaggerList itemClassName="flex gap-2">
 *     {items.map((it) => <li key={it.id}>{it.label}</li>)}
 *   </StaggerList>
 *
 * Of gebruik StaggerChildren (variant met motion.div ipv motion.li).
 */
export function StaggerList({
  children,
  baseDelay = 0,
  step = 0.06,
  className,
  itemClassName,
}: {
  children: React.ReactNode;
  baseDelay?: number;
  step?: number;
  className?: string;
  itemClassName?: string;
}) {
  const items = Children.toArray(children);
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
      {items.map((child, i) => {
        // Als de child een <li> is, hergebruiken we 'm; anders wrappen.
        const isLi =
          isValidElement(child) &&
          (child as React.ReactElement<{ className?: string }>).type === "li";
        const variantProps = {
          variants: {
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          },
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
        };
        if (isLi) {
          // Vervang de gewone <li> door motion.li met dezelfde props.
          const liEl = child as React.ReactElement<{
            className?: string;
            children?: React.ReactNode;
          }>;
          return (
            <motion.li
              key={i}
              className={liEl.props.className ?? itemClassName}
              {...variantProps}
            >
              {liEl.props.children}
            </motion.li>
          );
        }
        return (
          <motion.li key={i} className={itemClassName} {...variantProps}>
            {child}
          </motion.li>
        );
      })}
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
