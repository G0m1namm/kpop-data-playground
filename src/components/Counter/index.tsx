import { animate, useAnimation } from "framer-motion";
import React, { LegacyRef, useEffect, useRef } from "react";
import { numberWithCommas } from "../../utils/helpers";
import { useInView } from 'react-intersection-observer';

interface CounterProps {
  className: string,
  from: number,
  to: number
}

export default function Counter({ from, to, className }: CounterProps) {
  const ref: LegacyRef<HTMLSpanElement> = useRef(null);
  const [nodeRef, inView] = useInView({ threshold: 0.5 });

  useEffect(() => {
    nodeRef(ref.current);
  }, [ref.current])

  useEffect(() => {
    if (!inView) return;
    const node = ref.current!;
    const controls = animate(from, to, {
      duration: 1.5,
      onUpdate(value) {
        node.textContent = numberWithCommas(value.toFixed(0).toString());
      }
    });

    return () => controls.stop();
  }, [from, to, inView]);

  return <span ref={ref} className={className} />;
}
