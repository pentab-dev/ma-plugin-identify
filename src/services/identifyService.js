import { request } from '@penta-b/ma-lib';

import { QUERY_URL, TOLERANCE_DEFAULT } from '../constants/identifyConstants';

export const bufferPoint = (coordinates, resolution, tolerance = TOLERANCE_DEFAULT) => {
    const x = coordinates[0];
    const y = coordinates[1];
    
    const padding = resolution * tolerance / 2;

    return [x - padding, y - padding, x + padding, y + padding];
}

export const extentToPolygon = (minX, minY, maxX, maxY) => {
    return {
        "type":"Polygon",
        "coordinates": [[
            [minX, minY],
            [minX, maxY],
            [maxX, maxY],
            [maxX, minY],
            [minX, minY]
        ]]
    }
};

export const getFeatureCenter = (feature) => {
    var bbox = feature.getBBox();
    var center = [
        ((bbox[2] - bbox[0]) / 2) + bbox[0],
        ((bbox[3] - bbox[1]) / 2) + bbox[1]
    ];

    return center;
}

export const query = (params) => {
    return request.post(QUERY_URL, params);
};