import React, { useState } from 'react';
import { Slider } from '@mui/material';
import { format, addDays, subDays, startOfDay } from 'date-fns';

function DateSlider() {
  const today = startOfDay(new Date());
  const [selectedDate, setSelectedDate] = useState(today);

  const handleDateChange = (event, newValue) => {
    setSelectedDate(addDays(today, newValue));
  };

  return (
    <div>
      <Slider
        min={-30}
        max={30}
        step={1}
        value={Math.floor((selectedDate - today) / (1000 * 60 * 60 * 24))}
        // Calculate days difference between selectedDate and today
        // (selectedDate - today) gives difference in milliseconds
        // Divide by milliseconds in a day (1000 * 60 * 60 * 24) to get days
        // Math.floor() rounds down to nearest integer
        onChange={handleDateChange}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => format(addDays(today, value), 'MMM d, yyyy')}
        marks={[
          { value: -30, label: format(subDays(today, 30), 'MMM d') },
          { value: 0, label: 'Today' },
          { value: 30, label: format(addDays(today, 30), 'MMM d') },
        ]}
      />
      <p>Selected Date: {format(selectedDate, 'MMMM d, yyyy')}</p>
    </div>
  );
}

export default DateSlider;
