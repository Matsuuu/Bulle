import Endpoint, { EndpointProps } from "./Endpoint";

const commandArgs: Array<string> = ["-r"];
const httpMethods = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "HEAD",
  "PATCH",
  "OPTIONS",
  "TRACE",
  "CONNECT",
];

export interface CommandLineParams {
  routes: Array<Endpoint>;
}

export default class Parser {
  args: Array<string> = [];
  argIterator: number = 0;
  commandLineParams: CommandLineParams = { routes: [] };
  commandArgPositions: Array<number> = [];
  commandsAdded: number = 0;

  parseParams(): CommandLineParams {
    this.args = process.argv;
    this.mapCommandArgPositions();

    while (this.argIterator < this.args.length) {
      if (this.isCommandArgument(this.args[this.argIterator])) {
        this.handleArgumentParameter();
      }
      this.argIterator++;
    }
    return this.commandLineParams;
  }

  mapCommandArgPositions(): void {
    this.args.forEach((a, i) => {
      if (this.isCommandArgument(a)) {
        this.commandArgPositions.push(i);
      }
    });
  }

  isCommandArgument(arg: string): boolean {
    return commandArgs.includes(arg);
  }

  handleArgumentParameter(): void {
    switch (this.args[this.argIterator]) {
      case "-r":
        this.addRoute();
        break;
    }
    this.commandsAdded++;
  }

  addRoute() {
    const routeInfo: Array<string> = [];
    let routeInfoIterator = this.argIterator + 1;
    let routeInfoEnd = this.commandArgPositions[this.commandsAdded + 1];
    if (!routeInfoEnd) routeInfoEnd = this.args.length;
    while (routeInfoIterator < routeInfoEnd) {
      routeInfo.push(this.args[routeInfoIterator]);
      routeInfoIterator++;
    }

    const hasReturnCode: boolean = this.hasReturnCode(routeInfo);
    const hasHttpMethod: boolean = this.hasHttpMethod(routeInfo);
    const httpMethodPosition = this.getHttpmethodPosition(hasHttpMethod);
    const responseCodePosition = this.getResponseCodePosition(
      hasReturnCode,
      hasHttpMethod
    );
    const responseMessagePosition: number = this.getResponseMessagePosition(
      hasReturnCode,
      hasHttpMethod
    );

    this.commandLineParams.routes.push(
      new Endpoint({
        address: this.args[this.argIterator + 1],
        method: hasHttpMethod ? this.args[httpMethodPosition] : "GET",
        responseCode: hasReturnCode ? this.args[responseCodePosition] : 200,
        responseMessage: this.args[responseMessagePosition],
      } as EndpointProps)
    );
  }

  getHttpmethodPosition(hasHttpMethod: boolean): number {
    if (!hasHttpMethod) {
      return 0;
    }
    return this.argIterator + 2;
  }

  getResponseCodePosition(
    hasReturnCode: boolean,
    hasHttpMethod: boolean
  ): number {
    if (!hasReturnCode) {
      return 0;
    }
    return hasHttpMethod ? this.argIterator + 3 : this.argIterator + 2;
  }

  getResponseMessagePosition(
    hasReturnCode: boolean,
    hasHttpMethod: boolean
  ): number {
    let pos = this.argIterator + 4;
    if (!hasReturnCode) pos--;
    if (!hasHttpMethod) pos--;
    return pos;
  }

  hasReturnCode(routeInfo: Array<string>): boolean {
    return routeInfo.some((info: any) => {
      info = Number(info);
      return !Number.isNaN(info) && info >= 200 && info <= 500;
    });
  }

  hasHttpMethod(routeInfo: Array<string>): boolean {
    return routeInfo.some((info: any) => httpMethods.includes(info));
  }
}
