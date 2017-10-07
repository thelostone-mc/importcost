'use babel';

import readPkgUp from 'read-pkg-up';

const tag = /[~>=<^]/g;
module.exports = module => {
  let version = null;
  const path = atom.workspace.getActiveTextEditor().getDirectoryPath();
  if(!path) return null;

  const pkg = readPkgUp.sync({cwd: path}).pkg;

  if(pkg.dependencies && pkg.dependencies[module])
    version = pkg.dependencies[module];
  else if(pkg.devDependencies && pkg.devDependencies[module])
    version = pkg.devDependencies[module];
  return (version ? version.replace(tag, "") : version);
};
