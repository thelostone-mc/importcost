'use babel';

import {importCost, cleanup, JAVASCRIPT, TYPESCRIPT} from 'import-cost';
import Walker from 'node-source-walk';
import size from './size';
import {convertBytes} from './utils';

const sourcewalk = source => {
  return new Promise(resolve => {
    const TYPES = /ImportDeclaration/;

    let walker = new Walker();
    let modules = [], promises = [];

    try {
      walker.walk(source, node => {
        if(TYPES.test(node.type)) {
          if(node.source && node.source.value) {
            let module = {
              name: node.source.value,
              line: node.source.loc.start.line
            };
            modules.push(module);
          }
        } else if (node.type == 'CallExpression'
          && node.callee && node.callee.name == "require") {
            node.arguments.forEach((arg) => {
              let module = {
                name: arg.value,
                line: arg.loc.start.line,
              };
              modules.push(module);
            });
        }
      });
    } catch (error) {
      console.log("walker:", error);
    }

    modules.forEach(module => {
      promises.push(invokeSize(module));
      if(modules.length == promises.length) {
        Promise.all(promises).then((_modules) => {
          resolve(_modules);
        });
      }
    });
  });
};

const invokeSize = module => {
  return new Promise((resolve) => {
    size(module.name).then(size => {
      module.gzip = size;
      resolve(module);
    });
  });
};

const wiximport = async (source, path) => {
  return new Promise((resolve, reject) => {

    if(!source || !path) return null;
    let emitter;
    if(path.endsWith(".ts")) emitter = importCost(path, source, TYPESCRIPT);
    else emitter = importCost(path, source, JAVASCRIPT);

    emitter.on('error', error => reject(error));
    emitter.on('done', modules => {

      emitter.removeAllListeners();
      let _modules = [];
      modules.forEach((module, count) => {
        module.gzip = convertBytes(module.gzip);
        _modules.push(module);
        if(modules.length === count+1) resolve(_modules);
      })
    });
  });
};

/*
 * Returns an array of modules
 * modules = [{
 *    name: String,
 *    size: Number,
 *    gzip: Number,
 *    line: Number
 * }]
 */
module.exports = (source, path) => {

  return new Promise(resolve => {
    if(!source) return [];
    wiximport(source, path).then((modules) => {
      // TODO: Work on fallback logic when module isn't found
      if(modules) resolve(modules);
      else sourcewalk(source).then(modules => resolve(modules));
    }).catch(error => {
      sourcewalk(source).then(modules => resolve(modules));
    });
  });
};
