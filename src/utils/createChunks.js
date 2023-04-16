export const createChunks = (file,chunkSize) => {
    let start = 0
    var fileSize = file.size
    let end = 0
    let index = 0
    let chunks = []
    while(start < fileSize){
        end = start + chunkSize
        if(end>fileSize){
            end = fileSize
        }
        const chunk = file.slice(start,end)
        chunks.push({
            index:index,
            size:chunk.size,
            data:chunk
        })
        start = end;
        index++;
    }
    return chunks
}