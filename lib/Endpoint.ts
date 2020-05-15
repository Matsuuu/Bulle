export interface EndpointProps {
  path: string;
  method: string;
  responseCode: number;
  responseMessage: string;
  validations: Object;
}

export default class Endpoint {
  path: string;
  method: string;
  responseCode: number;
  responseMessage: string;
  validations: Object;
  requestCount: number = 0;

  constructor(props?: EndpointProps) {
    this.path = (props && props.path) || "";
    this.method = (props && props.method) || "GET";
    this.responseCode = (props && props.responseCode) || 200;
    this.responseMessage = (props && props.responseMessage) || "";
    this.validations = (props && props.validations) || {};
  }

  is(endpoint: Endpoint): boolean {
    return this.path === endpoint.path && this.method === endpoint.method;
  }
}
