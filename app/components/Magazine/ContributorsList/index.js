// @flow

import * as React from 'react';
import type { Map } from 'immutable';

import ContributorsListItem from 'components/Magazine/ContributorsList/Item';

import './styles.scss';

type Props = {
  data: Map<string, *>,
};

const ContributorsList = ({ data }: Props) => {
  if (!data) {
    return null;
  }
  if (!data.size) {
    return (
      <div className="text-center pt-xl pb-xl">
        <h3 className="nm">No contributors yet</h3>
      </div>
    );
  }
  return (
    <div className="contributorsList row">
      {data.entrySeq().map(([key, item]) => (
        <div className="small-12 medium-6 large-4 column" key={key}>
          <ContributorsListItem data={item} />
        </div>
      ))}
    </div>
  );
};

export default ContributorsList;
