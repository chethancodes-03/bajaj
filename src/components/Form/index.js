import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './index.css';

const JsonForm = () => {
  const [inputText, setInputText] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [chosenOptions, setChosenOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sanitizeJsonInput = (input) => input.replace(/“|”/g, '"');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const sanitizedInput = sanitizeJsonInput(inputText);
      const parsedData = JSON.parse(sanitizedInput);

      if (!parsedData || !Array.isArray(parsedData.data)) {
        throw new Error('Invalid JSON format');
      }

      const response = await axios.post('http://localhost:5000/bfhl', parsedData);
      setApiResponse(response.data);
    } catch (error) {
      setApiResponse(null);
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectChange = (selected) => setChosenOptions(selected);

  const renderApiResponse = () => {
    if (!apiResponse) return null;

    const selectedValues = chosenOptions.map(option => option.value);
    const displayData = {};

    if (selectedValues.includes('Alphabets')) displayData.alphabets = apiResponse.alphabets || [];
    if (selectedValues.includes('Numbers')) displayData.numbers = apiResponse.numbers || [];
    if (selectedValues.includes('Highest lowercase alphabet')) displayData.highestLowercase = apiResponse.highest_lowercase_alphabet || [];

    return (
      <div>
        <h3>Response:</h3>
        {Object.keys(displayData).length > 0 ? (
          <ul className="List">
            {displayData.alphabets && (
              <li className="ListItem">
                <strong>Alphabets:</strong> {displayData.alphabets.join(', ')}
              </li>
            )}
            {displayData.numbers && (
              <li className="ListItem">
                <strong>Numbers:</strong> {displayData.numbers.join(', ')}
              </li>
            )}
            {displayData.highestLowercase && (
              <li className="ListItem">
                <strong>Highest lowercase alphabet:</strong> {displayData.highestLowercase.join(', ')}
              </li>
            )}
          </ul>
        ) : (
          <p className="Message">No data to display. </p>
        )}
      </div>
    );
  };

  return (
    <div className="Container">
      <h1 className="Title">{apiResponse ? 'Response' : 'input data'}</h1>
      <textarea
        className="TextArea"
        rows="5"
        cols="50"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder='{"data": ["A", "C", "z"]}'
      />
      <br />
      <button className="Button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      {errorMessage && <div className="Error">{errorMessage}</div>}
      {apiResponse && (
        <div className="SelectWrapper">
          <Select
            isMulti
            options={[
              { value: 'Alphabets', label: 'Alphabets' },
              { value: 'Numbers', label: 'Numbers' },
              { value: 'Highest lowercase alphabet', label: 'Highest lowercase alphabet' }
            ]}
            onChange={handleSelectChange}
            placeholder="Options"
          />
        </div>
      )}
      {renderApiResponse()}
    </div>
  );
};

export default JsonForm;
