import { IntercomProvider } from 'react-use-intercom';

export default function (props: any) {
  const { appId, children } = props;

  if (!appId) {
    return children;
  }

  return <IntercomProvider {...props} />;
}
