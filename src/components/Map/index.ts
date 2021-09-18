export declare class Map {
  target: string;
  baseMap?: string;
  center: number[];
  zoom?: number;
  events?: object;
  addWMSLineLayer: (options: object) => object;
  addWMSPointLayer: (options: object) => object;
}
