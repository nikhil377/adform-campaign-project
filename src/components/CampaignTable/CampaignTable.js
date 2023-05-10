import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../../redux/actions/FetchUser';
import { useSelector, useDispatch } from 'react-redux';
import { CampaignTableData } from '../../data/CampaignTable';
import PageLoader from '../../common/PageLoader';
import './CampaignTable.css';

const CampaignTable = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const isLoading = useSelector((state) => state.isLoading);
  const isError = useSelector((state) => state.error);


  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [originalfilteredCampaigns, setOriginalFilteredCampaigns] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [endDateDisabled, setEndDateDisabled] = useState(true);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  useEffect(() => {
    if (users && users.length > 0) {
      const filteredCampaignData = [];
      CampaignTableData.filter((obj) => {
        for (let i = 0; i < users.length; i++) {
          if (obj.userId === users[i].id) {
            obj['userName'] = users[i]['name'];
            obj['campaign'] = 'Campaign ' + obj.userId;
            obj['active'] = campaignFallsBetweenDates(
              obj.startDate,
              obj.endDate
            );
            filteredCampaignData.push(obj);
          }
        }
      });
      setFilteredCampaigns(filteredCampaignData);
      setOriginalFilteredCampaigns(filteredCampaignData);
    }
  }, [users]);


  useEffect(() => {
    const filteredBySearchQuery =
      searchQuery.trim() === ''
        ? originalfilteredCampaigns
        : originalfilteredCampaigns.filter((campaign) =>
            campaign.campaign.toLowerCase().includes(searchQuery.toLowerCase())
          );

    setFilteredCampaigns(filteredBySearchQuery);
  }, [searchQuery]);

  
  useEffect(() => {
    const filteredData = originalfilteredCampaigns.filter((data) => {
      if (startDateFilter && endDateFilter) {
        return (
          getTimeForDate(data.startDate) >= getTimeForDate(startDateFilter) &&
          getTimeForDate(data.endDate) <= getTimeForDate(endDateFilter)
        );
      } else if (startDateFilter) {
        return (
          getTimeForDate(data.startDate) >= getTimeForDate(startDateFilter)
        );
      } else if (endDateFilter) {
        return getTimeForDate(data.endDate) <= getTimeForDate(endDateFilter);
      } else {
        setEndDateDisabled(true);
        return originalfilteredCampaigns;
      }
    });
    setFilteredCampaigns(filteredData);
  }, [startDateFilter, endDateFilter]);
  
  const campaignFallsBetweenDates = (dateFrom, dateTo) => {
    // current date in dd/mm/yyyy
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const formattedToday = dd + '/' + mm + '/' + yyyy;

    return getTimeForDate(formattedToday) >= getTimeForDate(dateFrom) &&
      getTimeForDate(formattedToday) <= getTimeForDate(dateTo)
      ? 'Active'
      : 'Inactive';
  };

  const getTimeForDate = (date) => {
    var dateData = new Date(date);
    return dateData.getTime();
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };


  const handleStartDateFilterChange = (event) => {
    setStartDateFilter(event.target.value);
    //handleFilter();
    setEndDateDisabled(false);
  };

  const handleEndDateFilterChange = (event) => {
    if (event.target.value >= startDateFilter) {
      setEndDateFilter(event.target.value);
    } else {
      alert('End date should be greater than or equal to start date.');
      setEndDateFilter('');
      setFilteredCampaigns([]);
    }
    //  handleFilter();
  };


  const formatNumber = (number) => {
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    } else {
      return number.toString();
    }
  };

  return (
    <>
      {isLoading ? <PageLoader /> : null}
      {isError && <div> Something went wrong !</div>}

      {!isError && (
        <div className='user-table-container'>
        <div className='filters'>
          <div className='date-filters'>
          <label htmlFor='start-date'>Start Date </label>
            <input
              type='date'
              id='start-date'
              placeholder='Start Date'
              onChange={handleStartDateFilterChange}
              value={startDateFilter}
            />
            <label htmlFor='end-date' className='end-date-label'>End Date</label>
            <input
              type='date'
              id='end-date'
              placeholder='End Date'
              onChange={handleEndDateFilterChange}
              value={endDateFilter}
              disabled={endDateDisabled}
            />
          </div>
          <div className='search-container'>
            <label htmlFor='search-bar'>Search: </label>
            <input
              type='text'
              id='search-bar'
              placeholder='Filter by Name'
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
      </div>
          {filteredCampaigns.length == 0 && !isError && (
            <div data-testid="no-data">No Data Found !</div>
          )}
          {filteredCampaigns.length > 0 && (
            <table className='user-table'>
              <thead>
                <tr data-testid="row">
                  <th>Name</th>
                  <th>User Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Active</th>
                  <th>Budget</th>
                </tr>
              </thead>

              <tbody>
                {filteredCampaigns &&
                  filteredCampaigns.length > 0 &&
                  filteredCampaigns.map((user) => (
                    <tr key={user.id} data-testid="row">
                      <td>{user.campaign}</td>
                      <td>{user.userName ? user.userName : 'Unknown User'}</td>
                      <td>{user.startDate}</td>
                      <td>{user.endDate}</td>
                      <td>
                        {user.active && user.active == 'Active' ? (
                          <span>&#128994; Active</span>
                        ) : (
                          <span>&#128308; Inactive</span>
                        )}
                      </td>
                      <td>{formatNumber(user.Budget)} USD</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
};

export default CampaignTable;
