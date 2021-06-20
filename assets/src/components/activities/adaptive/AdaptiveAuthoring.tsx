import React from 'react';
import ReactDOM from 'react-dom';
import { AdaptiveModelSchema } from './schema';
import { AuthoringElement, AuthoringElementProps } from '../AuthoringElement';
import { Manifest } from 'data/content/activities/activity';

const Adaptive = (props: AuthoringElementProps<AdaptiveModelSchema>) => <p>Adaptive</p>;

export class AdaptiveAuthoring extends AuthoringElement<AdaptiveModelSchema> {
  render(mountPoint: HTMLDivElement, props: AuthoringElementProps<AdaptiveModelSchema>) {
    ReactDOM.render(<Adaptive {...props} />, mountPoint);
  }
}
// eslint-disable-next-line
const manifest = require('./manifest.json') as Manifest;
window.customElements.define(manifest.authoring.element, AdaptiveAuthoring);
