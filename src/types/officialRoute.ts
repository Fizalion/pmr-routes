import type { RouteStatus } from "./route";

export type OfficialRouteDirection = {
  from: string;
  to: string;
};

export type OfficialRouteDirections = {
  forward: OfficialRouteDirection;
  backward: OfficialRouteDirection;
};

export type OfficialRouteSchedule = {
  forwardDepartures: string[];
  backwardDepartures: string[];
};

export type OfficialRouteStructureSource = {
  name: string;
  date: string;
};

export type OfficialRouteScheduleSource = {
  name: string;
  channel: string;
  checkedAt: string;
};

export type OfficialRouteSources = {
  structure: OfficialRouteStructureSource;
  schedule: OfficialRouteScheduleSource;
};

export type OfficialRouteStop = {
  id: string;
  displayOrder: number;
  name: string;
  address: string;
  settlement: string;
  distanceFromStart: number;
  distanceBetweenPrevious: number;
  distanceToEnd: number;
};

export type OfficialRoute = {
  id: string;
  officialNumber: string;
  name: string;
  category: string;
  directions: OfficialRouteDirections;
  source: OfficialRouteSources;
  schedule: OfficialRouteSchedule;
  stops: OfficialRouteStop[];
  status: RouteStatus;
  slug: string;
};
