export class Inspection {
  _id: string;
  plan: Plan;
  vehicle: Vehicle;
  status: string;
  finalStatus: string;
  startTime: Date;
  endTime: Date;
  odometer: number;
  performedBy: User;
  duration: number;
  location: string;
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
  client: Client;
  disabled: boolean;
}

export class Vehicle {
  _id: string;
  make: string;
  model: string;
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

export class AuthData {
  email: string;
  password: string;
}
