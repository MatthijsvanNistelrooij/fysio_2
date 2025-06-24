"use client"
import { useSpring, animated } from "@react-spring/web"

interface AnimatedNumberProps {
  number: number
}

export default function AnimatedNumber({ number }: AnimatedNumberProps) {
  const { number: animatedNumber } = useSpring({
    from: { number: 0 },
    to: { number },
    config: { tension: 170, friction: 26 },
    reset: true,
  })

  return (
    <animated.span>{animatedNumber.to((n) => Math.floor(n))}</animated.span>
  )
}
