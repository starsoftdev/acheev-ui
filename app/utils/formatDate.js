import moment from 'moment';

export default date => (date ? moment(date).format('MMM DD YYYY') : 'N/A');
