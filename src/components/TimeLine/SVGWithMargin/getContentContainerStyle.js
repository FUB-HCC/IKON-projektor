import getMarginObject from './getMarginObject'

export default function getContentContainerStyle ({
  margin
}) {
  const marginObject = getMarginObject(margin)

  return {
    transform: `translate(${marginObject.left}px, ${marginObject.top}px)`
  }
};
