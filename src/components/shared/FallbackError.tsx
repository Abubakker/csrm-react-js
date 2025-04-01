const FallbackError = ({ error, resetErrorBoundary }: any) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre className="text-red-600">{error.message}</pre>
      <button className="px-1" onClick={resetErrorBoundary}>
        retry
      </button>
    </div>
  );
};

export default FallbackError;
