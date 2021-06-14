import { WriterContext } from 'data/content/writers/context';
import { HtmlContentModelRenderer } from 'data/content/writers/renderer';
import React from 'react';
import { IStem } from '../types';
import './Delivery.scss';

interface DeliveryProps {
  stem: IStem;
  context: WriterContext;
}

export const Delivery = ({ stem, context }: DeliveryProps) => {
  return (
    <div className="stem__delivery">
      <HtmlContentModelRenderer text={stem.content} context={context} />
    </div>
  );
};
