export interface EndpointProps {
  address: string;
  method: string;
  responseCode: number;
  responseMessage: string;
  validations: Map<String, String>;
}

export default class Endpoint {
  address: string;
  method: string;
  responseCode: number;
  responseMessage: string;
  validations: Map<String, String>;
  requestCount: number = 0;

  constructor(props: EndpointProps) {
    this.address = props.address || "";
    this.method = props.method || "GET";
    this.responseCode = props.responseCode || 200;
    this.responseMessage = props.responseMessage || "";
    this.validations = props.validations || new Map();
  }

  is(endpoint: Endpoint): boolean {
    return this.address === endpoint.address && this.method === endpoint.method;
  }
}
