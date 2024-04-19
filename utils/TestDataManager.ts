import { ExcelReader } from "./ExcelReader";
import { JSONReader } from "./JSONReader";
import { XMLReader } from "./XMLReader";
import { Reader } from "../utils/Reader"
import fs from "fs"
import * as path from "path"

const SOURCE_TYPE = {
    XML: new XMLReader(),
    XLSX: new ExcelReader(),
    JSON: new JSONReader()
}

export class TestDataManager{
    constructor(){}

    async get_source_type(source: string): Promise<string>{
        const file_exists = fs.existsSync(source)
        if (!file_exists) throw new Error(`Data source does not exist on path ${source}`)
        const extention = path.extname(source)
        return extention ? extention.slice(1) : ""
    }

    async read_file(source_path: string): Promise<Buffer>{
        const file = fs.readFileSync(source_path)
        return file
    }

    async import_data(source: Buffer, type: string) {
        const src_type = type.toUpperCase()
        let reader: Reader
        try{
            reader = SOURCE_TYPE[src_type]

        }catch(err){
            throw new Error("Source type unsupported. Supported sources are: 'XML', 'JSON' and 'XLSX'.")
        }
        let data: any
        try{
          data  = await reader.read(source)
        }catch(err){
            throw new Error(`Error reading data from source. Full error: ${err}`)
        }
        console.log(data)

        return data
    }
}
 