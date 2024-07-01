import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, ButtonBase, Typography } from '@material-ui/core';
import { FaCaretRight, FaCaretLeft } from 'react-icons/fa';

import moment from 'moment';

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
        backgroundColor: 'red',
    },
    filterTypeSelector: {
        margin: '5px',
        padding: '5px',
        fontWeight: 500,
    },
    filterTypeDull: {
        color: 'gray',
        cursor: 'pointer',
        '&:hover': {
            color: 'lightblue',
        }
    },
    filterTypeGray: {
        color: 'gray',
        cursor: 'pointer',
    },
    filterTypeSelected: {
        color: '#014d88',
        cursor: 'pointer'
    },
});

const DashboardDataFilter = ({ callBackFunction, disabled=false }) => {
    const END_OF_WEEK = 6;
    const classes = useStyles();
    const [selectedWeek, setSelectedWeek] = useState(moment().day(END_OF_WEEK).week());
    const [weeks, setWeeks] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(moment().endOf('month').month());
    const [quarters, setQuarters] = useState([]);
    const [selectedQuarter, setSelectedQuarter] = useState(moment().endOf('quarter').quarter());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [filterWeeks, setFilterWeeks] = useState([moment().subtract(2, 'week'), moment().subtract(1, 'week'), moment().day(END_OF_WEEK)]);
    const [currentSelectedWeek, setCurrentSelectedWeek] = useState(moment().day(END_OF_WEEK));
    const [currentSelectedMonth, setCurrentSelectedMonth] = useState(moment().endOf('month'));
    const [currentSelectedQuarter, setCurrentSelectedQuarter] = useState(moment().endOf('quarter'));
    const [filterType, setFilterType] = useState('week');
    const [months, setMonths] = useState([]);
    const [currentSelectionDisplay, setCurrentSelectionDisplay] = useState(currentSelectedWeek.format('W, YYYY'));
    const MINUS_MONTHS_FOR_FY_START = 3;

    const updateFilterType = (type) => {
        if(disabled === false){
            setFilterType(type);
        }
    }

    useEffect(() => {
        if (filterType === 'year') {
            const startDate = moment().year(selectedYear).startOf('year').format("DD-MM-YYYY");
            const endDate = moment().year(selectedYear).endOf('year').format("DD-MM-YYYY");
            callBackFunction([startDate, endDate]);
        }

        if (filterType === 'quarter') {
            const startDate = moment(selectedQuarter).year(selectedYear).startOf('quarter').format("DD-MM-YYYY");
            const endDate = moment(selectedQuarter).year(selectedYear).endOf('quarter').format("DD-MM-YYYY");
            callBackFunction([startDate, endDate]);
        }

        if (filterType === 'month') {
            const startDate = moment().year(selectedYear).month(selectedMonth).startOf('month').format("DD-MM-YYYY");
            const endDate = moment().year(selectedYear).month(selectedMonth).endOf('month').format("DD-MM-YYYY");
            callBackFunction([startDate, endDate]);
        }
        if (filterType === 'week') {
            const startDate = moment(currentSelectedWeek).subtract(6, 'day').format("DD-MM-YYYY");
            const endDate = moment(currentSelectedWeek).format("DD-MM-YYYY");
            callBackFunction([startDate, endDate]);
        }

    }, [filterType]);

    const getCurrentFilterTypeValue = () => {
        if (filterType === 'year') {
            return selectedYear;
        } else if (filterType === 'quarter') {
            return `Quarter ${currentSelectedQuarter.format('Q, YYYY')}`;
        } else if (filterType === 'month') {
            return `${moment(currentSelectedMonth).format('MMMM, YYYY')}`;
        } else if (filterType === 'week') {
            return `Week ${currentSelectedWeek.format('W, YYYY')}`;
        }
    }

    useEffect(() => {
        const current = getCurrentFilterTypeValue()
        setCurrentSelectionDisplay(current);
    },[filterType, selectedYear, selectedQuarter, selectedMonth, currentSelectedWeek, currentSelectedMonth, currentSelectedQuarter])

    useEffect(() => {
        if (selectedYear === new Date().getFullYear()) {
            setWeeks(Array.from({ length: moment().week() }, (_, index) => index + 1))
            setMonths(Array.from({ length: moment().endOf('month').month() + 1 }, (_, index) => index))
            setQuarters(Array.from({ length: moment().endOf('quarter').quarter() }, (_, index) => index + 1))
        } else {
            setWeeks((prev) => Array.from({ length: moment().year(selectedYear).weeksInYear() }, (_, index) => index + 1))
            setMonths(Array.from({ length: 12 }, (_, index) => index))
            setQuarters(Array.from({ length: 4 }, (_, index) => index + 1))
        }
    }, [selectedYear]);

    const handleYearChange = (event, data) => {
        const currentYear = new Date().getFullYear();
        if (data.value >= currentYear) {
            setSelectedYear(currentYear);
        } else {
            setSelectedYear(data.value);
        }

        if (filterType === 'year') {
            const startDate = moment().year(data.value).startOf('year').format("DD-MM-YYYY");
            const endDate = moment().year(data.value).endOf('year').format("DD-MM-YYYY");
            callBackFunction([startDate, endDate]);
        }
    };

    const handleWeekSelectorClick = (event, data) => {
        if (data.value) {
            const week = data.value;
            const weekAndYearWithMoment = moment().year(selectedYear).week(week).day(END_OF_WEEK);
            handleWeekButtonClick(weekAndYearWithMoment);
        }
    };

    const handleMonthSelectorClick = (event, data) => {
        if (data.value !== null && data.value !== undefined) {
            const month = data.value;
            const endDate = moment().year(selectedYear).month(month).endOf('month').format("DD-MM-YYYY");
            const startDate = moment().year(selectedYear).month(month).startOf('month').format("DD-MM-YYYY");
            setSelectedMonth(month);
            setCurrentSelectedMonth(moment().year(selectedYear).month(month).endOf('month'));
            callBackFunction([startDate, endDate]);
        }
    };

    const handleQuarterSelectorClick = (event, data) => {
        if (data.value !== null && data.value !== undefined) {
            const quarter = data.value;
            const quarterAndYearWithMoment = moment().year(selectedYear).quarter(quarter).endOf('quarter');
            setSelectedQuarter(quarter);
            setCurrentSelectedQuarter(quarterAndYearWithMoment);
            callBackFunction([moment(quarterAndYearWithMoment).startOf('quarter').format("DD-MM-YYYY"), quarterAndYearWithMoment.format("DD-MM-YYYY")]);
        }
    };


    const handleWeekButtonClick = (week) => {
        const weekAfter = moment(week).day(END_OF_WEEK).add(1, 'week');
        const weekBefore = moment(week).day(END_OF_WEEK).subtract(1, 'week');
        const currentWeek = moment().day(END_OF_WEEK);
        const weekBeforeCurrent = moment(currentWeek).subtract(1, 'week');
        const weekBeforeBeforeCurrent = moment(currentWeek).subtract(2, 'week');
        setCurrentSelectedWeek(week.day(END_OF_WEEK));
        setSelectedWeek(week.week());
        setSelectedYear(week.year());
        setFilterWeeks(prev => {
            return weekAfter.isAfter(currentWeek) ? [weekBeforeBeforeCurrent, weekBeforeCurrent, currentWeek] : [weekBefore, week, weekAfter]
        });

        const startDate = moment(week.day(END_OF_WEEK)).subtract(6, 'day').format("DD-MM-YYYY");
        const endDate = moment(week.day(END_OF_WEEK)).format("DD-MM-YYYY");
        callBackFunction([startDate, endDate]);
    }

    const moveWeek2 = (direction) => {
        if (!disabled) {
        const currentWeek = moment().day(END_OF_WEEK);
        const oneWeekBeforeNow = moment().subtract(1, 'week');
        const twoWeeksBeforeNow = moment().subtract(2, 'week');
        const currentSelectedWeekClone = moment(currentSelectedWeek);
        const nextPossibleWeek = moment(currentSelectedWeek).add(1, 'week');
        const nextPossible2Weeks = moment(currentSelectedWeek).add(2, 'week');
        const prevPossibleWeek = moment(currentSelectedWeek).subtract(1, 'week');
        const prevPossible2Weeks = moment(currentSelectedWeek).subtract(2, 'week');

        let newSelectedWeek;
        let newFilterWeeks;

        if (direction === "forward") {
            newSelectedWeek = nextPossibleWeek.isSameOrAfter(currentWeek) ? currentSelectedWeekClone : nextPossibleWeek;
            newFilterWeeks = (nextPossibleWeek.isSameOrAfter(currentWeek) || nextPossible2Weeks.isSameOrAfter(currentWeek)) ? [twoWeeksBeforeNow, oneWeekBeforeNow, currentWeek] : [currentSelectedWeek, nextPossibleWeek, nextPossible2Weeks];
        } else if (direction === "back") {
            newSelectedWeek = prevPossibleWeek;
            newFilterWeeks = nextPossibleWeek.isSameOrAfter(currentWeek) ? [twoWeeksBeforeNow, oneWeekBeforeNow, currentWeek] : [prevPossible2Weeks, prevPossibleWeek, currentSelectedWeekClone];
        }

        setCurrentSelectedWeek(newSelectedWeek.day(END_OF_WEEK));
        setSelectedWeek(newSelectedWeek.week());
        setSelectedYear(newSelectedWeek.year());
        setFilterWeeks(newFilterWeeks);

        const startDate = moment(newSelectedWeek.day(END_OF_WEEK)).subtract(6, 'day').format("DD-MM-YYYY");
        const endDate = moment(newSelectedWeek.day(END_OF_WEEK)).format("DD-MM-YYYY");
        callBackFunction([startDate, endDate]);
    }

    }

    const getFilterTypeCSS = (type) => {
        if (!disabled && type === filterType) {
            return classes.filterTypeSelected;
        } else if (disabled && type === filterType) {
            return classes.filterTypeSelected;
        } else if (disabled && type !== filterType) {
            return classes.filterTypeGray;
        } else {
            return classes.filterTypeDull;
        }
    }

    return (
        <div style={{ marginTop: "-20px", position: "relative", zIndex: 100 }}>
            <p className={classes.filterTypeSelector}>
                <span onClick={() => updateFilterType('year')} className={getFilterTypeCSS('year')}>Yearly</span>
                <span>{` / `}</span>
                <span onClick={() => updateFilterType('quarter')} className={getFilterTypeCSS('quarter')}>Quarterly</span>
                <span>{` / `}</span>
                <span onClick={() => updateFilterType('month')} className={getFilterTypeCSS('month')}>Monthly</span>
                <span>{` / `}</span>
                <span onClick={() => updateFilterType('week')} className={getFilterTypeCSS('week')}>Weekly</span>
            </p>
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
                    disabled={disabled}
                />
                {filterType === 'week' && <Dropdown
                    className={classes.dropdown}
                    placeholder="Select Week"
                    selection
                    value={selectedWeek}
                    onChange={handleWeekSelectorClick}
                    options={weeks.map(each => {
                        return { key: each, text: `Week ${each}`, value: each }
                    })}
                    disabled={disabled}
                />}
                {filterType === 'month' && <Dropdown
                    className={classes.dropdown}
                    placeholder="Select Month"
                    selection
                    value={selectedMonth}
                    onChange={handleMonthSelectorClick}
                    options={months.map(each => {
                        return { key: each, text: `${moment().month(each).format('MMMM')}, ${selectedYear}`, value: each }
                    })}
                    disabled={disabled}
                />}
                {filterType === 'quarter' && <Dropdown
                    className={classes.dropdown}
                    placeholder="Select Quarter"
                    selection
                    value={selectedQuarter}
                    onChange={handleQuarterSelectorClick}
                    options={quarters.map(each => {
                        return { key: each, text: `Quarter ${each}, ${selectedYear}`, value: each }
                    })}
                    disabled={disabled}
                />}
                {filterType === 'week' && <div className={classes.weekContainer}>
                    <ButtonBase style={{cursor:'pointer'}} onClick={() => moveWeek2("back")} >
                    <FaCaretLeft color='#014d88' cursor={'pointer'} size={30} />
                    </ButtonBase>
                    {filterWeeks.map((week) => (
                        <div>
                            <Button
                                key={week.format("W,YYYY")}
                                className={`${classes.weekButton} ${(week.format("W, YYYY") === currentSelectedWeek.format("W, YYYY")) ? classes.selectedWeek : classes.buttonNormal}`}
                                onClick={() => handleWeekButtonClick(week)}
                                disabled={disabled}
                            >
                                Wk {week.week()}, {week.year()}
                            </Button>
                        </div>
                    ))}
                    <ButtonBase style={{cursor:'pointer'}} onClick={() => moveWeek2("forward")}>
                    <FaCaretRight color='#014d88' cursor={'pointer'} size={30} />
                    </ButtonBase>

                </div>}
            </div>
            <Typography style={{ marginTop: "-10px", marginLeft: "5px", color: "#014d88" }} variant="h6" >{`Showing data for ${currentSelectionDisplay}.`}</Typography>
        </div>
    );
};

export default DashboardDataFilter;
