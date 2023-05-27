import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useHttp } from "../hooks/http.hook";
// import '../autostyles.css';

export const AutosuggestComp = (props) => {
    const [value, setValue] = useState();
    const [options, setOptions] = useState();
    const [inputvalue, setInputvalue] = useState();
    const { request, loading, error } = useHttp();
    // const [optionsmas, setOptionsmas] = useState([]);
    const customStyles = {
      input: (provided, state) => ({
        ...provided,
        color: "white",
      }),
      control: (provided) => ({
        ...provided,
        width: "100%",
      }),
      singleValue: (provided) => ({
        ...provided,
        color: "white",
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#333333" : null,
        color: state.isSelected ? "#ffffff" : null,
        "&:hover": {
          backgroundColor: "#333333",
          color: "#ffffff",
        },
      }),
        control: (provided, state) => ({
          ...provided,
          color: 'white',
          height: '30px',
         
          fontWeight: 500,
          fontSize: '16px',
          paddingLeft: '10px',
          paddingRight: '10px',
          border: 'none',
          borderBottom: '2px solid rgba(145, 87, 0, 0.6)',
          background: 'none',
          color: 'white',
          '&:hover': {
            border: '2px solid #FC9905',
            outline: 'none',
            boxShadow: 'none',
            color: 'white'
          },
          '&:focus': {
            border: '2px solid #FC9905',
            outline: 'none',
            boxShadow: 'none',
            color: 'white'  
          },
          input: (provided, state) => ({
            ...provided,
            color: 'white !important', 
            width: '100%', 
          }),
        }),
        menu: (provided, state) => ({
          ...provided,
          background: '#636363',
        }),
        option: (provided, state) => ({
          ...provided,
          color: 'white',
          backgroundColor: state.isSelected ? '#FC9905' : 'transparent',
          '&:hover': {
            backgroundColor: '#FC9905',
          },
          singleValue: (provided, state) => ({
            // ...provided,
            color: 'white',
          }),
        }),
      };
    

    const handleInputChange =(value)=>{
        setInputvalue(value);
        
        console.log(value);
        getCitiesHandler(value);
    }

    const getCitiesHandler = async (val) =>{
        try {
            console.log(val);
            const formData = new FormData();
            formData.append("search",val);
            console.log("asasa")
            await request(`/api/cities/getcitiesbyname`, 'POST', formData)
                .then(res => {
                    // console.log(res.cities);
                    const mappedOptions = res.cities.map(option => ({
                      value: option[0],
                      label: option[1]
                    }));
                    setOptions(mappedOptions);
                });
        }
        catch (e) { }
    }
    useEffect(()=>{
      console.log(props.citie);
    },[props.citie])
    return(
        <Select
        // className="react-select"
        // classNamePrefix="react-select"
        styles={customStyles}
        placeholder="Почніть вводити місто"
        isClearable={true}
        isSearchable={true}
        maxMenuHeight={200}
        name="citie"
        onInputChange={handleInputChange}
        options={options}
        isLoading={loading}
        value={props.citie}
        onChange={props.setCitie}
      />
    )
}