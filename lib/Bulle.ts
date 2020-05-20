import Endpoint, { EndpointProps } from './Endpoint';
import Parser, { CommandLineParams } from './Parser';
import { TerminalColors } from './Colors';
import Hoster from './Hoster';

const fastify = require('fastify')();

export default class Bulle {
    endpoints: Array<Endpoint> = [];
    port: number = 3000;
    logFile?: string = undefined;
    latestEndpointHit: Endpoint = new Endpoint({} as EndpointProps);

    constructor() {
        console.clear();
        console.log(`${TerminalColors.FgWhite}Starting up Bulle Mock server... ☕`);
        console.log('');
        fastify.register(require('fastify-cors'), {
            // put your options here
        });
        this.parseParams();
        this.host();
        this.runServer();
    }

    host(): void {
        const hoster = new Hoster();
        hoster.hostEndpoints(
            this.endpoints,
            fastify,
            (endpoint: Endpoint) => this.handleEndpointHit(endpoint),
            this.logFile
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
        console.log(`${TerminalColors.FgWhite}Bulle running in port ${TerminalColors.FgBlue}${this.port}`);
        console.log('');
    }

    printEndpoints(): void {
        const endpointsText = '======= Endpoints =======';
        const padding = process.stdout.columns / 2 - endpointsText.length / 2;
        console.log(`${TerminalColors.FgYellow}${' '.repeat(padding)}${endpointsText}\n\n`);
        this.endpoints.forEach((ep) => {
            process.stdout.write(TerminalColors.Reset);
            const background =
                this.latestEndpointHit && this.latestEndpointHit.is(ep)
                    ? TerminalColors.Highlight
                    : TerminalColors.Reset;
            process.stdout.write(`${background}    ➡️  `);
            process.stdout.write(`${TerminalColors.FgCyan}[${ep.method}]`);
            process.stdout.write(`${TerminalColors.FgYellow} ${' '.repeat(8 - ep.method.length)} /${ep.path}`);
            process.stdout.write(
                `${TerminalColors.FgWhite} ${' '.repeat(40 - ep.path.length)}Request count: ${ep.requestCount}`
            );
            // Dirty hack to add some padding so it's nicer when it's highlighted
            process.stdout.write(' '.repeat(5));
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
        this.logFile = params.logFile;
    }
}
