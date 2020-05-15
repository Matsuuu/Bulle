import { TerminalColors } from "./Colors";
import Endpoint, { EndpointProps } from "./Endpoint";
import Parser, { CommandLineParams } from "./Parser";
import Hoster from "./Hoster";

const fastify = require("fastify")();

export default class Bulle {
  endpoints: Array<Endpoint> = [];
  port: number = 3000;
  latestEndpointHit: Endpoint = new Endpoint({} as EndpointProps);

  constructor() {
    console.clear();
    console.log(`${TerminalColors.FgWhite}Starting up Bulle Mock server... ☕`);
    console.log("");
    this.parseParams();
    this.host();
    this.runServer();
  }

  host(): void {
    const hoster = new Hoster();
    hoster.hostEndpoints(this.endpoints, fastify, (endpoint: Endpoint) =>
      this.handleEndpointHit(endpoint)
    );
  }

  handleEndpointHit(endpoint: Endpoint): void {
    const matchingEndpoints = this.endpoints.filter(
      (ep) => ep.method === endpoint.method && ep.path === endpoint.path
    );
    if (matchingEndpoints.length > 0) {
      matchingEndpoints[0].requestCount++;
    }
    this.latestEndpointHit = endpoint;
    this.printGui();
  }

  printGui(): void {
    console.clear();
    this.printInstanceInformation();
    this.printEndpoints();
  }

  printInstanceInformation(): void {
    console.log(
      `${TerminalColors.FgWhite}Bulle running in port ${TerminalColors.FgBlue}${this.port}`
    );
    console.log("");
  }

  printEndpoints(): void {
    const endpointsText = "======= Endpoints =======";
    const padding = process.stdout.columns / 2 - endpointsText.length / 2;
    console.log(
      `${TerminalColors.FgYellow}${" ".repeat(padding)}${endpointsText}\n\n`
    );
    this.endpoints.forEach((ep) => {
      process.stdout.write(TerminalColors.Reset);
      const background =
        this.latestEndpointHit && this.latestEndpointHit.is(ep)
          ? TerminalColors.Highlight
          : TerminalColors.Reset;
      process.stdout.write(`${background}    ➡️  `);
      process.stdout.write(
        `${background} ${TerminalColors.FgCyan}[${ep.method}]`
      );
      process.stdout.write(
        `${background} ${TerminalColors.FgYellow} ${" ".repeat(
          8 - ep.method.length
        )} /${ep.path}`
      );
      process.stdout.write(
        `${background} ${TerminalColors.FgWhite} ${" ".repeat(
          40 - ep.path.length
        )}Request count: ${ep.requestCount}`
      );
      process.stdout.write(`\n`);
    });
    process.stdout.write(TerminalColors.Reset);
  }

  getHttpMethodWithColor(method: string): string {
    return `${TerminalColors.FgCyan}${method}`;
  }

  async runServer(): Promise<void> {
    try {
      await fastify.listen(this.port);
      this.printGui();
    } catch (err) {
      console.error(TerminalColors.FgRed, err);
      process.exit(1);
    }
  }

  parseParams(): void {
    const parser = new Parser();
    const params: CommandLineParams = parser.parseParams();
    this.endpoints = params.routes;
    this.port = params.port;
  }
}
