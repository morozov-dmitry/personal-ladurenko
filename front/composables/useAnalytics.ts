export const useAnalytics = () => {
  const config = useRuntimeConfig()
  
  // Check if analytics is enabled (has valid IDs)
  const isAnalyticsEnabled = computed(() => {
    return config.public.googleAnalyticsId && config.public.googleAnalyticsId.trim() !== ''
  })
  
  const getGtag = () => {
    if (process.client) {
      const nuxtApp = useNuxtApp()
      return nuxtApp.$gtag
    }
    return null
  }
  
  const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    if (!isAnalyticsEnabled.value) {
      console.log('Analytics disabled - event not tracked:', eventName, parameters)
      return
    }
    
    const $gtag = getGtag()
    if ($gtag && typeof $gtag === 'function') {
      $gtag('event', eventName, parameters)
    }
  }
  
  const trackConversion = (conversionId?: string) => {
    if (!isAnalyticsEnabled.value) {
      console.log('Analytics disabled - conversion not tracked')
      return
    }
    
    const $gtag = getGtag()
    if ($gtag && typeof $gtag === 'function') {
      const sendTo = conversionId || config.public.googleAdsConversionId
      $gtag('event', 'conversion', {
        'send_to': sendTo,
        'event_callback': () => {
          console.log('Conversion tracked successfully:', sendTo)
        }
      })
    }
  }
  
  const trackPageView = (pageTitle: string, pagePath: string) => {
    if (!isAnalyticsEnabled.value) {
      console.log('Analytics disabled - page view not tracked')
      return
    }
    
    const $gtag = getGtag()
    if ($gtag && typeof $gtag === 'function') {
      $gtag('config', config.public.googleAnalyticsId, {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: pagePath
      })
    }
  }
  
  const trackPhoneClick = () => {
    trackEvent('phone_click', {
      event_category: 'engagement',
      event_label: 'phone_number',
      value: 1
    })
  }
  
  const trackNavigationClick = (linkText: string) => {
    trackEvent('navigation_click', {
      event_category: 'navigation',
      event_label: linkText,
      value: 1
    })
  }
  
  return {
    isAnalyticsEnabled,
    trackEvent,
    trackConversion,
    trackPageView,
    trackPhoneClick,
    trackNavigationClick
  }
}
