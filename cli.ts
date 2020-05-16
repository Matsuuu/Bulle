import Bulle from "./lib/Bulle";

export default class BulleCLI {
  init(): void {
    if (
      process.argv.includes("--help") ||
      process.argv.includes("-h") ||
      process.argv.length <= 2
    ) {
      this.printHelpDialog();
      return;
    }
    new Bulle();
  }

  printHelpDialog(): void {
    console.log(
      [
        "Usage: bulle [port] [routes]",
        "",
        "options:",
        "  -p       Port to host the Bulle Mock API on. [3000]",
        "  -r       Route for hosting a mock API path",
        "",
        "",
        "Route params:",
        "",
        "Path                        -   Format: String. e.g. ping.  Determines the API path of route",
        "",
        "Response Code               -   Format: HTTP response code (100-500)  Determines the Response",
        "                                code of the API endpoint on a successfull call",
        "",
        "Response message            -   Format: JSON object in quotes.",
        '                                e.g. \'{"success": true, "message": "Hello World"}\'',
        "                                Determines the response message from the Mock API on a ",
        "                                successfull call",
        "",
        "Response message (file)     -   Format: .json file name. e.g. my-payload.json ",
        "                                Determines the response message from the Mock API on a",
        "                                successfull call",
        "",
        "Validation params           -   Format: Key-value pairs seperated by a semicolon.",
        "                                e.g. id=number;name=string  Determines the types of data,",
        "                                the API routes is expecting. Returns 422 on a failed check.",
        "",
        "Route examples:",
        "",
        '  Host a endpoints at localhost:3000/ping, which will return {"message": "pong"} on a GET call',
        "",
        '    bulle -r ping \'{"message": "pong"}\'',
        "",
        "  Host multiple endpoints on a custom port",
        "",
        "    bulle -p 9001 \\",
        '    -r ping 200 \'{"message": "pong"}\' \\',
        '    -r users 200 \'[{"id": 1, "name": "Foo"}, {"id": 2, "name": "Bar"}]\' \\',
        "    -r users/add POST 201 '{\"success\": true}' 'id=number;name=string'",
        "",
      ].join("\n")
    );
  }
}

const bcli = new BulleCLI();
bcli.init();
