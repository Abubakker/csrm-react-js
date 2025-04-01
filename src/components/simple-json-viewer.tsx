const JSONViewer = ({ data }: { data: { [key: string]: any } }) => {
  const renderJSON = (obj: { [key: string]: any }) => {
    return Object.keys(obj).map((key, index) => {
      const value = obj[key];
      const type = typeof value;

      let renderedValue = null;
      if (type === 'object' && value !== null) {
        renderedValue = <div className="ml-4">{renderJSON(value)}</div>;
      } else if (type === 'string') {
        renderedValue = <span className="text-blue-500">"{value}"</span>;
      } else {
        renderedValue = <span>{value}</span>;
      }

      return (
        <div key={index} className="ml-2">
          <span className="text-gray-500">{`${key}: `}</span>
          {renderedValue}
        </div>
      );
    });
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow">{renderJSON(data)}</div>
  );
};

export default JSONViewer;
