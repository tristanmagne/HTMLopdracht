'use strict';

const promise = fetch("/cdn/assets/octicons/data.json").then(response => response.json())
  .then(data => {
    const DEFAULT_HEIGHT = 16

    for (const key of Object.keys(data)) {
      // Returns a string representation of html attributes
      const htmlAttributes = (icon, defaultOptions, options) => {
        const attributes = []
        const attrObj = Object.assign({}, defaultOptions, options)

        // If the user passed in options
        if (options) {
          // If any of the width or height is passed in
          if (options['width'] || options['height']) {
            attrObj['width'] = options['width']
              ? options['width']
              : (parseInt(options['height']) * defaultOptions['width']) / defaultOptions['height']
            attrObj['height'] = options['height']
              ? options['height']
              : (parseInt(options['width']) * defaultOptions['height']) / defaultOptions['width']
          }

          // If the user passed in class
          if (options['class']) {
            attrObj['class'] = `octicon octicon-${key} ${options['class']}`
            attrObj['class'].trim()
          }

          // If the user passed in aria-label
          if (options['aria-label']) {
            attrObj['aria-label'] = options['aria-label']
            attrObj['role'] = 'img'

            // Un-hide the icon
            delete attrObj['aria-hidden']
          }
        }

        for (const option of Object.keys(attrObj)) {
          attributes.push(`${option}="${attrObj[option]}"`)
        }

        return attributes.join(' ').trim()
      }

      // Set the symbol for easy access
      data[key].symbol = key

      // Set options for each icon height
      for (const height of Object.keys(data[key].heights)) {
        data[key].heights[height].options = {
          version: '1.1',
          width: data[key].heights[height].width,
          height: parseInt(height),
          viewBox: `0 0 ${data[key].heights[height].width} ${height}`,
          class: `octicon octicon-${key}`,
          'aria-hidden': 'true'
        }
      }

      // Function to return an SVG object
      data[key].toSVG = function (options = {}) {
        const { height, width } = options
        const naturalHeight = closestNaturalHeight(Object.keys(data[key].heights), height || width || DEFAULT_HEIGHT)
        return `<svg ${htmlAttributes(data[key], data[key].heights[naturalHeight].options, options)}>${data[key].heights[naturalHeight].path
          }</svg>`
      }
    }

    return data;
  });

function closestNaturalHeight(naturalHeights, height) {
  return naturalHeights
    .map(naturalHeight => parseInt(naturalHeight, 10))
    .reduce((acc, naturalHeight) => (naturalHeight <= height ? naturalHeight : acc), naturalHeights[0])
}

export async function replaceIcons(element) {
  const data = await promise;
  const icons = element.querySelectorAll("i.octicon");
  icons.forEach(el => {
    let type = "";
    const classList = [];
    for (const [index, value] of el.classList.entries()) {
      if (value === "octicon") {
        type = el.classList.item(index + 1);
      } else if (type !== "" && el.classList.item(index - 1) !== "octicon") {
        classList.push(value);
      }
    }
    const svgString = data[type].toSVG(Object.assign({}, classList.length > 0 ? { "class": classList.join(" ") } : undefined));
    const template = document.createElement("template");
    template.innerHTML = svgString;
    el.replaceWith(template.content.firstChild);
  });
}

document.addEventListener("load", () => replaceIcons(document))

export default promise;