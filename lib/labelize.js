'use babel';

import { Point } from 'atom';

module.exports = (editor, module) => {
  if(!module.size && !module.gzip) return;

  const row = (module.line - 1);
  const col = editor.lineLengthForScreenRow(row);
  const point = new Point(row, col);
  const marker = editor.markScreenPosition(point);
  const span = document.createElement("span");
  span.className = "label";
  span.textContent = module.gzip;

  const decorater = editor.decorateMarker(marker, {
    type: "overlay",
    item: span
  });
  return decorater;
}
