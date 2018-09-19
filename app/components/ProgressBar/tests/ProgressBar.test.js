import React from 'react';
import { shallow } from 'enzyme';
import ProgressBar from 'components/ProgressBar';
import { Line } from 'react-progress-bar.js';

describe('<ProgressBar />', () => {
  it('should apply given `className`', () => {
    const renderedComponent = shallow(<ProgressBar className="hey" />);
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });
  it('should apply given `progressBarClassName`', () => {
    const renderedComponent = shallow(
      <ProgressBar progressBarClassName="hey" />
    );
    expect(renderedComponent.find('.hey').length).toEqual(1);
  });
  it('should apply default props', () => {
    const renderedComponent = shallow(<ProgressBar />);
    expect(renderedComponent.find(Line).prop('progress')).toEqual(0);
    expect(renderedComponent.find(Line).prop('initialAnimate')).toEqual(true);
    expect(renderedComponent.find(Line).prop('options')).toEqual({
      strokeWidth: 2,
      color: '#11b4e4',
      width: 2,
      trailColor: '#f0f2f7',
      trailWidth: 2,
    });
  });
  it('should apply correct progress', () => {
    const renderedComponent = shallow(
      <ProgressBar value={78} maxValue={100} />
    );
    expect(renderedComponent.find(Line).prop('progress')).toEqual(0.78);
  });

  it('renders `value` and `valuePostfix`', () => {
    const renderedComponent = shallow(
      <ProgressBar value={78} maxValue={100} showValue valuePostfix="%" />
    );
    expect(renderedComponent.find('.progressBar__value').text()).toEqual('78%');
  });

  it('should apply correct options', () => {
    const renderedComponent = shallow(
      <ProgressBar
        trailColor="#eeeeee"
        trailWidth={3}
        color="#cccccc"
        width={4}
      />
    );
    expect(renderedComponent.find(Line).prop('options')).toEqual({
      strokeWidth: 4,
      color: '#cccccc',
      width: 4,
      trailColor: '#eeeeee',
      trailWidth: 3,
    });
  });
});
