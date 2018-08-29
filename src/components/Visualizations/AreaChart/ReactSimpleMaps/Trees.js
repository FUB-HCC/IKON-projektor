// import React, { Component } from 'react'
import React from 'react'
import { MapGroup } from 'react-simple-maps'

const Trees = ({
  groupName,
  itemName,
  componentIdentifier,
  ...restProps
}) =>
  <MapGroup
    groupName={groupName}
    itemName={itemName}
    {...restProps}
  />

Trees.defaultProps = {
  componentIdentifier: 'Trees',
  groupName: 'trees',
  itemName: 'tree'
}

export default Trees
