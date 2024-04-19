import { Reader } from "./Reader";
import { parseString, Parser } from "xml2js"

export class XMLReader implements Reader{
    constructor(){}

    async read(source: Buffer){
        throw new Error("XML Reader not implemented yet")
    }
}