// src/utils/analytics.ts
export type AnalyticsEvent = 
  | 'project_created'
  | 'meta_prompt_created'
  | 'meta_prompt_copied'
  | 'kusk_stage_completed'
  | 'export_triggered';

export function trackEvent(event: AnalyticsEvent, data?: Record<string, unknown>) {
  // Локальное логирование (не отправляем на сервер — приватность)
  console.log(`[Analytics] ${event}`, { 
    timestamp: new Date().toISOString(),
    ...data 
  });
  
  // Можно добавить отправку в Яндекс.Метрику / GA4 позже:
  // if (window.gtag) {
  //   window.gtag('event', event, data);
  // }
}