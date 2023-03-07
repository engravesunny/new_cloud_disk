export const Capacity = (capacity) => {
    let res = capacity/1024/1024/1024
    if(res < 0.01){
        res = Math.round(res*1024) + 'MB' 
    } else if(res<0.00001){
        res = Math.round(res*1024*1024) + 'KB'
    } else {
        res = res + 'GB'
    }
    return res
}