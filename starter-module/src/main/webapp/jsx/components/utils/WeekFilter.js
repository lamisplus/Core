import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import { FaCaretRight, FaCaretLeft } from 'react-icons/fa';

import moment from 'moment';
// import scrollIntoView from 'scroll-into-view';

const useStyles = makeStyles({
    weekButton: {
        margin: '5px',
        padding: '5px',
        cursor: 'pointer',
    },
    selectedWeek: {
        backgroundColor: '#014d88',
        color: 'white',
        '&:hover': {
            backgroundColor: '#014d88',
            color: 'white',
        }
    },
    buttonNormal: {
        backgroundColor: '#b5b5b5',
        '&:hover': {
            backgroundColor: 'lightblue',
            color: 'black',
        }
    },
    weekContainerPadding: {
        maxWidth: '40%',
        padding: '5px ',
        position: 'relative',
    },
    weekContainer: {
        display: 'flex',
        overflowX: 'auto',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
        
    },
    filterContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px'
    },
    dropdown: {
        marginRight: '10px',
        backgroundColor:'red',
    },
    margin: {
        margin: '10px',
    },
});

const WeekFilter = () => {
    const classes = useStyles();
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [weeks, setWeeks] = useState([]);
    const [filterWeeks, setFilterWeeks] = useState([moment().week()-2, moment().week() - 1, moment().week()]);
    const [selectedWeekValue, setSelectedWeekValue] = useState({week: moment().week(), year: new Date().getFullYear()});
    const weekRef = useRef();


    useEffect(() => {
        if (weekRef.current !== null && weekRef.current !== undefined && selectedWeek !== null) {
            // weekRef.current.scrollIntoView({ behavior: 'smooth', inline: 'start' });
        }
    }, [selectedWeek]);

    useEffect(() => {
        if(selectedYear === new Date().getFullYear()){
            setWeeks(Array.from({ length: moment().week() }, (_, index) => index + 1))
        } else {
            setWeeks(Array.from({ length: 52 }, (_, index) => index + 1))
        }
    }, [selectedYear]);

    const handleYearChange = (event, data) => {
        setSelectedYear(data.value);
        setSelectedWeekValue({week: selectedWeek, year: data.value});
        setSelectedWeek(null);
    };

    const handleWeekClick = (event, data) => {
        const week = data.value;
        setSelectedWeek(week);
        setSelectedWeekValue({week: week, year: selectedYear});
        if (week === moment().week() && selectedYear === new Date().getFullYear()) {
            setFilterWeeks([week - 2, week - 1, week]);
        } else {
            setFilterWeeks([week - 1, week, week + 1]);
        }
        console.log(`Selected Week: Wk ${week}, ${selectedYear}`);
    };
    const handleWeekButtonClick = (week) => {
        setSelectedWeek(week);
        setSelectedWeekValue({week: week, year: selectedYear});
        if (selectedWeek === moment().week() && selectedYear === new Date().getFullYear()) {
            setFilterWeeks([week - 2, week - 1, week]);
        } else {
            setFilterWeeks([week - 1, week, week + 1]);
        }
        console.log(`Selected Week: Wk ${week}, ${selectedYear}`);
    }

//     useEffect(() => {
//         console.log("YEAAAAH", selectedWeek, selectedYear);
//         if (selectedWeek === moment().week() && selectedYear === new Date().getFullYear()) {
//             setFilterWeeks([selectedWeek - 2, selectedWeek - 1, selectedWeek]);
//         } else {
//             setFilterWeeks([selectedWeek - 1, selectedWeek, selectedWeek + 1]);
//         }

// }, [selectedWeek, selectedYear]);
console.log(filterWeeks);


    return (
        <div>
            <div className={classes.filterContainer}>
                <Dropdown
                    className={classes.dropdown}
                    placeholder="Select Year"
                    selection
                    value={selectedYear}
                    onChange={handleYearChange}
                    options={[
                        { key: '2020', text: '2020', value: 2020 },
                        { key: '2021', text: '2021', value: 2021 },
                        { key: '2022', text: '2022', value: 2022 },
                        { key: '2023', text: '2023', value: 2023 },
                        { key: '2024', text: '2024', value: 2024 },
                        { key: '2025', text: '2025', value: 2025 },
                    ]}
                />
                <Dropdown
                    className={classes.dropdown}
                    placeholder="Select Week"
                    selection
                    value={selectedWeek}
                    onChange={handleWeekClick}
                    options={weeks.map(each => {
                        return { key: each, text: `Week ${each}`, value: each }
                    })}
                />
                <div className={`${classes.weekContainerPadding} ${classes.margin}`}>
                <div id={"weeks-filter"} className={classes.weekContainer}>
                    <FaCaretLeft size={30}/>
                    {filterWeeks.map((week) => (
                        <div ref={weekRef}>
                            <Button
                                key={week}
                                className={`${classes.weekButton} ${(selectedWeekValue.week === week && selectedWeekValue.year === selectedYear) ? classes.selectedWeek : classes.buttonNormal}`}
                                onClick={() => handleWeekButtonClick(week)}
                            >
                                Wk {week}, {selectedYear}
                            </Button>
                        </div>
                    ))}
                <FaCaretRight size={30} />
                </div>
                </div>
                {/* <div><Typography>Filter</Typography></div> */}
            </div>
        </div>
    );
};

export default WeekFilter;
