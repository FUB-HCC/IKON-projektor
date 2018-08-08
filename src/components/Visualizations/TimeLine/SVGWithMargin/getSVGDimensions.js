import getMarginObject from './getMarginObject'

export default function getSVGDimensions ({
  height,
  margin,
  width
}) {
  const marginObject = getMarginObject(margin)
  const heightWithMargin = height +
        marginObject.top +
        marginObject.bottom
  const widthWithMargin = width +
        marginObject.left +
        marginObject.right

  return {
    height: heightWithMargin,
    width: widthWithMargin
  }
};
