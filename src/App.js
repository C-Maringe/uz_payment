import React, { useState, useEffect } from 'react';
import './assets/scss/themes.scss';
import './assets/scss/custom.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import FormHolder from './components/FormHolder';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Spinner, Modal, ModalBody } from 'reactstrap';

function App() {
  const [CHECKLOADERSTATUS, setCHECKLOADERSTATUS] = useState(false)

  const windowwidth = window.outerWidth
  return (
    <BrowserRouter>
      {CHECKLOADERSTATUS &&
        < Modal modalClassName="zoomIn" tabIndex="-1" isOpen={CHECKLOADERSTATUS} centered
          style={{ width: windowwidth > 600 ? "170px" : "" }}>
          <ModalBody style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spinner color="primary" /><div style={{ marginLeft: "10px", fontWeight: "700" }}>Processing...</div>
          </ModalBody>
        </Modal >
      }
      <Routes>
        <Route>
          <Route path='/' element={<FormHolder setLoading={setCHECKLOADERSTATUS} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
