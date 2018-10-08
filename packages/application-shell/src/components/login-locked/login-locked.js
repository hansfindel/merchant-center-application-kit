import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { injectConfiguration } from '@commercetools-frontend/application-shell-connectors';
import ProjectSuspended from '@commercetools-frontend/ui-kit/images/maintenance/project-suspended.svg';
import { Text } from '@commercetools-frontend/ui-kit';
import ServicePageResponseLayout from '../../from-core/service-page-response-layout';
import messages from './messages';

const year = new Date().getUTCFullYear();

export const HelpDeskLink = () => (
  <a href={'https://support.commercetools.com'} target="_blank">
    <FormattedMessage {...messages.helpDeskLink} />
  </a>
);
HelpDeskLink.displayName = 'HelpDeskLink';

export const ResetPasswordLink = props => (
  <a href={`${props.adminCenterUrl}/reset-password`} target="_blank">
    <FormattedMessage {...messages.resetPasswordLink} />
  </a>
);
ResetPasswordLink.displayName = 'ResetPasswordLink';
ResetPasswordLink.propTypes = {
  adminCenterUrl: PropTypes.string.isRequired,
};
const ConnectedResetPasswordLink = injectConfiguration(
  ['adminCenterUrl'],
  'adminCenterUrl'
)(ResetPasswordLink);

const LoginLocked = () => (
  <ServicePageResponseLayout
    imageSrc={ProjectSuspended}
    title={<FormattedMessage {...messages.title} />}
    paragraph1={
      <FormattedMessage
        {...messages.paragraph1}
        values={{
          resetPasswordLink: <ConnectedResetPasswordLink />,
          helpDeskLink: <HelpDeskLink />,
        }}
      />
    }
    paragraph2={<Text.Detail>{`${year} © commercetools`}</Text.Detail>}
  />
);
LoginLocked.displayName = 'LoginLocked';

export default LoginLocked;