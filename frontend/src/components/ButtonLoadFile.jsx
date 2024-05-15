import React, { useState, useRef } from "react";
import { Button } from "@nextui-org/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function App() {
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    if (event.target.files[0]) {
      toast.success('Su imagen se subió correctamente', {
        position: "bottom-left",
      });
    } else {
      toast.error('Hubo un problema con su imagen', {
        position: "bottom-left",
      });
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".png,.jpg,.tiff"
      />
      <Button color="primary" onClick={handleButtonClick}>
        Subir imagen
      </Button>
      <ToastContainer />
    </div>
  );
}