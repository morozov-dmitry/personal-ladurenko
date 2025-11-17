/**
 * Smooth Scroll Composable
 * 
 * Provides smooth scrolling functionality with custom easing animations.
 * Uses requestAnimationFrame for optimal performance and cubic easing for natural motion.
 * 
 * @returns Object containing scrollToSection and scrollToTop functions
 */
export const useSmoothScroll = () => {
  /**
   * Smoothly scrolls to a specific section by its ID
   * 
   * @param sectionId - The ID of the target element to scroll to
   */
  const scrollToSection = (sectionId: string) => {
    // Find the target element by ID
    const element = document.getElementById(sectionId);
    
    if (element) {
      // Get current scroll position and target position
      const currentScrollY = window.scrollY;
      const targetScrollY = element.offsetTop;
      
      // Calculate the total distance to scroll
      const distance = Math.abs(targetScrollY - currentScrollY);
      
      // Calculate animation duration based on distance
      // Minimum 800ms, maximum 1500ms, scales with distance
      const duration = Math.min(Math.max(distance / 2, 800), 1500);
      
      // Record the start time for animation timing
      const startTime = performance.now();
      
      /**
       * Cubic ease-in-out easing function
       * Creates smooth acceleration at start and deceleration at end
       * 
       * @param t - Progress value between 0 and 1
       * @returns Eased progress value
       */
      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };
      
      /**
       * Animation frame callback that handles the smooth scrolling
       * 
       * @param currentTime - Current timestamp from requestAnimationFrame
       */
      const animateScroll = (currentTime: number) => {
        // Calculate elapsed time and progress (0 to 1)
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Apply easing to the progress for smooth motion
        const easedProgress = easeInOutCubic(progress);
        
        // Calculate current scroll position using eased progress
        const currentPosition = currentScrollY + (targetScrollY - currentScrollY) * easedProgress;
        
        // Update the scroll position
        window.scrollTo(0, currentPosition);
        
        // Continue animation if not complete
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      // Start the animation
      requestAnimationFrame(animateScroll);
    }
  };

  /**
   * Smoothly scrolls to the top of the page
   * Uses the same easing and animation system as scrollToSection
   */
  const scrollToTop = () => {
    // Get current scroll position
    const currentScrollY = window.scrollY;
    
    // Calculate animation duration based on current scroll position
    // Minimum 800ms, maximum 1500ms, scales with distance
    const duration = Math.min(Math.max(currentScrollY / 2, 800), 1500);
    
    // Record the start time for animation timing
    const startTime = performance.now();
    
    /**
     * Cubic ease-in-out easing function (same as scrollToSection)
     * Creates smooth acceleration at start and deceleration at end
     * 
     * @param t - Progress value between 0 and 1
     * @returns Eased progress value
     */
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    
    /**
     * Animation frame callback that handles scrolling to top
     * 
     * @param currentTime - Current timestamp from requestAnimationFrame
     */
    const animateScroll = (currentTime: number) => {
      // Calculate elapsed time and progress (0 to 1)
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Apply easing to the progress for smooth motion
      const easedProgress = easeInOutCubic(progress);
      
      // Calculate current scroll position (decreasing from currentScrollY to 0)
      const currentPosition = currentScrollY * (1 - easedProgress);
      
      // Update the scroll position
      window.scrollTo(0, currentPosition);
      
      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    // Start the animation
    requestAnimationFrame(animateScroll);
  };

  // Return the public API of the composable
  return {
    scrollToSection,
    scrollToTop
  };
};
