// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import { List, Map } from 'immutable';

import BorderedTitle from 'components/BorderedTitle';
import Answer from 'containers/Forum/Answer';

type Props = {
  answers: List<Map<string, string>>,
  correctAnswer: string,
  isMarkable: boolean,
  questionId: string,
  questionSlug: string,
};

class AnswerList extends Component<Props> {
  renderAnswers(answers: List<Map<string, string>>, correctAnswer: string) {
    const { isMarkable, questionId, questionSlug } = this.props;
    return answers.map((answer, index) => (
      <Answer
        key={generate()}
        answer={answer}
        answerIndex={index}
        correctAnswer={correctAnswer}
        isMarkable={isMarkable}
        questionId={questionId}
        questionSlug={questionSlug}
      />
    ));
  }

  render() {
    const { answers, correctAnswer } = this.props;
    const sortedAnswers = answers.sort((answer1, answer2) => {
      const correct1 = correctAnswer === answer1.get('_id') ? 1 : 0;
      const correct2 = correctAnswer === answer2.get('_id') ? 1 : 0;
      if (correct1 !== correct2) {
        return correct2 - correct1;
      }
      return answer2.get('upVotes').size - answer1.get('upVotes').size;
    });
    return (
      <div className="answerList mb-xl">
        <div className="row column">
          <BorderedTitle element="h2" className="borderedTitle" leftAligned>
            {`${answers.size} answers`}
          </BorderedTitle>
        </div>
        <div className="row column">
          {this.renderAnswers(sortedAnswers, correctAnswer)}
        </div>
      </div>
    );
  }
}

export default AnswerList;
