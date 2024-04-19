import { Reader } from "./Reader";

export class JSONReader implements Reader{
    constructor(){}

    async read(source: Buffer){
        try{
            const file_Data = source.toString("utf-8")
            return JSON.parse(file_Data)
        }catch(err){
            throw new Error(`Error during reading JSON data from source`)
        }

    }
}