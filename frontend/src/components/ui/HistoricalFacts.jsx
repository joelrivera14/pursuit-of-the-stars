import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import './HistoricalFacts.css';

const HistoricalFacts = ({ facts, currentDate }) => {
    const formattedDate = new Date(currentDate).toISOString().split('T')[0];
    const fact = facts.find(fact => fact.date === formattedDate);

    return (
        <Card className="fact-card">
            <CardContent>
                {fact ? (
                    <>
                        <Typography variant="h5" component="h2" className="fact-title">
                            {fact.title}
                        </Typography>
                        <Typography color="textSecondary" gutterBottom className="fact-date">
                            {fact.date}
                        </Typography>
                        <Typography variant="body2" component="p" className="fact-description">
                            {fact.description}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className="fact-location">
                            Location: {fact.location}
                        </Typography>
                    </>
                ) : (
                    <Typography variant="body1">No historical fact for this date.</Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default HistoricalFacts;