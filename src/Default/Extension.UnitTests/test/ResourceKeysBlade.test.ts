import * as Di from "Fx/DependencyInjection";
import { assert } from "chai"; // type issues with node d.ts and require js d.ts so using chai
import { ResourceKeysBladeParameters, ResourceKeysBlade } from "Views/ResourceKeysBlade";
import * as ClientResources from "ClientResources";
import * as sinon from "sinon";
import { TemplateBladeHarness } from "@microsoft/azureportal-ut/Harness";

describe("Resource Keys Blade Tests", () => {
  let server: sinon.SinonFakeServer;

  beforeEach(function () {
    server = sinon.fakeServer.create();
    server.respondImmediately = true;
  });

  afterEach(function () {
    server.restore();
  });

  it("resource keys blade has correct title and subtitle", () => {
    // arrange
    const resourceId = "/subscriptions/0c82cadf-f711-4825-bcaf-44189e8baa9f/resourceGroups/sdfsdfdfdf/providers/Providers.Test/statefulIbizaEngines/asadfasdff";
    server.respondWith((request) => {
      if (request.url.startsWith(`${MsPortalFx.getEnvironmentValue("armEndpoint")}/batch`)
        && JSON.parse(request.requestBody).requests[0].url.endsWith(`${resourceId}?api-version=${MsPortalFx.getEnvironmentValue("armApiVersion")}`)) {
        request.respond(200, { "Content-Type": "application/json" }, JSON.stringify({
          "responses": [
            {
              "httpStatusCode": 200,
              "content": {
                "id": `${resourceId}`,
                "name": "bar",
                "type": "Providers.Test/statefulIbizaEngines",
                "location": "East Asia",
                "properties": {},
              },
            },
          ],
        }));
      } else {
        request.respond(404, null, "not mocked");
      }
    });

    const bladeParameters: ResourceKeysBladeParameters = { id: resourceId };
    // options for the blade under test. optional callbacks beforeOnInitializeCalled, afterOnInitializeCalled and afterRevealContentCalled
    // can be supplied to execute custom test code

    // get blade instance with context initialized and onInitialized called
    return TemplateBladeHarness.initializeBladeExtended(ResourceKeysBlade, {
      diContainer: Di.createContainer(),
      parameters: bladeParameters,
      afterOnInitializeCalled: (blade) => {
        console.log("after on init called");
      },
      beforeOnInitializeCalled: (blade) => {
        console.log("before on init called");
      },
      afterRevealContentCalled: (blade) => {
        console.log("after reveal called");
      },
    }).then(result => {
      const resourceKeysBlade = result.blade;
      assert.equal(resourceKeysBlade.title, ClientResources.resourceKeyBladeTitle);
      assert.equal(resourceKeysBlade.subtitle, ClientResources.resourceKeyBladeSubtitle);
    });
});
});
