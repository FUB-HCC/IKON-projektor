import React from "react";
import getContentContainerStyle from "./getContentContainerStyle";
import getSVGDimensions from "./getSVGDimensions";

/* type Props = {
    children: React$Element | React$Element[],
    contentContainerBackgroundRectClassName: ?string,
    contentContainerGroupClassName: ?string,
    height: number,
    margin: Object | number,
    width: number,
}; */

/**
 * The d3-axis readme says “regardless of orientation, axes are always rendered at the origin.”
 * The D3 convention for this is to manually add a margin around the content and to translate
 * our y axis down to the bottom. Adding the margins isn’t really interesting enough to walk through.
 * This component handles adding a margin around the content of an SVG, called SVGWithMargin.
 * @param children
 * @param contentContainerBackgroundRectClassName
 * @param contentContainerGroupClassName
 * @param height
 * @param margin
 * @param renderContentContainerBackground
 * @param width
 * @param rest
 * @returns {*}
 */
export default ({
  children,
  contentContainerBackgroundRectClassName,
  contentContainerGroupClassName,
  height,
  margin,
  renderContentContainerBackground,
  width,
  ...rest
}) => (
  <svg
    {...rest}
    {...getSVGDimensions({
      height,
      margin,
      width
    })}
  >
    <g
      className={contentContainerGroupClassName}
      style={getContentContainerStyle({ margin })}
    >
      {!!contentContainerBackgroundRectClassName && (
        <rect
          className={contentContainerBackgroundRectClassName}
          height={height}
          width={width}
          x={0}
          y={0}
        />
      )}
      {children}
    </g>
  </svg>
);
