import React from 'react';

function App() {
  return (
    <div className="App h-screen bg-gradient-to-b from-blue-500 to-black font-sans">
      <header className="App-header flex items-center justify-center h-full p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="text-white flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4 text-center md:text-left">Bienvenido a nuestra página</h1>
            <p className="text-lg text-center md:text-left">
              Este es un ejemplo de una landing page usando React y Tailwind CSS. 
              Puedes agregar más contenido aquí para describir tu producto o servicio.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <img src={`${process.env.PUBLIC_URL}/logo512.png`} alt="Example" className="rounded-lg shadow-lg w-full max-w-md" />
          </div>
        </div>
      </header>
      <section className="flex items-center justify-center h-64 bg-black text-white">
        <p className="text-2xl">Este es un texto centrado en la nueva sección.</p>
      </section>
    </div>
  );
}

export default App;
