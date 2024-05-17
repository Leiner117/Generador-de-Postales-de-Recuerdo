import React, { useState, useRef, useEffect } from "react";
import { Button, Select, SelectItem, Input as NextUIInput } from "@nextui-org/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Main component of the application.
 * @returns {JSX.Element} The main component JSX
 */
export default function App() {
  // References to file input and initial states
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [inputValues, setInputValues] = useState([""]);
  const [value, setValue] = useState("");
  const [selectedFont, setSelectedFont] = useState(null);
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [email, setEmail] = useState("");
  const [fileName, setFileName] = useState("");

  // Options for image direction
  const directions = [
    { value: '1', label: 'Top' },
    { value: '2', label: 'Bottom' },
    { value: '3', label: 'Top and Bottom' },
  ];

  // Font options
  const fonts = [
    { value: '1', label: 'Arial' },
    { value: '2', label: 'Courier_New' },
    { value: '3', label: 'Verdana' },
  ];

  // Effect to show toast message when image URL is updated
  useEffect(() => {
    if (imageUrl) {
      toast.success('Modified Image:', {
        position: "bottom-left",
      });
    }
  }, [imageUrl]);

  // Function to create modified images
  const createImages = async (photoFile) => {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      formData.append('position', selectedDirection);
      formData.append('fontName', selectedFont);
      formData.append('text', inputValue1);
      formData.append('text2', inputValue2);

      const response = await fetch('http://localhost:8080/', {
        method: 'POST',
        body: formData,
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      // Handle errors
    }
  };

  // Event handler for image direction change
  const handleDirectionChange = (value) => {
    setValue(value.target.value);
    setSelectedDirection(value.target.value);
    setInputValues(value.target.value === 'Top and Bottom' ? ["", ""] : [""]);
  };

  // Event handler for font change
  const handleFontChange = (value) => {
    setSelectedFont(value.target.value);
  };

  // Event handler for file input click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Event handler for file change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    if (event.target.files[0]) {
      toast.success('Your image was uploaded successfully', {
        position: "bottom-left",
      });
      createImages(event.target.files[0]);
    } else {
      toast.error('There was a problem with your image', {
        position: "bottom-left",
      });
    }
  };

  // Event handler for email button click
const handleEmailButtonClick = async () => {
  try {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('fileName', fileName);
    const response = await fetch('http://localhost:8080/email', {
      method: 'POST',
      body: formData,
    });
    console.log(response);
    if (response.ok) {
      toast.success('Email sent successfully', {
        position: "bottom-left",
        
      });
      setTimeout(() => {
       window.location.reload();
      }, 3000);
    }
  } catch (error) {
    toast.error('There was a problem sending the email', {
      position: "bottom-left",
    });
  }
}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 'auto' }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".png,.jpg,.tiff"
      />

      <Select
        label="Direction"
        variant="bordered"
        selectedKeys={[value]}
        className="max-w-lg gap-2 text-lg"
        onChange={handleDirectionChange}
        isRequired
      >
        {directions.map((direction) => (
          <SelectItem key={direction.label} value={direction.label}>
            {direction.label}
          </SelectItem>
        ))}
      </Select>

      <Select
        label="Font"
        variant="bordered"
        selectedKeys={[selectedFont]}
        className="max-w-lg gap-2 text-lg"
        onChange={handleFontChange}
        isRequired
      >
        {fonts.map((font) => (
          <SelectItem key={font.label} value={font.label}>
            {font.label}
          </SelectItem>
        ))}
      </Select>

      <div className="w-full flex flex-row gap-2 max-w-[600px] mt-5">
        <NextUIInput
          label="Phrase"
          placeholder="Enter the phrase you want to add"
          size="lg"
          maxLength={15} 
          value={inputValue1}
          onValueChange={(newValue) => {
            setInputValue1(newValue);
          }}
          isRequired
        />
        <NextUIInput
          label="Second phrase"
          placeholder="Enter the phrase you want to add"
          size="lg"
          disabled={selectedDirection !== 'Top and Bottom'}
          value={inputValue2}
          maxLength={15}
          onValueChange={(newValue) => {
            setInputValue2(newValue);
          }}
        
        />
      </div>
      <div className="w-full flex flex-row gap-2 max-w-[600px] mt-5">
        <NextUIInput
          label="Email to send"
          placeholder="Enter the email"
          size="lg"
          value={email}
          onValueChange={(newValue) => {
            setEmail(newValue);
          }}
          isRequired
        />
        <NextUIInput
          label="File name"
          placeholder="Enter the file name"
          size="lg"
          value={fileName}
          onValueChange={(newValue) => {
            setFileName(newValue);
          }}
          isRequired
        />
      </div>
      <div className="w-full flex flex-row gap-80 max-w-[600px] mt-5">
        <Button color="primary" onClick={handleButtonClick}>
          Upload image
        </Button>
        <Button color="primary" onClick={handleEmailButtonClick}>
          Send image by email
        </Button>
      </div>
      <ToastContainer />
    
      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Image" style={{ width: '100%', height: 'auto',marginTop: '20px' }} />
        </div>
      )}
    </div>
  );
}
