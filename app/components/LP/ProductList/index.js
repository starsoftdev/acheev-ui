// @flow

import * as React from 'react';
import type { List, Map } from 'immutable';
import cx from 'classnames';
import { AutoSizer, Table, Column, SortDirection } from 'react-virtualized';
import moment from 'moment';
import { fromJS, is } from 'immutable';

import Preloader from 'components/Preloader';
import DropDown from 'components/LP/ProductList/DropDown';
import SearchField from 'components/SearchField';
import ProductPrice from 'components/ProductPrice';

import './styles.scss';

type Props = {
  isLoading: boolean,
  data: List<Map<*, *>>,
  className?: string,
};

type State = {
  sortBy: string,
  sortDirection: string,
  filteredData: List<Map<*, *>>,
};

class LpProductList extends React.Component<Props, State> {
  state = {
    sortBy: 'name',
    sortDirection: SortDirection.ASC,
    filteredData: fromJS([{}]),
  };
  componentDidMount() {
    const { data } = this.props;
    if (data) {
      this.setData(data);
    }
  }
  componentWillReceiveProps(newProps: Props) {
    const { data } = this.props;
    const { data: newData } = newProps;
    const dataHasArrived = !data && newData;
    const dataHasBeenChanged = data && !is(data, newData);
    if (dataHasArrived || dataHasBeenChanged) {
      this.setData(newData);
    }
  }
  onFilterChange = (e: string) => {
    const { data } = this.props;
    const filteredData = data.filter(val =>
      val
        .get('name')
        .toLowerCase()
        .includes(e.toLowerCase())
    );
    this.setState({ filteredData });
  };
  setData = (data: List<Map<*, *>>) => {
    this.setState({ filteredData: data });
  };
  getDatum(list: List<Map<*, *>>, index: number) {
    return list.get(index);
  }
  sort = ({ sortBy, sortDirection }: Object) => {
    const filteredData = this.sortList({ sortBy, sortDirection });

    this.setState({ sortBy, sortDirection, filteredData });
  };
  sortList = ({ sortBy, sortDirection }: Object) => {
    const { filteredData } = this.state;
    return filteredData
      .sortBy(item => item.getIn(sortBy.split(/\s*,\s*/)))
      .update(
        list => (sortDirection === SortDirection.DESC ? list.reverse() : list)
      );
  };
  render() {
    const { isLoading, data, className } = this.props;
    const { sortBy, sortDirection } = this.state;
    if (isLoading) {
      return <Preloader height={480} />;
    } else if (!data || !data.size) return null;
    const filteredData = this.sortList({ sortBy, sortDirection });
    const rowGetter = ({ index }) => this.getDatum(filteredData, index);
    const mergedClassName = cx('lpProductList', className);
    return (
      <div className={mergedClassName}>
        <SearchField
          className="global mb-xl"
          onChange={this.onFilterChange}
          placeholder="Filter by Name"
        />
        <div
          className="lpProductList__tableContainer"
          style={{ overflow: 'auto' }}
        >
          <div style={{ minWidth: '610px' /* 640 - gutters */ }}>
            <AutoSizer disableHeight>
              {({ width }) => (
                <Table
                  height={480}
                  rowCount={filteredData.size}
                  headerHeight={40}
                  rowHeight={40}
                  rowGetter={rowGetter}
                  rowClassName={({ index }) => {
                    if (index < 0) {
                      return 'headerRow';
                    }
                    return index % 2 === 0 ? 'evenRow' : 'oddRow';
                  }}
                  sort={this.sort}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  width={width}
                  headerClassName="headerColumn"
                  noRowsRenderer={() => (
                    <h6 className="text-center mt-md">No results found</h6>
                  )}
                >
                  <Column
                    dataKey=""
                    cellRenderer={({ rowData }) => <DropDown data={rowData} />}
                    width={13}
                    minWidth={13}
                  />
                  <Column
                    label="Name"
                    dataKey="name"
                    width={120}
                    minWidth={90}
                    flexGrow={1}
                  />
                  <Column label="Type" dataKey="__t" width={90} minWidth={40} />
                  <Column
                    label="Availability"
                    dataKey="variants, 0, availabilityStatus"
                    cellDataGetter={({ rowData }) =>
                      rowData.getIn(['variants', 0, 'availabilityStatus'])}
                    width={120}
                    minWidth={60}
                  />
                  <Column
                    label="Price"
                    dataKey="variants, 0, price"
                    cellRenderer={({ rowData }) => (
                      <ProductPrice
                        price={rowData.getIn(['variants', 0, 'price'])}
                        unit={rowData.getIn(['variants', 0, 'doseUnit'])}
                        doseAmount={rowData.getIn([
                          'variants',
                          0,
                          'doseAmount',
                        ])}
                        unitLabel={
                          rowData.get('__t') === 'Oil' ? '(mg/ml)' : undefined
                        }
                      />
                    )}
                    width={120}
                    minWidth={80}
                  />
                  <Column
                    label="Rating"
                    dataKey="rating"
                    cellRenderer={({ cellData }) => cellData || 'N/A'}
                    width={90}
                    minWidth={28}
                  />
                  <Column
                    label="Reviews"
                    dataKey="reviewCount"
                    width={90}
                    minWidth={15}
                  />
                  <Column
                    label="Added"
                    dataKey="createdOn"
                    cellRenderer={({ cellData }) =>
                      moment(cellData).format('ll')}
                    width={120}
                    minWidth={90}
                  />
                  <Column
                    label="Updated"
                    dataKey="updatedOn"
                    cellRenderer={({ cellData }) =>
                      moment(cellData).format('ll')}
                    width={120}
                    minWidth={90}
                  />
                </Table>
              )}
            </AutoSizer>
          </div>
        </div>
      </div>
    );
  }
}

export default LpProductList;
