// @flow

import * as React from 'react';
import Link from 'components/Link';
import type { Map } from 'immutable';
import moment from 'moment';

import Table from 'components/Table';
import Button from 'components/Button';
import StarRating from 'components/StarRating';

type Props = {
  data: Map<string, *>,
  isMyProfile: boolean,
};

const MemberReviews = ({ data, isMyProfile }: Props) => (
  <div>
    {data.get('count') === 0 ? (
      <div className="text-center mb-mx">
        {isMyProfile ? (
          <h2 className="mb-md">No reviews yet. To get started click below.</h2>
        ) : (
          <h2>No reviews yet.</h2>
        )}
        {isMyProfile && (
          <Button
            to="/create-review"
            element={Link}
            className="large secondary"
          >
            Create a Review
          </Button>
        )}
      </div>
    ) : (
      <Table className="mb-hg">
        <thead>
          <tr>
            <th className="hide-for-small-only">Rating</th>
            <th>Product</th>
            <th>Date posted</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data
            .get('hits')
            .entrySeq()
            .map(([key, value]) => {
              let createdOnDate = value.get('createdOn');
              if (createdOnDate) {
                createdOnDate = moment(createdOnDate).format('MM/DD/YYYY');
              }
              return (
                <tr key={key}>
                  <td className="hide-for-small-only">
                    <StarRating initialRating={value.get('rating')} />
                  </td>
                  <td>{value.getIn(['product', 'name'])}</td>
                  <td>{createdOnDate}</td>
                  <td>
                    <a
                      href={`/${value
                        .getIn(['product', '__t'], 'product')
                        .toLowerCase()}s/${value.getIn([
                        'product',
                        'slug',
                      ])}/reviews/${value.get('_id')}`}
                    >
                      View
                    </a>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    )}
  </div>
);

export default MemberReviews;
