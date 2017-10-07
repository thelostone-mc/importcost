'use babel';

const convertBytes = bytes => {
  if(!bytes) return 0;
  else if(bytes < 5000000) return ((bytes / 1000).toFixed(1) + "KB");
  else if (bytes < 50000000) return ((bytes / 1000000).toFixed(2) + "MB");
  else return ((bytes / 1000000000).toFixed(2) + "GB");
}

module.exports = {
  convertBytes
}
