'use babel';
import axios from 'axios';
import version from './version';
import {convertBytes} from  './utils';

let cache = {};

module.exports = module => {
  return new Promise((resolve, reject) => {
    if(!module) reject("module: name is empty");

    const v = version(module);

    if(v) module += "@" + v;
    if(cache[module]) resolve(cache[module]);

    const url = "https://bundlephobia.com/api/size?package=" + module;

    axios.get(url).then(response => {
      if(response.data && response.data.gzip) {
        const size = convertBytes(response.data.gzip);
        cache[module] = size;
        resolve(size);
      }

      reject("module: unable look up " + module);
    });
  });
};
