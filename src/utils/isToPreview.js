function getSuffixFromFilename(filename) {
    // 获取最后一个 . 出现的位置
    const lastDotIndex = filename.lastIndexOf('.');
    // 如果文件名中没有 . ，则返回空字符串
    if (lastDotIndex === -1) {
      return '';
    }
    // 返回从最后一个 . 的位置开始到字符串末尾的子字符串
    return filename.slice(lastDotIndex);
}

function getFileType(filename) {
    const suffix = getSuffixFromFilename(filename);
    if (suffix === '.mp3' || suffix === '.wav' || suffix === '.flac' || suffix === '.aac') {
      return 1; // 音乐文件
    } else if (suffix === '.mp4' || suffix === '.avi' || suffix === '.mov' || suffix === '.mkv') {
      return 2; // 视频文件
    } else if (suffix === '.jpg' || suffix === '.jpeg' || suffix === '.png' || suffix === '.gif') {
      return 3; // 图片文件
    } else {
      return 0; // 其他文件
    }
  }
  

  export default getFileType