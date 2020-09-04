import React, { useState, useEffect, useMemo, useCallback } from 'react';

function App() {
  const [tech, setTech] = useState([]);
  const [newTech, setNewTech] = useState('');
  const techSize = useMemo(() => tech.length, [tech]);

  const handleAdd = useCallback(() => {
    setTech([...tech, newTech]);
    setNewTech('');
  }, [tech, newTech]);

  const handleChange = useCallback((e) => {
    setNewTech(e.target.value);
  }, []);

  useEffect(() => {
    const locaoStorageTech = localStorage.getItem('tech');
    if (locaoStorageTech) {
      setTech(JSON.parse(locaoStorageTech));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tech', JSON.stringify(tech));
  }, [tech]);

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
      <strong>Você tem {techSize} tecnologias</strong>
    </>
  );
}

export default App;
