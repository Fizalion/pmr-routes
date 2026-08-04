export type TransportType = "minibus";

export type ServiceDays = "daily";

export type PriceDataStatus = "confirmed";

export type RouteDataStatus = "official" | "published";

export type ScheduleDataStatus = "needs_app_verification";

export type City = {
  id: string;
  name: string;
};

export type Currency = {
  code: string;
  name: string;
  symbol: string;
};

export type RouteDirection = {
  from: string;
  to: string;
};

export type RoutePrice = {
  amount: number;
  display: string;
};

export type IntervalMinutes = {
  min: number;
  max: number;
};

export type RouteSchedule = {
  days: ServiceDays;
  daysLabel: string;
  firstDeparture: string;
  lastDeparture: string;
  intervalMinutes: IntervalMinutes;
  intervalLabel: string;
  forwardDepartures?: string[];
  backwardDepartures?: string[];
};

export type RouteStreets = {
  forward?: string[];
  backward?: string[];
  backwardDifferences?: string[];
  circular?: string[];
};

export type RouteDataStatuses = {
  price: PriceDataStatus;
  route: RouteDataStatus;
  schedule: ScheduleDataStatus;
};

export type TransportRoute = {
  id: string;
  number: string;
  type: TransportType;
  name: string;
  isCircular?: boolean;
  direction: RouteDirection;
  price: RoutePrice;
  schedule: RouteSchedule;
  routeStreets: RouteStreets;
  features?: string[];
  dataStatus: RouteDataStatuses;
  cityId: string;
  scheduleSource?: string;
  scheduleCheckedAt?: string;
  category?: string;
  stops?: {
    id: string;
    displayOrder: number;
    name: string;
    address: string;
    settlement: string;
    distanceFromStart: number;
    distanceBetweenPrevious: number;
    distanceToEnd: number;
  }[];
};

export type TransportData = {
  cities: City[];
  currency: Currency;
  routes: TransportRoute[];
};
