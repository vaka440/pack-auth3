import { Base } from "src/app/core/http/models/base";

export interface IProduct extends Base {
  name: string;
  cost: number;
  quantity: number;
}
