import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#111827', 
        color: 'white',
        fontFamily: 'sans-serif',
        textAlign: 'center'
      }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>CapiFit</h1>
      <p style={{ fontSize: '1.2rem', color: '#9CA3AF' }}>
        Frontend da Aplicação CapiFit.
      </p>
      <p style={{ marginTop: '2rem', color: '#6B7280' }}>
        O backend está sendo construído. Esta interface será desenvolvida para consumir a nova API RESTful.
      </p>
    </div>
  );
};

export default App;
