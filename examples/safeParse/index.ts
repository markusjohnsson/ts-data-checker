import { FeatureCollection } from "geojson";
import { checker } from "ts-data-checker";
import fs from "fs";

function parserFactory<T>(typeName: string, module: string) {
    
    const { checkJson } = checker(typeName, module);

    return function parse(s: string) {
        if (checkJson(s)) {
            return JSON.parse(s) as T;
        }
        else {
            throw new Error("type check failed");
        }
    }
}

const parseGeoJson = parserFactory<FeatureCollection>("FeatureCollection", "geojson");

const collection = parseGeoJson(String(fs.readFileSync("./data.json")));

console.log(collection.features[0].properties?.name);
