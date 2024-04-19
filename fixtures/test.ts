import { test as base } from '@playwright/test'
import { TestDataManager } from '../utils/TestDataManager'


export const test = base.extend({
    resource: async({page}, use)=>{
        const data_manager = new TestDataManager()
        const resource_path = process.env.DATA_SOURCE

        if (resource_path && resource_path !=""){
            
            try{
                const source_type = await data_manager.get_source_type(resource_path)
                const resource_file = await data_manager.read_file(resource_path)
                const data = await data_manager.import_data(resource_file, source_type)
                await use(data)
            }catch(err){
                throw new Error(`Error during reading data from ${resource_path}: ${err}`)
            }
        }
    }
})

export { expect } from '@playwright/test'