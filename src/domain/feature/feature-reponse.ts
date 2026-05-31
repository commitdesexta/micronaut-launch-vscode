import { Feature } from "./feature";
import { Links } from "./links";

export interface FeatureResponse {
    _links: Links
    features: Feature[]
}