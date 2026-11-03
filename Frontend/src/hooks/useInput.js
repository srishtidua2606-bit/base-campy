import { use, useState } from 'react';


function useInput(initialValue = "", transform = (value) => value) {
    const [value, setValue] = useState(initialValue);

    const handleChange = (e) => {
        setValue(transform(e.target.value))
}

const resetValue = () => {
    setValue(initialValue)
}

return {
    value,
    onChange : handleChange,
    resetValue
}
}

export default useInput;