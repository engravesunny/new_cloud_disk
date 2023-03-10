export const timeToDate = (time) => {
    function formatDateTime(timestamp) {
        // 将时间戳转换为 Date 对象
        const dateObject = new Date(timestamp * 1000);
      
        // 计算时间差
        const now = new Date();
        const timeDiffInSeconds = Math.floor((now - dateObject) / 1000);
        // 判断时间差并格式化日期字符串
        if(timeDiffInSeconds < 60){
            return '刚刚'
        } else if (timeDiffInSeconds < 60 * 60) {
          const minutesAgo = Math.floor(timeDiffInSeconds / 60);
          return `${minutesAgo} 分钟前`;
        } else if (timeDiffInSeconds < 60 * 60 * 24) {
          const hoursAgo = Math.floor(timeDiffInSeconds / (60 * 60));
          return `${hoursAgo} 小时前`;
        } else {
          const year = dateObject.getFullYear();
          const month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
          const day = ('0' + dateObject.getDate()).slice(-2);
          const hours = ('0' + dateObject.getHours()).slice(-2);
          const minutes = ('0' + dateObject.getMinutes()).slice(-2);
          return `${year}-${month}-${day} ${hours}:${minutes}`;
        }
      }
      
      // 格式化日期时间字符串
      const formattedDateTime = formatDateTime(time);
      return formattedDateTime
}