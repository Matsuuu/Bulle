import Endpoint from './Endpoint';
import fs from 'fs';

export default class Hoster {
    hostEndpoints(endpoints: Array<Endpoint>, fastify: any, endpointHitCallback: Function, logFile?: string): void {
        endpoints.forEach((ep) => {
            switch (ep.method) {
                case 'GET':
                    fastify.get(`/${ep.path}`, async (request, reply) => {
                        this.handleResponse(request, reply, ep, endpointHitCallback, logFile);
                    });
                    break;
                case 'POST':
                    fastify.post(`/${ep.path}`, async (request, reply) => {
                        this.handleResponse(request, reply, ep, endpointHitCallback, logFile);
                    });
                case 'PUT':
                    fastify.put(`/${ep.path}`, async (request, reply) => {
                        this.handleResponse(request, reply, ep, endpointHitCallback, logFile);
                    });
                    break;
                case 'DELETE':
                    fastify.delete(`/${ep.path}`, async (request, reply) => {
                        this.handleResponse(request, reply, ep, endpointHitCallback, logFile);
                    });
                    break;
                case 'PATCH':
                    fastify.patch(`/${ep.path}`, async (request, reply) => {
                        this.handleResponse(request, reply, ep, endpointHitCallback, logFile);
                    });
                    break;
                case 'HEAD':
                    fastify.head(`/${ep.path}`, async (request, reply) => {
                        this.handleResponse(request, reply, ep, endpointHitCallback, logFile);
                    });
                    break;
                case 'CONNECT':
                    fastify.connect(`/${ep.path}`, async (request, reply) => {
                        this.handleResponse(request, reply, ep, endpointHitCallback, logFile);
                    });
                    break;
                case 'OPTIONS':
                    fastify.options(`/${ep.path}`, async (request, reply) => {
                        this.handleResponse(request, reply, ep, endpointHitCallback, logFile);
                    });
                    break;
                case 'TRACE':
                    fastify.trace(`/${ep.path}`, async (request, reply) => {
                        this.handleResponse(request, reply, ep, endpointHitCallback, logFile);
                    });
                    break;
                default:
                    fastify.get(`/${ep.path}`, async (request, reply) => {
                        this.handleResponse(request, reply, ep, endpointHitCallback, logFile);
                    });
                    break;
            }
        });
    }

    handleResponse(request: any, reply: any, ep: Endpoint, endpointHitCallback: Function, logFile?: string): void {
        const inputIsValid = this.inputIsValid(request.body, ep);
        this.handleLogs(request, inputIsValid, ep, logFile);
        if (inputIsValid) {
            this.replySuccess(reply, ep, endpointHitCallback);
        } else {
            this.replyInvalidInput(reply, ep, endpointHitCallback);
        }
    }

    replySuccess(reply: any, ep: Endpoint, endpointHitCallback: Function): void {
        reply.code(ep.responseCode).send(ep.responseMessage);
        endpointHitCallback(ep);
    }

    replyInvalidInput(reply: any, ep: Endpoint, endpointHitCallback: Function): void {
        reply.code(422).send({ message: 'Input data types invalid' });
        endpointHitCallback(ep);
    }

    inputIsValid(requestBody: Object, endpoint: Endpoint): boolean {
        let isValid = true;
        for (let key of Object.keys(endpoint.validations)) {
            if (typeof requestBody[key] !== endpoint.validations[key]) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }

    handleLogs(request: any, inputIsValid: boolean, ep: Endpoint, logFile?: string): void {
        if (!logFile) {
            return;
        }
        const requestData = {
            requestData: {
                method: ep.method,
                endpoint: ep.path,
                payload: request.body,
            },
            responseData: {
                success: inputIsValid,
            },
        };
        let logData = JSON.stringify(requestData);
        if (fs.existsSync(logFile)) {
            logData = ',' + logData;
        } else {
            logData = '[' + logData;
        }
        if (fs.existsSync(logFile)) {
            const previousData: string = fs.readFileSync(logFile, 'utf8');
            logData = previousData.substring(0, previousData.length - 1) + logData;
        }
        logData += ']';
        fs.writeFile(logFile, logData, (err) => {
            if (err) throw err;
        });
    }
}
