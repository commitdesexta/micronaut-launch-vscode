import { FeatureResponse } from "../domain/feature/feature-reponse";


export enum Features {
    DEFAULT = "default",
    CLI = "cli",
    FUNCTION = "function",
    GRPC = "grpc",
    MESSAGING = "messaging"
}

export class MicronautFeatureService {
    static getFeatureUrl(feature: Features): string {
        return `https://launch.micronaut.io/application-types/${feature}/features`;
    }

    static async getFeatures(feature: Features): Promise<FeatureResponse> {
        const response = await fetch(this.getFeatureUrl(feature));

        if (!response.ok) {
            throw new Error(`Erro ao buscar features: ${response.status}`);
        }

        return await response.json() as FeatureResponse;
    }
}