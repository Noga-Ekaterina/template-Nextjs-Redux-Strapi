export const smoothScroll=(distance: number)=>{
  const startScrollPosition = window.scrollY;
  const startTime = performance.now();
  const duration = 400

  const animation = (currentTime: number) => {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // Easing function (You can change to another easing function if you want)
    const ease = progress * (2 - progress); // easeInOutQuad
    const currentScrollPosition = startScrollPosition + distance * ease;

    window.scrollTo(0, currentScrollPosition);

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}