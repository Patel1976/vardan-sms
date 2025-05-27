import axios from 'axios';
import Select from 'react-select';
import { useState, useCallback, useEffect } from 'react';

const SearchBar = ({ onSelectedOptionsChange, staffName, token }) => {
    const API_URL_STAFF = import.meta.env.VITE_BASE_URL_STAFF;
    const [selectedOption, setSelectedOption] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (staffName) {
            setSelectedOption({ value: staffName.value, label: staffName.label });
        } else {
            setSelectedOption(null);
        }
        fetchSuggestions('');
    }, [staffName]);

    const fetchSuggestions = useCallback(async (query) => {
        try {
            const response = await axios.get(`${API_URL_STAFF}search-staff?query=${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const options = response.data.map((item) => ({
                value: item.id,
                label: item.name,
                uuid: item.uuid
            }));
            setSuggestions(options);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }, [token]);

    const handleInputChange = (newQuery) => {
        fetchSuggestions(newQuery);
    };

    const handleSelectChange = (selected) => {
        setSelectedOption(selected);
        onSelectedOptionsChange(selected || null);
    };

    return (
        <div className="form-group">
            <Select
                isClearable
                menuPlacement="auto"
                value={selectedOption}
                onChange={handleSelectChange}
                onInputChange={handleInputChange}
                options={suggestions}
                placeholder="Search Staff by Name..."
                styles={{
                    control: (provided) => ({
                        ...provided,
                        minWidth: '16rem',
                    }),
                }}
            />
        </div>
    );
};

export default SearchBar;