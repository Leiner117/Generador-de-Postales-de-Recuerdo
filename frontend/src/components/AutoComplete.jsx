import React from "react";
import { Select, SelectItem , Input as NextUIInput } from "@nextui-org/react";

export default function App() {
  const directions = [
    { value: '1', label: 'Arriba' },
    { value: '2', label: 'Abajo' },
    { value: '3', label: 'Arriba y Abajo' },
  ];
  const fuentes = [
    { value: '1', label: 'Arial' },
    { value: '2', label: 'Courier_New' },
    { value: '3', label: 'Verdana' },
  ];

  const [selectedDirection, setSelectedDirection] = React.useState(null);
  const [inputValues, setInputValues] = React.useState([""]);
  const [value, setValue] = React.useState("");
  const [selectedFuente, setSelectedFuente] = React.useState(null);

  const handleDirectionChange = (value) => {
    setValue(value.target.value);
    
    setSelectedDirection(value.target.value);
    setInputValues(value.target.value === 'Arriba y Abajo' ? ["", ""] : [""]);
    
  };
  const handleValueChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };
  const handleFuenteChange = (value) => {
    setSelectedFuente(value.target.value);
  }

  return (
  <div>
    <Select
        label="Dirección"
        variant="bordered"
        selectedKeys={[value]}
        className="max-w-lg gap-2 text-lg"
        onChange={handleDirectionChange}
      >
        {directions.map((selectedDirection) => (
          <SelectItem key={selectedDirection.label} value={selectedDirection.label}>
            {selectedDirection.label}
          </SelectItem>
        ))}
      </Select>
      
      {selectedDirection && (
        <div className="w-full flex flex-col gap-2 max-w-[320px]">
          {inputValues.map((value, index) => (
            <NextUIInput
              key={index}
              label="Frase"
              placeholder="Ingrese la frase que quiere agregar"
              value={value}
              onValueChange={(newValue) => handleValueChange(index, newValue)}
              size="lg"
              
            />
          ))}
        </div>
      )}
       <Select
        label="Fuente"
        variant="bordered"
        selectedKeys={[selectedFuente]}
        className="max-w-lg gap-2 text-lg"
        onChange={handleFuenteChange}
 
      >
        {fuentes.map((selectedFuente) => (
          <SelectItem key={selectedFuente.label} value={selectedFuente.label}>
            {selectedFuente.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
