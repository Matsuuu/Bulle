import Endpoint from "../Endpoint";
import { HttpMethodsList } from "../enums/HttpMethods";
import fs from "fs";

enum RouteParamType {
  path = "path",
  method = "method",
  responseCode = "responseCode",
  responseMessage = "responseMessage",
  responseMessageAsFile = "responseMessageAsFile",
  validations = "validations",
  none = "none",
}

export default class RouteParser {
  parse(args: string[]): Endpoint {
    const endpoint: Endpoint = new Endpoint();
    args.forEach((arg) => {
      const argType: RouteParamType = this.getArgType(arg);
      switch (argType) {
        case RouteParamType.none:
          // Do nothing
          break;
        case RouteParamType.responseMessageAsFile:
          this.setResponseFromFile(endpoint, arg);
          break;
        case RouteParamType.validations:
          this.setValidationsToResponse(endpoint, arg);
          break;
        default:
          // @ts-ignore
          endpoint[argType] = arg;
      }
    });
    return endpoint;
  }

  setResponseFromFile(endpoint: Endpoint, arg: string) {
    fs.readFile(arg, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      endpoint.responseMessage = data.toString();
    });
  }

  setValidationsToResponse(endpoint: Endpoint, arg: string) {
    const validations = {};
    const validationPairs: Array<string> = arg.split(";");
    validationPairs.map((vp) => {
      const [k, v] = vp.split("=");
      validations[k] = v;
    });
    endpoint.validations = validations;
  }

  getArgType(arg: string): RouteParamType {
    if (
      /^[a-zA-Z-]+[\?]*[\/a-z0-9=-]*(?<!\.json)$/i.test(arg) &&
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
    if (/[\w=;]+/i.test(arg)) {
      return RouteParamType.validations;
    }
    return RouteParamType.none;
  }
}
