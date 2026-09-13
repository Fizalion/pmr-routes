import type { RouteStatus } from "./route";

export type OfficialRouteDeparturePoint = {
  name: string;
  address?: string;
  mapUrl?: string;
  phone?: string;
  phoneLabel?: string;
};

export type OfficialRouteFare = {
  amount: number;
  currency: string;
  display: string;
  note?: string;
};

export type OfficialRouteTravelTimePoint = {
  id: string;
  name: string;
  minMinutes: number;
  maxMinutes: number;
  medianMinutes: number;
  sampleSize: number;
  isReference: boolean;
};

export type OfficialRouteDirection = {
  from: string;
  to: string;
  departurePoint?: OfficialRouteDeparturePoint;
  arrivalPoint?: OfficialRouteDeparturePoint;
  travelTimePoints?: OfficialRouteTravelTimePoint[];
  fare?: OfficialRouteFare;
};

export type OfficialRouteDirections = {
  forward: OfficialRouteDirection;
  backward: OfficialRouteDirection;
};

export type OfficialRouteScheduleStatus =
  | "available"
  | "estimated"
  | "unavailable";

export type OfficialRouteSchedule = {
  forwardDepartures: string[];
  backwardDepartures: string[];
  forwardStatus?: OfficialRouteScheduleStatus;
  backwardStatus?: OfficialRouteScheduleStatus;
  forwardNote?: string;
  backwardNote?: string;
};

export type OfficialRouteStructureSource = {
  name: string;
  date: string;
};

export type OfficialRouteScheduleSource = {
  name: string;
  channel?: string;
  checkedAt: string;
};

export type OfficialRouteSources = {
  structure?: OfficialRouteStructureSource;
  schedule: OfficialRouteScheduleSource;
  fare?: OfficialRouteScheduleSource;
};

export type OfficialRouteStop = {
  id: string;
  displayOrder: number;
  name: string;
  address: string;
  settlement: string;
  distanceFromStart?: number;
  distanceBetweenPrevious?: number;
  distanceToEnd?: number;
};

export type OfficialRoute = {
  id: string;
  officialNumber?: string;
  name: string;
  category: string;
  directions: OfficialRouteDirections;
  source: OfficialRouteSources;
  schedule: OfficialRouteSchedule;
  stops: OfficialRouteStop[];
  status: RouteStatus;
  slug: string;
  showFeedbackPrompt?: boolean;
};
