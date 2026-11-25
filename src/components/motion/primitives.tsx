import { useEffect, useRef, useState, type ReactNode, type MouseEvent, type CSSProperties, type RefObject } from 'react';
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'motion/react';

/*
 * Primitivas de movimento do design system (paleta musica-roxo).
 * - Respeitam "reduzir movimento" do sistema (useReducedMotion).
 * - Efeitos de ponteiro (magnético, inclinação, spotlight) só em mouse/trackpad.
 * - Entradas de 300–700 ms com easing suave; feedback de interação em 100 ms.
 */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** true quando o dispositivo tem ponteiro fino (mouse/trackpad) */
export function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return fine;
}

/** Atualiza --mx/--my no elemento para o brilho que segue o cursor (.sp-spotlight) */
export function spotlightMove(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}

/** Surge de baixo ao entrar na tela (uma vez) */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'span';
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  if (reduce) return <Comp className={className}>{children}</Comp>;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-64px' }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
    >
      {children}
    </Comp>
  );
}

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

/** Grade/lista cujos filhos (StaggerItem) entram em sequência */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-64px' }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  );
}

/** Linha de título revelada por máscara (sobe de dentro da própria linha) */
export function MaskLine({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <span className={className} style={style}>
        {children}
      </span>
    );
  }
  return (
    <span className="block overflow-hidden pr-[0.12em] -mr-[0.12em]">
      <motion.span
        className={className}
        style={style}
        initial={{ y: '105%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.8, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Botão magnético: acompanha levemente o cursor (máx. ~8px) */
export function Magnetic({ children, className, strength = 0.25 }: { children: ReactNode; className?: string; strength?: number }) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  if (!fine || reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(Math.max(-8, Math.min(8, (e.clientX - r.left - r.width / 2) * strength)));
        y.set(Math.max(-8, Math.min(8, (e.clientY - r.top - r.height / 2) * strength)));
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Card com inclinação 3D sutil + brilho que segue o cursor */
export function TiltCard({
  children,
  className,
  max = 5,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });
  const interactive = fine && !reduce;

  return (
    <motion.div
      className={`sp-spotlight ${className ?? ''}`}
      style={interactive ? { rotateX: srx, rotateY: sry, transformPerspective: 900 } : undefined}
      onMouseMove={
        interactive
          ? (e) => {
              spotlightMove(e);
              const r = e.currentTarget.getBoundingClientRect();
              const px = (e.clientX - r.left) / r.width - 0.5;
              const py = (e.clientY - r.top) / r.height - 0.5;
              ry.set(px * max * 2);
              rx.set(-py * max * 2);
            }
          : undefined
      }
      onMouseLeave={
        interactive
          ? () => {
              rx.set(0);
              ry.set(0);
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}

/** Conta do zero até o valor ao entrar na tela, preservando prefixo/sufixo ("5,000+", "99.9%", "21 Dias") */
export function CountUp({ value, className, duration = 1.6 }: { value: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const m = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
  const prefix = m?.[1] ?? '';
  const raw = m?.[2] ?? '';
  const suffix = m?.[3] ?? '';
  const thousands = /^\d{1,3}(,\d{3})+$/.test(raw);
  const decimals = !thousands && raw.includes('.') ? raw.split('.')[1].length : 0;
  const target = m ? parseFloat(thousands ? raw.replace(/,/g, '') : raw) : NaN;
  const animated = !!m && !Number.isNaN(target) && !reduce;

  const format = (n: number) => {
    const fixed = n.toFixed(decimals);
    const out = thousands ? Math.round(n).toLocaleString('en-US') : fixed;
    return `${prefix}${out}${suffix}`;
  };

  useEffect(() => {
    if (!animated || !inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, target, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, animated]);

  return (
    <span ref={ref} className={className}>
      {animated ? format(0) : value}
    </span>
  );
}

/** Barra fina de progresso de leitura no topo da página */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] bg-brand-primary origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}

/** Parallax do hero: rolagem (fundo mais lento, conteúdo some) + cursor (fundo acompanha) */
export function useHeroParallax(target: RefObject<HTMLElement>) {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -64]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.15]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!fine || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * -24);
    my.set(((e.clientY - r.top) / r.height - 0.5) * -16);
  };
  return { bgY, contentY, contentOpacity, mouseX: smx, mouseY: smy, onMouseMove };
}
