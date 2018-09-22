import { fromJS } from 'immutable';

const popularCourses = fromJS([
  {
    img:
      'https://previews.dropbox.com/p/thumb/AAMVGhcOdRAZGjd0BPvWd1POdH7qD_ZWNIZCNEZ_OeUkT4hyjl-6bkkutEmR90_b6JTnk3w29W-0LrcQq9OHEdkejVMfJs-eyXCoGA6I67C3nWXLdTWQEhW27479m37Ozvj2GSOihkKJ9lkG8BY-hC98OseDNn9kZVtrTcaeeX-EybEURrNVSVLMGaWbD5MXbw4y4IZ9dUXktz8RIEStrRO5HXyIzvagSW0hc8pkc9VQKw/p.jpeg?size=2048x1536&size_mode=3',
    name: 'Learn How To Properly Optimize Your Website For Search Engines',
    creator: 'Thomas Cobb',
    rating: 4.0,
    price: 250,
    students: [
      'https://media.licdn.com/dms/image/C5603AQFIpATiEV-SNw/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=G0O-JPlcrej67kHq4nxtoxMoh6s49o_hvszJ-yJqjxs',
      'https://media.licdn.com/dms/image/C5603AQG9YbXfpMySUA/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=hvolBhtyX58GJwuyHxKY4POXhgAiWaTGEDKphHMWgVk',
      'https://media.licdn.com/dms/image/C5603AQE1TpE30S4NUw/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=ecO3iHOGaigBTI9n4aHnuN_5PsaMaiR1Q3GXHBEpQwk',
      'https://media.licdn.com/dms/image/C4E03AQHnNQQ9oEj-VA/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=1T5vH0UFxtw0P_H7xjsZtYJbBELkA4K3fKPoOJ7FIlE',
    ],
    studentsCount: 35.638,
  },
  {
    img:
      'https://previews.dropbox.com/p/thumb/AAMVGhcOdRAZGjd0BPvWd1POdH7qD_ZWNIZCNEZ_OeUkT4hyjl-6bkkutEmR90_b6JTnk3w29W-0LrcQq9OHEdkejVMfJs-eyXCoGA6I67C3nWXLdTWQEhW27479m37Ozvj2GSOihkKJ9lkG8BY-hC98OseDNn9kZVtrTcaeeX-EybEURrNVSVLMGaWbD5MXbw4y4IZ9dUXktz8RIEStrRO5HXyIzvagSW0hc8pkc9VQKw/p.jpeg?size=2048x1536&size_mode=3',
    name: 'Cleaning And Organizing Your Computer',
    creator: 'Terry Estrada',
    rating: 4.0,
    price: 10,
    students: [
      'https://media.licdn.com/dms/image/C5603AQFIpATiEV-SNw/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=G0O-JPlcrej67kHq4nxtoxMoh6s49o_hvszJ-yJqjxs',
      'https://media.licdn.com/dms/image/C5603AQG9YbXfpMySUA/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=hvolBhtyX58GJwuyHxKY4POXhgAiWaTGEDKphHMWgVk',
      'https://media.licdn.com/dms/image/C5603AQE1TpE30S4NUw/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=ecO3iHOGaigBTI9n4aHnuN_5PsaMaiR1Q3GXHBEpQwk',
      'https://media.licdn.com/dms/image/C4E03AQHnNQQ9oEj-VA/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=1T5vH0UFxtw0P_H7xjsZtYJbBELkA4K3fKPoOJ7FIlE',
    ],
    studentsCount: 35.638,
  },
  {
    img:
      'https://previews.dropbox.com/p/thumb/AAMVGhcOdRAZGjd0BPvWd1POdH7qD_ZWNIZCNEZ_OeUkT4hyjl-6bkkutEmR90_b6JTnk3w29W-0LrcQq9OHEdkejVMfJs-eyXCoGA6I67C3nWXLdTWQEhW27479m37Ozvj2GSOihkKJ9lkG8BY-hC98OseDNn9kZVtrTcaeeX-EybEURrNVSVLMGaWbD5MXbw4y4IZ9dUXktz8RIEStrRO5HXyIzvagSW0hc8pkc9VQKw/p.jpeg?size=2048x1536&size_mode=3',
    name: 'Learn How To Design and Develop Your First Website',
    creator: 'Jerome Morris',
    rating: 4.0,
    price: 150,
    students: [
      'https://media.licdn.com/dms/image/C5603AQFIpATiEV-SNw/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=G0O-JPlcrej67kHq4nxtoxMoh6s49o_hvszJ-yJqjxs',
      'https://media.licdn.com/dms/image/C5603AQG9YbXfpMySUA/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=hvolBhtyX58GJwuyHxKY4POXhgAiWaTGEDKphHMWgVk',
      'https://media.licdn.com/dms/image/C5603AQE1TpE30S4NUw/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=ecO3iHOGaigBTI9n4aHnuN_5PsaMaiR1Q3GXHBEpQwk',
      'https://media.licdn.com/dms/image/C4E03AQHnNQQ9oEj-VA/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=1T5vH0UFxtw0P_H7xjsZtYJbBELkA4K3fKPoOJ7FIlE',
    ],
    studentsCount: 35.638,
  },
  {
    img:
      'https://previews.dropbox.com/p/thumb/AAMVGhcOdRAZGjd0BPvWd1POdH7qD_ZWNIZCNEZ_OeUkT4hyjl-6bkkutEmR90_b6JTnk3w29W-0LrcQq9OHEdkejVMfJs-eyXCoGA6I67C3nWXLdTWQEhW27479m37Ozvj2GSOihkKJ9lkG8BY-hC98OseDNn9kZVtrTcaeeX-EybEURrNVSVLMGaWbD5MXbw4y4IZ9dUXktz8RIEStrRO5HXyIzvagSW0hc8pkc9VQKw/p.jpeg?size=2048x1536&size_mode=3',
    name: 'How to get your first 10,000 customers',
    creator: 'Thomas Cobb',
    rating: 4.0,
    price: 200,
    students: [
      'https://media.licdn.com/dms/image/C5603AQFIpATiEV-SNw/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=G0O-JPlcrej67kHq4nxtoxMoh6s49o_hvszJ-yJqjxs',
      'https://media.licdn.com/dms/image/C5603AQG9YbXfpMySUA/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=hvolBhtyX58GJwuyHxKY4POXhgAiWaTGEDKphHMWgVk',
      'https://media.licdn.com/dms/image/C5603AQE1TpE30S4NUw/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=ecO3iHOGaigBTI9n4aHnuN_5PsaMaiR1Q3GXHBEpQwk',
      'https://media.licdn.com/dms/image/C4E03AQHnNQQ9oEj-VA/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=1T5vH0UFxtw0P_H7xjsZtYJbBELkA4K3fKPoOJ7FIlE',
    ],
    studentsCount: 35.638,
  },
  {
    img:
      'https://previews.dropbox.com/p/thumb/AAMVGhcOdRAZGjd0BPvWd1POdH7qD_ZWNIZCNEZ_OeUkT4hyjl-6bkkutEmR90_b6JTnk3w29W-0LrcQq9OHEdkejVMfJs-eyXCoGA6I67C3nWXLdTWQEhW27479m37Ozvj2GSOihkKJ9lkG8BY-hC98OseDNn9kZVtrTcaeeX-EybEURrNVSVLMGaWbD5MXbw4y4IZ9dUXktz8RIEStrRO5HXyIzvagSW0hc8pkc9VQKw/p.jpeg?size=2048x1536&size_mode=3',
    name: 'Learn How To Hire Your First Engineer ',
    creator: 'Terry Estrada',
    rating: 4.0,
    price: 25,
    students: [
      'https://media.licdn.com/dms/image/C5603AQFIpATiEV-SNw/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=G0O-JPlcrej67kHq4nxtoxMoh6s49o_hvszJ-yJqjxs',
      'https://media.licdn.com/dms/image/C5603AQG9YbXfpMySUA/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=hvolBhtyX58GJwuyHxKY4POXhgAiWaTGEDKphHMWgVk',
      'https://media.licdn.com/dms/image/C5603AQE1TpE30S4NUw/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=ecO3iHOGaigBTI9n4aHnuN_5PsaMaiR1Q3GXHBEpQwk',
      'https://media.licdn.com/dms/image/C4E03AQHnNQQ9oEj-VA/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=1T5vH0UFxtw0P_H7xjsZtYJbBELkA4K3fKPoOJ7FIlE',
    ],
    studentsCount: 35.638,
  },
  {
    img:
      'https://previews.dropbox.com/p/thumb/AAMVGhcOdRAZGjd0BPvWd1POdH7qD_ZWNIZCNEZ_OeUkT4hyjl-6bkkutEmR90_b6JTnk3w29W-0LrcQq9OHEdkejVMfJs-eyXCoGA6I67C3nWXLdTWQEhW27479m37Ozvj2GSOihkKJ9lkG8BY-hC98OseDNn9kZVtrTcaeeX-EybEURrNVSVLMGaWbD5MXbw4y4IZ9dUXktz8RIEStrRO5HXyIzvagSW0hc8pkc9VQKw/p.jpeg?size=2048x1536&size_mode=3',
    name: 'Learn How To Build & Ship Your First iPhone Application',
    creator: 'Jerome Morris',
    rating: 4.0,
    price: 1000,
    students: [
      'https://media.licdn.com/dms/image/C5603AQFIpATiEV-SNw/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=G0O-JPlcrej67kHq4nxtoxMoh6s49o_hvszJ-yJqjxs',
      'https://media.licdn.com/dms/image/C5603AQG9YbXfpMySUA/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=hvolBhtyX58GJwuyHxKY4POXhgAiWaTGEDKphHMWgVk',
      'https://media.licdn.com/dms/image/C5603AQE1TpE30S4NUw/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=ecO3iHOGaigBTI9n4aHnuN_5PsaMaiR1Q3GXHBEpQwk',
      'https://media.licdn.com/dms/image/C4E03AQHnNQQ9oEj-VA/profile-displayphoto-shrink_800_800/0?e=1542844800&v=beta&t=1T5vH0UFxtw0P_H7xjsZtYJbBELkA4K3fKPoOJ7FIlE',
    ],
    studentsCount: 35.638,
  },
]);

export default popularCourses;
