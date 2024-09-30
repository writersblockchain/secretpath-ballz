import React, { useEffect, useState } from 'react';

const ChainDataComponent = () => {
  const [chainData, setChainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChainData = async () => {
      try {
        // Replace this URL with your raw GitHub link to the JSON file
        const response = await fetch('https://raw.githubusercontent.com/username/repo/branch/filename.json');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setChainData(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchChainData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Chain Data</h1>
      {chainData && (
        <pre>{JSON.stringify(chainData, null, 2)}</pre>
      )}
    </div>
  );
};

export default ChainDataComponent;
