import React from 'react';

class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.log({ error, errorInfo });
  }
  render() {
    if (this.state?.hasError) {
      return <div>Oops, there's an error</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
