import { Injectable } from '@nestjs/common';

@Injectable()
export class AmplitudeService {
  /**
   * Dispatches an event to Amplitude.
   * This logic will be implemented with Ampli CLI later as requested.
   */
  async trackEvent(userId: string, eventName: string, eventProperties: any): Promise<void> {
    // Non-blocking fire-and-forget logic
    // e.g., ampli.track(userId, eventName, eventProperties);
    console.log(`[Amplitude] Dispatching event: ${eventName} for User: ${userId}`);
  }
}
