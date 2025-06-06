/**
 * Detects the luminosity and average color values of an image.
 * @param {string} imageSource - The source URL of the image.
 * @param {function} callback - Callback function to receive the result.
 * @param {object} [dimensions] - Optional crop dimensions {sx, sy, sWidth, sHeight}.
 */
const imgLum = (imageSource, callback, dimensions) => {
  const img = document.createElement('img');
  img.crossOrigin = 'Anonymous'; // Set this before src
  img.src = imageSource;
  img.style.display = 'none';
  document.body.appendChild(img);

  let colorSum = 0;
  let avgR = 0;
  let avgG = 0;
  let avgB = 0;
  let avgA = 0;

  function cleanup() {
    if (img.parentNode) {
      img.parentNode.removeChild(img);
    }
  }

  img.onload = function () {
    const canvas = document.createElement('canvas');
    let sx, sy, sWidth, sHeight;
    canvas.width = this.width;
    canvas.height = this.height;

    if (dimensions != null) {
      ({ sx, sy, sWidth, sHeight } = dimensions);
    } else {
      sx = sy = 0;
      sWidth = canvas.width;
      sHeight = canvas.height;
    }

    const context = canvas.getContext('2d');
    context.drawImage(this, 0, 0);

    const imageData = context.getImageData(sx, sy, sWidth, sHeight);
    const data = imageData.data;
    let r, g, b, a, avg;

    for (let x = 0, length_ = data.length; x < length_; x += 4) {
      r = data[x];
      g = data[x + 1];
      b = data[x + 2];
      a = data[x + 3];

      avgR += r;
      avgG += g;
      avgB += b;
      avgA += a;
      avg = Math.floor((r + g + b) / 3);
      colorSum += avg;
    }

    const totalPixels = sWidth * sHeight;
    const average = (int) => Math.floor(int / totalPixels);

    const values = {
      brightness: average(colorSum),
      opacity: average(avgA),
      r: average(avgR),
      g: average(avgG),
      b: average(avgB),
    };
    callback(values);
    cleanup();
  };
};

export default imgLum;
