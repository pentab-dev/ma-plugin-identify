export const IDENTIFY_ADD_FEATURES = "IDENTIFY_ADD_FEATURES";

export const identifyAddFeatures = (features, coordinates) => ({
    type: IDENTIFY_ADD_FEATURES,
    payload: {
        features,
        coordinates
    }
})