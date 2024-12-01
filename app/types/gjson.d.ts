export interface GJSON {
    type: "FeatureCollection";
    readonly features: ReadonlyArray<{
        type: "Feature";
        geometry: {
            type:
                | "LineString"
                | "Point"
                | "Polygon"
                | "MultiLineString"
                | "MultiPoint"
                | "MultiPolygon";
            coordinates: ReadonlyArray<
                | number
                | readonly [number, number]
                | readonly [number, number, number]
            >;
        };
        properties: Record<string, any>;
    }>;
}

export interface Map {
    id: string;
    name: string;
    type: string;
    geojson: GJSON;
}
