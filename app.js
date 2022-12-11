var input = document.querySelector("input[type=file]");
var button = document.querySelector("input[type=submit]");

// Create an array to hold the pieces of text in the image
var textElements = [];

// Add an event listener to the submit button
button.addEventListener("click", convertIntoText);

// Create a close button and add it to the fontInfoDiv element
var closeButton = document.createElement("button");
closeButton.innerHTML = "Close";

// Add an event listener to the close button
closeButton.addEventListener("click", function (event) {
  // Hide the fontInfoDiv element when the user clicks the close button
  fontInfoDiv.style.display = "none";
});

function convertIntoText(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the selected image file
  var file = input.files[0];
}

// Read the image file and create an Image object from it
var reader = new FileReader();
reader.onload = function (event) {
  var dataURL = event.target.result;
  var image = new Image();
  image.src = dataURL;
  document.body.appendChild(image);
};

// Create a canvas element and draw the image on it
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = image.width;
canvas.height = image.height;
ctx.drawImage(image, 0, 0);
document.body.appendChild(canvas);

// Get the pixel data for the image
var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

// Iterate over the pixel data and use regular expressions to identify text
var fontRegex = /^([a-zA-Z ]+):(\d+)px/;
for (var i = 0; i < data.length; i += 4) {
  // check if the current pixel is part of a piece of text
  var r = data[i];
  var g = data[i + 1];
  var b = data[i + 2];
  var a = data[i + 3];
  if (r === 0 && g === 0 && b === 0 && a > 0) {
    // the pixel is part of a piece of text, so extract the font information
    var font = ctx.font;
    var fontMatch = fontRegex.exec(font);
    if (fontMatch) {
      var fontName = fontMatch[1];
      var fontSize = fontMatch[2];
      var fontColor = "rgba(" + r + "," + g + "," + b + "," + a / 255 + ")";
      // add the font information to an array or object for later use
      var textElement = {
        fontName: fontName,
        fontSize: fontSize,
        fontColor: fontColor,
      };
      textElements.push(textElement);
    }
  }

  var fontInfoDiv = document.createElement("div");
  fontInfoDiv.style.display = "none";
  document.body.appendChild(fontInfoDiv);

  // Iterate over the pieces of text in the image
  for (var i = 0; i < textElements.length; i++) {
    var textElement = textElements[i];

    // Add an event listener to the text element
    textElement.addEventListener("click", function (event) {
      // Show the font details for the clicked text element
      var fontName = textElement.fontName;
      var fontSize = textElement.fontSize;
      var fontColor = textElement.fontColor;
      fontInfoDiv.innerHTML =
        "Font: " +
        fontName +
        "<br>Size: " +
        fontSize +
        "<br>Color: " +
        fontColor;
      fontInfoDiv.style.display = "block";
    });
  }
}

fontInfoDiv.appendChild(closeButton);
