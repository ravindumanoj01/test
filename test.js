const cv = require('opencv4nodejs');

async function removeBackground(imagePath) {
  // Load the image
  const image = await cv.imreadAsync(imagePath);

  // Convert image to grayscale
  const gray = image.cvtColor(cv.COLOR_BGR2GRAY);

  // Apply threshold to grayscale image
  const threshold = gray.threshold(250, 255, cv.THRESH_BINARY);

  // Find contours in the threshold image
  const contours = threshold.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  // Create a black image with same size as the original image
  const mask = new cv.Mat(image.rows, image.cols, cv.CV_8UC1, 0);

  // Draw white filled shapes on the black image for all contours
  contours.forEach((contour) => {
    mask.drawContours([contour], 0, new cv.Vec(255, 255, 255), -1);
  });

  // Bitwise-and of the original image and the mask to obtain the foreground objects
  const foreground = image.and(image, image, mask);

  // Create a black image with same size as the original image
  const background = new cv.Mat(image.rows, image.cols, cv.CV_8UC3, [0, 0, 0]);

  // Bitwise-not of the mask to obtain the background
  background.not(background, background, mask);

  // Add the foreground and background to obtain the final result
  const result = foreground.add(foreground, background);

  return result;
}
