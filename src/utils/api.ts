interface RequestInterface {
  request(string: string, options: object): any;
  setConfig(config: object): void;
}

interface Api {
  install(apis: any[]): void;
  getApi(name: string): string;
}

export declare function $request(name: string, options: object): any;
export declare const Request: RequestInterface;
export declare const api: Api;
export declare function $mockRequest(name: string, options: object): any;
