import { WriterContext } from 'data/content/writers/context';
import React from 'react';
import { Maybe } from 'tsmonad';
import {  IChoice  } from './types';;

interface ChoicesProps {
  choices: IChoice[];
  selected: Maybe<string>;
  context: WriterContext;
  onSelect: (id: string) => void;
  isEvaluated: boolean;
}

const Choices = ({ choices, selected, context, onSelect, isEvaluated }: ChoicesProps) => {
  return (
    <></>
    // <div className="choices" aria-label="multiple choice choices">
    //   {choices.map((choice, index) => (
    //     <Choice.Delivery
    //       key={choice.id}
    //       onClick={() => onSelect(choice.id)}
    //       selected={selected.valueOr('') === choice.id}
    //       choice={choice}
    //       context={context}
    //       isEvaluated={isEvaluated}
    //       index={index}
    //     />
    //   ))}
    // </div>
  );
};
