export function getFileIcon(file) {
  let lastDotIndex = file.lastIndexOf(".");
  let extension = ''
  if (lastDotIndex === -1) {
    extension = ""; // 如果没有找到点号，返回空字符串
  } else {
    extension = file.slice(lastDotIndex + 1);
  }
  switch (extension) {
    case '':
      return String.fromCharCode(parseInt('e6ea', 16));
    case 'pdf':
      return String.fromCharCode(parseInt('e626;', 16));
    case 'doc':
    case 'docx':
      return String.fromCharCode(parseInt('e99a;', 16));
    case 'xls':
    case 'xlsx':
      return String.fromCharCode(parseInt('e998;', 16));
    case 'ppt':
    case 'pptx':
      return String.fromCharCode(parseInt('e943;', 16));
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return String.fromCharCode(parseInt('e65b', 16));
    case 'mp3':
    case 'wav':
    case 'flac':
      return String.fromCharCode(parseInt('ecf7;', 16));
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
      return String.fromCharCode(parseInt('e678', 16));
    case 'txt':
      return String.fromCharCode(parseInt('e613', 16));
    case 'js':
    case 'c':
    case 'cpp':
    case 'h':
    case 'hpp':
    case 'py':
    case 'java':
    case 'go':
    case 'rb':
    case 'swift':
    case 'ts':
      return String.fromCharCode(parseInt('e622;', 16));
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
    case 'bz2':
    case 'xz':
    case 'z':
      return String.fromCharCode(parseInt('e6bd;;', 16));
    default:
      return String.fromCharCode(parseInt('e601', 16));
  }
}
