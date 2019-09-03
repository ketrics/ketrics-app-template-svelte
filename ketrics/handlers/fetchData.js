const debug = true;

function getQuery(data){
    return `
       SELECT 1 AS id
    `;
}

function handler(data){
    if(debug){
        return {
            script: getQuery(data),
            data
        }
    }else{
        return [
            {
                name: 'fetchData',
                sql: getQuery(data),
                output: 'data'
            }
        ]
    }
}
