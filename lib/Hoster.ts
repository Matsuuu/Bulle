import Endpoint from "./Endpoint";

export default class Hoster {
  hostEndpoints(
    endpoints: Array<Endpoint>,
    fastify: any,
    endpointHitCallback: Function
  ): void {
    endpoints.forEach((ep) => {
      switch (ep.method) {
        case "GET":
          fastify.get(`/${ep.path}`, async (request, reply) => {
            if (this.inputIsValid(request.body, ep)) {
              this.replySuccess(reply, ep, endpointHitCallback);
            } else {
              this.replyInvalidInput(reply, ep, endpointHitCallback);
            }
          });
          break;
        case "POST":
          fastify.post(`/${ep.path}`, async (request, reply) => {
            if (this.inputIsValid(request.body, ep)) {
              this.replySuccess(reply, ep, endpointHitCallback);
            } else {
              this.replyInvalidInput(reply, ep, endpointHitCallback);
            }
          });
        case "PUT":
          fastify.put(`/${ep.path}`, async (request, reply) => {
            if (this.inputIsValid(request.body, ep)) {
              this.replySuccess(reply, ep, endpointHitCallback);
            } else {
              this.replyInvalidInput(reply, ep, endpointHitCallback);
            }
          });
          break;
        case "DELETE":
          fastify.delete(`/${ep.path}`, async (request, reply) => {
            if (this.inputIsValid(request.body, ep)) {
              this.replySuccess(reply, ep, endpointHitCallback);
            } else {
              this.replyInvalidInput(reply, ep, endpointHitCallback);
            }
          });
          break;
        case "PATCH":
          fastify.patch(`/${ep.path}`, async (request, reply) => {
            if (this.inputIsValid(request.body, ep)) {
              this.replySuccess(reply, ep, endpointHitCallback);
            } else {
              this.replyInvalidInput(reply, ep, endpointHitCallback);
            }
          });
          break;
        case "HEAD":
          fastify.head(`/${ep.path}`, async (request, reply) => {
            if (this.inputIsValid(request.body, ep)) {
              this.replySuccess(reply, ep, endpointHitCallback);
            } else {
              this.replyInvalidInput(reply, ep, endpointHitCallback);
            }
          });
          break;
        case "CONNECT":
          fastify.connect(`/${ep.path}`, async (request, reply) => {
            if (this.inputIsValid(request.body, ep)) {
              this.replySuccess(reply, ep, endpointHitCallback);
            } else {
              this.replyInvalidInput(reply, ep, endpointHitCallback);
            }
          });
          break;
        case "OPTIONS":
          fastify.options(`/${ep.path}`, async (request, reply) => {
            if (this.inputIsValid(request.body, ep)) {
              this.replySuccess(reply, ep, endpointHitCallback);
            } else {
              this.replyInvalidInput(reply, ep, endpointHitCallback);
            }
          });
          break;
        case "TRACE":
          fastify.trace(`/${ep.path}`, async (request, reply) => {
            if (this.inputIsValid(request.body, ep)) {
              this.replySuccess(reply, ep, endpointHitCallback);
            } else {
              this.replyInvalidInput(reply, ep, endpointHitCallback);
            }
          });
          break;
        default:
          fastify.get(`/${ep.path}`, async (request, reply) => {
            if (this.inputIsValid(request.body, ep)) {
              this.replySuccess(reply, ep, endpointHitCallback);
            } else {
              this.replyInvalidInput(reply, ep, endpointHitCallback);
            }
          });
          break;
      }
    });
  }

  replySuccess(reply, ep: Endpoint, endpointHitCallback: Function): void {
    reply.code(ep.responseCode).send(ep.responseMessage);
    endpointHitCallback(ep);
  }

  replyInvalidInput(reply, ep: Endpoint, endpointHitCallback: Function): void {
    reply.code(422).send({ message: "Input data types invalid" });
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
}
