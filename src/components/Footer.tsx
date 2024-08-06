import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function Footer() {
  const location = useLocation();

  // Se usa la clase `fixed` de Tailwind CSS para fijar el footer al fondo de la página.
  // Además, `inset-x-0` y `bottom-0` aseguran que esté correctamente alineado horizontalmente y pegado al fondo.
  const footerClass = " flex items-center justify-center py-4 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent text-white font-bold hover:text-blue-300 transition-colors";
  const legalClass = "fixed inset-x-0 bottom-0 flex items-center justify-center py-4 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent text-white font-bold hover:text-blue-300 transition-colors";

  if (location.pathname === "/privacy-policy") {
    return (
      <footer className={legalClass}>
        <Link to="/" className="transition-colors">
          Home
        </Link>
      </footer>
    );
  }

  return (
    <footer className={footerClass}>
    <Link to="/privacy-policy" className="transition-colors">
       Legal Advice
      </Link>
    </footer>
  );
}

export default Footer;
