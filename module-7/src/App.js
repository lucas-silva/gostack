import React, { useState, useEffect } from 'react';

function App() {
  const [tech, setTech] = useState([]);
  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    const locaoStorageTech = localStorage.getItem('tech');
    if (locaoStorageTech) {
      setTech(JSON.parse(locaoStorageTech));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tech', JSON.stringify(tech));
  }, [tech]);

  function handleAdd() {
    setTech([...tech, newTech]);
    setNewTech('');
  }

  function handleChange(e) {
    setNewTech(e.target.value);
  }

  return (
    <>
      <ul>
        {tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <input value={newTech} onChange={handleChange} />
      <button onClick={handleAdd} type="button">
        Adicionar
      </button>
    </>
  );
}

export default App;
