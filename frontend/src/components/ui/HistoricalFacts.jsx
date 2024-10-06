import React from 'react';

const HistoricalFacts = ({facts, currentDate}) => {
    console.log(currentDate)
    console.log(facts[0].date)
    // conditionally render the facts based on the current date

    // convert currentDate to the same format as the facts date
    // currentDate is a iso date string
    const formattedDate = new Date(currentDate).toISOString().split('T')[0]
    console.log(formattedDate)

    console.log(typeof facts[0].date)
    // find the fact that matches the current date
    const fact = facts.find(fact => fact.date === formattedDate)

    


    return (
        <div>
            <h3>{fact && fact.title}</h3>
            
        </div>
    );
};

export default HistoricalFacts;