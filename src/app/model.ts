export class Inspection {
  _id: string;
  plan: Plan;
  vehicle: Vehicle;
  status: string;
  date: Date;
  odometer: number;
  performedBy: User;
  duration: number;
  location: string;
  result: [{ item: Item, result: string, img: string }];
}

export class Plan {
  _id: string;
  title: string;
  vehicles: [Vehicle];
  frequency: string;
  lastModified: Date;
  items: [Item];
}

export class Vehicle {
  _id: string;
  make: string;
  model: string;
  rego: string;
  driver: User;
}

export class Item {
  _id: string;
  title: string;
  instruction: string;
}

export class User {
  _id: string;
  name: string;
  email: string;
  password: string;
  vehicle: Vehicle;
}

