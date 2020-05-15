import Endpoint from "../Endpoint";
import { HttpMethodsList } from "../enums/HttpMethods";
import fs from "fs";

enum RouteParamType {
  path = "path",
  method = "method",
  responseCode = "responseCode",
  responseMessage = "responseMessage",
  responseMessageAsFile = "responseMessageAsFile",
}

export default class RouteParser {
  parse(args: string[]): Endpoint {
    const endpoint: Endpoint = new Endpoint();
    args.forEach((arg) => {
      const argType: RouteParamType = this.getArgType(arg);
      switch (argType) {
        case RouteParamType.responseMessageAsFile:
          fs.readFile(arg, (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            endpoint.responseMessage = data.toString();
          });
          break;
        default:
          // @ts-ignore
          endpoint[argType] = arg;
      }
    });
    return endpoint;
  }

  getArgType(arg: string): RouteParamType {
    if (
      /^[a-zA-Z]+(\/[a-z0-9]+)*(?<!\.json)$/i.test(arg) &&
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
    if (/.json/.test(arg)) {
      return RouteParamType.responseMessageAsFile;
    }
    return RouteParamType.path;
  }
}
