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
          fastify.get(`/${ep.address}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
        case "POST":
          fastify.post(`/${ep.address}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
        case "PUT":
          fastify.put(`/${ep.address}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
        case "DELETE":
          fastify.delete(`/${ep.address}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
        case "PATCH":
          fastify.patch(`/${ep.address}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
        case "HEAD":
          fastify.head(`/${ep.address}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
        case "CONNECT":
          fastify.connect(`/${ep.address}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
        case "OPTIONS":
          fastify.options(`/${ep.address}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
        case "TRACE":
          fastify.trace(`/${ep.address}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
        default:
          fastify.get(`/${ep.address}`, async (request, reply) => {
            reply.code(ep.responseCode).send(ep.responseMessage);
            endpointHitCallback(ep);
          });
          break;
      }
    });
  }
}
