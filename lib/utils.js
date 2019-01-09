'use babel';

const convertBytes = (bytes, mantissa = 2) => {
  if (bytes == 0) return 0;
  const NUMBER_OF_PEAS_IN_A_POD = 1024;
  const METRIC_LIST = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const powerToBeRaisedTo = Math.floor(Math.log(bytes) / Math.log(NUMBER_OF_PEAS_IN_A_POD));
  return parseFloat((bytes / Math.pow(NUMBER_OF_PEAS_IN_A_POD, powerToBeRaisedTo)).toFixed(mantissa)) + " " + METRIC_LIST[powerToBeRaisedTo];
}

module.exports = {
  convertBytes
}
