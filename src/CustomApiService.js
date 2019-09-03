import {KetricsService} from 'ketrics-utils/Ketrics';

export class CustomApiService extends KetricsService{

    async fetchApplication(){
        try{
            const response = await this.get({endPoint: `/applications/${this.applicationUUID}`});
            return response;
        }catch(error){
            throw error;
        }
    }

    async setup(){
        try{
            await this.runHandler('setup');
        }catch(error){
            throw error;
        }
    }


    async fetchData(data){
        try{
            const response = await this.runHandler('fetchData', data);
            return response.data.data;
        }catch(error){
            throw error;
        }
    }

    async processExcelData(data){
        const application = await this.fetchApplication();
        const {SheetName, HeaderRegEx} = application.settings;
        const lines = data[SheetName].split("\n");
        const re = new RegExp(HeaderRegEx, 'g');
        const headerIndex = lines.findIndex(line=>line.toLowerCase().search(re)===1);

        let newData=[];
        if(headerIndex>-1){
            const headers = lines[headerIndex].split("|");

            headers.forEach((key, index)=>{
                headers[index] = key === "" ? "col"+index: key.toLowerCase().trim();
            });

            lines.slice(headerIndex+1).forEach(line=>{
                let values = line.split("|");
                let obj = headers.reduce((obj, k, i) => ({...obj, [k]: values[i] }), {});

                if(this.validateExcelRow(obj)){
                    newData.push({

                    });
                }
            });
        }
        return newData;
    }

    validateExcelRow(obj){
        return true;
    }
}
