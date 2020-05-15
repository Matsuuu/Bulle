import Endpoint from "../Endpoint";
import { HttpMethodsList } from "../enums/HttpMethods";

enum RouteParamType {
  path = "path",
  method = "method",
  responseCode = "responseCode",
  responseMessage = "responseMessage",
}

export default class RouteParser {
  parse(args: string[]): Endpoint {
    const endpoint: Endpoint = new Endpoint();
    args.forEach((arg) => {
      const argType: RouteParamType = this.getArgType(arg);
      // @ts-ignore
      endpoint[argType] = arg;
    });
    return endpoint;
  }

  getArgType(arg: string): RouteParamType {
    if (
      /^[a-zA-Z]+(\/[a-z0-9]+)*/i.test(arg) &&
      !HttpMethodsList.includes(arg)
    ) {
      return RouteParamType.path;
    }
    if (/[0-9]{3}/.test(arg)) {
      return RouteParamType.responseCode;
    }
    if (HttpMethodsList.includes(arg)) {
      return RouteParamType.method;
    }
    if (/^['({|[)]/.test(arg)) {
      return RouteParamType.responseMessage;
    }
    return RouteParamType.path;
  }
}
