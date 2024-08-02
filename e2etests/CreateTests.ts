import * as testFx from "@microsoft/azureportal-test";
import until = testFx.until;
import { TestSupport } from "./utils/TestSupport";

describe("Create Test", function () {
    this.timeout(0);
    const testSupport = new TestSupport(this);

    before(async () => {
        testSupport.initializePortalContext();
    });

    beforeEach(() => {
        // Before each test do this
    });

    it("CreateForm blade loads successfully", async () => {
        await testFx.portal.navigateToUriFragment("blade/DataManagementTest/CreateForm_dx", testFx.Utils.DefaultTimeouts.longTimeout);
        await testFx.portal.wait(until.isPresent(testFx.portal.blade({ title: "Create My Resource" })));
    });

    afterEach(function () {
        if (this.currentTest.state === "failed") {
            return testSupport.gatherTestFailureDetails(this.currentTest.title);
        }
    });

    after(async () => {
        await testFx.portal.quit();
    });
});
