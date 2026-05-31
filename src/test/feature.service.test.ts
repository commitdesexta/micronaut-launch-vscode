import * as assert from 'assert';
import { Feature } from "../domain/feature/feature";
import { FeatureResponse } from "../domain/feature/feature-reponse";
import { MicronautFeatureService, Features } from "../service/micronaut-feature.service";

suite("Test features", () => {
    test("get Micronaut Application", async () => {
        const v: FeatureResponse = await MicronautFeatureService.getFeatures(Features.DEFAULT);
        const url = String(v._links.self.href);
        assert.equal(true, url.includes(Features.DEFAULT));
    });

    test("get Command Line Application", async () => {
        const v: FeatureResponse = await MicronautFeatureService.getFeatures(Features.CLI);
        const url = String(v._links.self.href);
        assert.equal(true, url.includes(Features.CLI));
    });

    test("get Function Application for Serverless", async () => {
        const v: FeatureResponse = await MicronautFeatureService.getFeatures(Features.FUNCTION);
        const url = String(v._links.self.href);
        assert.equal(true, url.includes(Features.FUNCTION));
    });

    test("get gRPC Application", async () => {
        const v: FeatureResponse = await MicronautFeatureService.getFeatures(Features.GRPC);
        const url = String(v._links.self.href);
        assert.equal(true, url.includes(Features.GRPC));
    });

    test("get Messaging-Driven Application", async () => {
        const v: FeatureResponse = await MicronautFeatureService.getFeatures(Features.MESSAGING);
        const url = String(v._links.self.href);
        assert.equal(true, url.includes(Features.MESSAGING));
    });
});