import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useHttp } from "../hooks/http.hook";


export const AutosuggestFilter = (props) => {
    const [value, setValue] = useState();
    const [options, setOptions] = useState();
    const [inputvalue, setInputvalue] = useState();
    const { request, loading, error } = useHttp();
    // const [optionsmas, setOptionsmas] = useState([]);

    const handleInputChange =(value)=>{
        setInputvalue(value);
        getCitiesHandler(value);
    }

    const getCitiesHandler = async (val) =>{
        try {
            console.log(val);
            const formData = new FormData();
            formData.append("search",val);
            if(props.name == "district"){
                if(props.state !=null){
                    formData.append("stateId", props.state.value);
                }
            }
            if(props.name == "city"){
                if(props.state !=null){
                    formData.append("stateId", props.state.value);
                }
                if(props.district != null){
                    formData.append("districtId", props.district.value);
                }
            }
            console.log("asasa")
            await request(`/api/cities/get${props.name}`, 'POST', formData)
                .then(res => {
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
        className='order-2'
        placeholder="Почніть вводити назву"
        isClearable={true}
        isSearchable={true}
        maxMenuHeight={200}
        name={props.name}
        onInputChange={handleInputChange}
        options={options}
        isLoading={loading}
        value={props.citie}
        onChange={props.setCitie}
      />
    )
}