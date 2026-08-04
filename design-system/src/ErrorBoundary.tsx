import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = 'Unknown error';
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#fff3f3', color: '#ff0000', border: '1px solid #ff0000', borderRadius: '8px', margin: '20px' }}>
      <h1>Application Error!</h1>
      <p>Something went wrong during rendering.</p>
      <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px', color: '#333' }}>
        <strong>Error:</strong> {errorMessage}
        {'

'}
        {error instanceof Error && `Stack Trace:
${error.stack}`}
      </pre>
      <p>Check the browser console for more details.</p>
    </div>
  );
}
