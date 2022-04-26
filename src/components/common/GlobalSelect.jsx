import React, { useState } from "react";
import Select from 'react-select';


function GlobalSelect({options}){  
 
    
  const [selectedOption, setSelectedOption] = useState();


  const handleChange = selectedOption => {
    setSelectedOption(selectedOption);
  };
    

    return (
      <div>
<Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
      />

      </div>
      
    );
  
  }

  export default GlobalSelect;