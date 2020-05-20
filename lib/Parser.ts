import Endpoint, { EndpointProps } from './Endpoint';
import RouteParser from './parsers/RouteParser';
import { HttpMethodsList } from './enums/HttpMethods';

const commandArgs: Array<string> = ['-r', '--route', '-p', '--port', '-L', '--logs'];

export interface CommandLineParams {
    routes: Array<Endpoint>;
    port: number;
    logFile?: string;
}

const routeParser = new RouteParser();

export default class Parser {
    args: Array<string> = [];
    argIterator: number = 0;
    commandLineParams: CommandLineParams = { routes: [], port: 3000, logFile: undefined };
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
            case '-r':
            case '--route':
                this.addRoute();
                break;
            case '-p':
            case '--port':
                this.addPort();
                break;
            case '-L':
            case '--logs':
                this.addLogs();
                break;
        }
        this.commandsAdded++;
    }

    addPort(): void {
        this.commandLineParams.port = Number(this.args[this.argIterator + 1]);
    }

    addRoute(): void {
        let routeInfoEnd = this.commandArgPositions[this.commandsAdded + 1];
        if (!routeInfoEnd) routeInfoEnd = this.args.length;

        this.commandLineParams.routes.push(routeParser.parse(this.args.slice(this.argIterator, routeInfoEnd)));
    }

    addLogs(): void {
        this.commandLineParams.logFile = this.args[this.argIterator + 1];
    }

    getHttpmethodPosition(hasHttpMethod: boolean): number {
        if (!hasHttpMethod) {
            return 0;
        }
        return this.argIterator + 2;
    }

    getResponseCodePosition(hasReturnCode: boolean, hasHttpMethod: boolean): number {
        if (!hasReturnCode) {
            return 0;
        }
        return hasHttpMethod ? this.argIterator + 3 : this.argIterator + 2;
    }

    getResponseMessagePosition(hasReturnCode: boolean, hasHttpMethod: boolean): number {
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
        return routeInfo.some((info: any) => HttpMethodsList.includes(info));
    }
}
