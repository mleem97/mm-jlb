import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

const splitInstances = new WeakMap<HTMLElement, GSAPSplitText>();

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((progress: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
}

function parseRootMargin(rootMargin: string): {
  value: number;
  unit: string;
} {
  const value = Number.parseFloat(rootMargin);
  if (!Number.isFinite(value)) return { value: 0, unit: "px" };

  const numericPart = String(value);
  const unit = rootMargin.slice(numericPart.length);
  if (!["", "px", "em", "rem", "%"].includes(unit)) {
    return { value: 0, unit: "px" };
  }

  return { value, unit: unit || "px" };
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const ref = useRef<HTMLElement>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
      return;
    }

    void document.fonts.ready
      .then(() => {
        setFontsLoaded(true);
      })
      .catch((error: unknown) => {
        console.error("Failed to wait for document fonts", error);
      });
  }, []);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || !text || !fontsLoaded || animationCompletedRef.current) {
        return;
      }

      const previousInstance = splitInstances.get(element);
      if (previousInstance) {
        try {
          previousInstance.revert();
        } catch (error: unknown) {
          console.warn("Failed to revert previous split text instance", error);
        }
        splitInstances.delete(element);
      }

      const startPercentage = (1 - threshold) * 100;
      const { value: marginValue, unit: marginUnit } =
        parseRootMargin(rootMargin);
      const sign =
        marginValue === 0
          ? ""
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPercentage}%${sign}`;
      let targets: Element[] = [];

      const assignTargets = (instance: GSAPSplitText) => {
        if (splitType.includes("chars") && instance.chars?.length) {
          targets = instance.chars;
        }
        if (!targets.length && splitType.includes("words") && instance.words.length) {
          targets = instance.words;
        }
        if (!targets.length && splitType.includes("lines") && instance.lines.length) {
          targets = instance.lines;
        }
        if (!targets.length) {
          targets = instance.chars || instance.words || instance.lines;
        }
      };

      const splitInstance = new GSAPSplitText(element, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
        onSplit: (instance: GSAPSplitText) => {
          assignTargets(instance);
          return gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              scrollTrigger: {
                trigger: element,
                start,
                once: true,
                fastScrollEnd: true,
                anticipatePin: 0.4,
              },
              onComplete: () => {
                animationCompletedRef.current = true;
                onCompleteRef.current?.();
              },
              willChange: "transform, opacity",
              force3D: true,
            },
          );
        },
      });

      splitInstances.set(element, splitInstance);

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === element) trigger.kill();
        });
        try {
          splitInstance.revert();
        } catch (error: unknown) {
          console.warn("Failed to revert split text instance", error);
        }
        splitInstances.delete(element);
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
      ],
      scope: ref,
    },
  );

  const style: React.CSSProperties = {
    textAlign,
    wordWrap: "break-word",
    willChange: "transform, opacity",
  };
  const classes = `split-parent overflow-hidden inline-block whitespace-normal ${className}`;
  const Tag = tag as React.ElementType;

  return React.createElement(
    Tag,
    {
      ref,
      style,
      className: classes,
    },
    text,
  );
};

export default SplitText;
