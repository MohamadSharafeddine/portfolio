import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Runs looping animations only while `trigger` is on screen. Call inside useGSAP so the
 * ScrollTrigger is reverted with the component.
 */
export function pauseOffscreen(trigger: Element | null, animations: gsap.core.Animation[]) {
  if (!trigger) return;
  const set = (active: boolean) => animations.forEach((a) => (active ? a.resume() : a.pause()));
  const st = ScrollTrigger.create({
    trigger,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => set(self.isActive),
  });
  set(st.isActive);
}
