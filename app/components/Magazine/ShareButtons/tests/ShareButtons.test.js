import React from 'react';
import { shallow } from 'enzyme';
import ShareButtons from 'components/Magazine/ShareButtons';

const shareUrl = 'http://example.com';
const shareTitle = 'Hooray!';

describe('<ShareButtons />', () => {
  it('should render nothing if `shareUrl` is not specified', () => {
    const renderedComponent = shallow(<ShareButtons shareTitle={shareTitle} />);
    expect(renderedComponent.type()).toEqual(null);
  });

  it('should render nothing if `shareTitle` is not specified', () => {
    const renderedComponent = shallow(<ShareButtons shareUrl={shareUrl} />);
    expect(renderedComponent.type()).toEqual(null);
  });
});
