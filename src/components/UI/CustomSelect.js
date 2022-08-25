import React, { CSSProperties, FunctionComponent, useState, useEffect } from 'react';

import Select from 'react-select';

import AsyncSelect from 'react-select/async'
// import { handleInputChange } from 'react-select/dist/declarations/src/utils';



const CustomSelect = props => {

  const [loading, setLoading] = useState(false)

  const [inputValue, setInputValue] = useState('')

  const CustomClearText = () => <>clear all</>;

  const ClearIndicator = (props) => {
    const {
      children = <CustomClearText />,
      getStyles,
      innerProps: { ref, ...restInnerProps },
    } = props;
    return (
      <div
        {...restInnerProps}
        ref={ref}
        style={getStyles('clearIndicator', props)}
      >
        <div style={{ padding: '0px 5px' }}>{children}</div>
      </div>
    );
  };

  const handleInputChange = (newValue) => {
    const inputValue = newValue.replace(/\W/g, '');
    setInputValue(inputValue);
    return inputValue
  }

  // useEffect(() => {
  //   const timeOutId = setTimeout(() => loadOptions(inputValue), 3000);
  //   return () => clearTimeout(timeOutId);
  // }, [inputValue]);

  const loadOptionsHandler = (inputValue) => {
    // setLoading(true)
    console.log(inputValue)
  }
  const loadOptions = inputValue => {
    // const timeOutId = setTimeout(() => loadOptions(inputValue), 3000);
    let fetchedData;
    fetch('http://localhost:3002/singers/search-by-name?name=' + inputValue, {method: 'GET'})
    .then(result => {
      console.log(result.json())
      // fetchedData = result.body
      setLoading(false)
    })
    .catch(err => {
      console.log(err)
    })
    // return () => clearTimeout(timeOutId);
  };


    return (
        <Select
          closeMenuOnSelect={false}
          components={{ ClearIndicator }}
          isMulti
          getOptionLabel={(option) => `${option.name}`}
          getOptionValue={(option) => `${option.name}`}
          options={props.options}
          // loadOptions={loadOptionsHandler}
          onChange={props.onChange}
          // onInputChange={handleInputChange}
          // isDisabled={loading}
        />
      );
}




export default CustomSelect;