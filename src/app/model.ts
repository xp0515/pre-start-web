export class Inspection {
  _id: string;
  plan: Plan;
  vehicle: Vehicle;
  status: string;
  finalStatus: string;
  startTime: Date;
  endTime: Date;
  odometer: number;
  load: number;
  performedBy: User;
  duration: number;
  latitude: number;
  longitude: number;
  location: string;
  weights: {
    title: string;
    value: number;
    unit: string;
    result: string;
  }[];
  weightsResult: string;
  result: {
    item: Item;
    result: string;
    note: string;
    img: [string];
    startTime: Date;
    endTime: Date;
    duration: number;
  }[];
  signature: {
    type: string;
    data: [];
  };
  client: Client;
}

export class Plan {
  _id: string;
  title: string;
  vehicles: [Vehicle];
  frequency: {
    type: string;
    note: string;
    day: number;
  };
  lastModified: Date;
  items: [Item];
  massPlan: MassPlan;
  client: Client;
  disabled: boolean;
}

export class Vehicle {
  _id: string;
  make: string;
  model: string;
  maxLoad: number;
  rego: string;
  client: Client;
}

export class Item {
  _id: string;
  title: string;
  instruction: string;
  img: string;
  client: Client;
  critical: boolean;
  disabled: boolean;
}

export class User {
  _id: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  permission: number;
  client: Client;
}

export class Client {
  _id: string;
  name: string;
  admin: User;
  logo: string;
  declaration: string;
  email: string;
  mobile: string;
}

export class MassPlan {
  _id: string;
  title: string;
  weights: {
    title: string;
    value: number;
    unit: string;
  }[];
  disabled: boolean;
  client: Client;
}

export class AuthData {
  email: string;
  password: string;
}
