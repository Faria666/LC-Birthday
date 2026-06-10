export interface CountdownValue {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly isExpired: boolean;
}

export type PageState = 'countdown' | 'celebration';
