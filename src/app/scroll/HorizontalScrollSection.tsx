import {useEffect, useRef} from "react";
import {IWithChildren, IWithClass} from "@/types/tehnic";

interface Props extends IWithChildren, IWithClass{
  sensitivity?: number // Чувствительность скролла
}

function HorizontalScrollSection({
                                   children,
                                   className,
                                   sensitivity = 2
                                 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef<boolean>(false)
  const startX = useRef<number>(0)
  const scrollLeft = useRef<number>(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      isScrolling.current = true
      startX.current = e.touches[0].pageX
      scrollLeft.current = container.scrollLeft
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolling.current) return

      const x = e.touches[0].pageX
      const walk = (x - startX.current) * sensitivity
      container.scrollLeft = scrollLeft.current - walk

      // Предотвращаем вертикальный скролл, если скроллим горизонтально
      if (Math.abs(walk) > 5) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = () => {
      isScrolling.current = false
    }

    // Добавляем обработчики
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [sensitivity])

  return (
      <div
          ref={containerRef}
          className={className}
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            // Отключаем стандартное поведение браузера для жестов
            touchAction: 'pan-y',
          }}
      >
        {children}
      </div>
  )
}

export default HorizontalScrollSection