// @flow

import React, { Component } from 'react';
import {
  Annotation,
  Annotations,
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { generate } from 'shortid';
import { findIndex } from 'lodash-es';
import topo from 'canada-topojson.json';

type Props = {
  data: Array<Object>,
  width?: number,
};

class CanadaMap extends Component<Props> {
  render() {
    const { width = 630 } = this.props;
    const wrapperStyles = {
      width: '100%',
      maxWidth: width,
      margin: '0 auto',
    };
    const annotations = [
      {
        dx: 45,
        dy: 20,
        subject: [-63, 46.25],
        short: 'PE',
        long: 'Prince Edward Island',
      },
      {
        dx: -35,
        dy: 35,
        subject: [-66, 46.25],
        short: 'NB',
        long: 'New Brunswick',
        textOnLeft: true,
      },
      {
        dx: 10,
        dy: 15,
        subject: [-65, 44.5],
        short: 'NS',
        long: 'Nova Scotia',
      },
      {
        subject: [-62, 54.25],
        short: 'NL',
        long: 'Newfoundland',
      },
      {
        subject: [-73, 54],
        short: 'QC',
        long: 'Quebec',
      },
      {
        subject: [-88, 52],
        short: 'ON',
        long: 'Ontario',
      },
      {
        subject: [-98, 55],
        short: 'MB',
        long: 'Manitoba',
      },
      {
        subject: [-98, 65],
        short: 'NU',
        long: 'Nunavut',
      },
      {
        subject: [-107, 55],
        short: 'SK',
        long: 'Saskatchewan',
      },
      {
        subject: [-115, 55],
        short: 'AB',
        long: 'Alberta',
      },
      {
        subject: [-126, 55],
        short: 'BC',
        long: 'British Columbia',
      },
      {
        subject: [-120, 64],
        short: 'NT',
        long: 'Northwest Territories',
      },
      {
        subject: [-137, 64],
        short: 'YT',
        long: 'Yukon Territory',
      },
    ];
    const { data } = this.props;
    const filteredData = [];
    annotations.map(i => {
      const index = findIndex(data, o => o.province === i.long);
      filteredData.push({
        ...i,
        count: index !== -1 ? data[index].count : 0,
      });
      return false;
    });
    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projectionConfig={{
            scale: width - width * 0.05, // subtract 5% from width so that it fits viewport correctly
          }}
          width={width}
          height={547}
          style={{
            width: '100%',
            height: 'auto',
          }}
        >
          <ZoomableGroup center={[-99, 65]} disablePanning>
            <Geographies geography={topo}>
              {(geographies, projection) =>
                geographies.map(geography => (
                  <Geography
                    key={generate()}
                    geography={geography}
                    projection={projection}
                    style={{
                      default: {
                        fill: '#e4eaf3',
                        stroke: '#000',
                        strokeWidth: 0.1,
                        outline: 'none',
                      },
                      hover: {
                        fill: '#607D8B',
                        stroke: '#607D8B',
                        strokeWidth: 0.1,
                        outline: 'none',
                      },
                    }}
                  />
                ))
              }
            </Geographies>
            <Annotations>
              {filteredData.map(
                ({ dx, dy, subject, short, count, textOnLeft }) => (
                  <Annotation
                    dx={dx || 0}
                    dy={dy || 0}
                    subject={subject}
                    strokeWidth={1}
                    stroke="#333333"
                    key={generate()}
                  >
                    <text
                      x={textOnLeft ? -5 : 5}
                      y={-5}
                      fontWeight={900}
                      fontSize={13}
                      fill="#11b4e4"
                    >
                      {short}
                    </text>
                    <text
                      x={textOnLeft ? -5 : 5}
                      y={13}
                      fill="#a0ce67"
                      fontWeight="bold"
                    >
                      {count}%
                    </text>
                  </Annotation>
                )
              )}
            </Annotations>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    );
  }
}

export default CanadaMap;
