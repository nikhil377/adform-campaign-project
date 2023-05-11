import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../../redux/actions/FetchUser';
import { useSelector, useDispatch } from 'react-redux';
import { CampaignTableData } from '../../data/CampaignTable';
import PageLoader from '../../common/PageLoader';
import './CampaignTable.css';

const CampaignTable = () => {
  const dispatch = useDispatch();
  const campaigns = useSelector((state) => state.campaigns);
  const isLoading = useSelector((state) => state.isLoading);
  const isError = useSelector((state) => state.error);

  const [searchQuery, setSearchQuery] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [endDateDisabled, setEndDateDisabled] = useState(true);

  useEffect(() => {
    dispatch(fetchUsers(searchQuery, startDateFilter, endDateFilter));
  }, [searchQuery,startDateFilter,endDateFilter]);


  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };


  const handleStartDateFilterChange = (event) => {
    setStartDateFilter(event.target.value);
    setEndDateDisabled(false);
  };

  const handleEndDateFilterChange = (event) => {
    if (event.target.value >= startDateFilter) {
      setEndDateFilter(event.target.value);
    } else {
      alert('End date should be greater than or equal to start date.');
      setEndDateFilter('');
    }
  };


  const formatNumberToUSDK = (number) => {
    if (number >= 1000) {
      return (number / 1000)?.toFixed(1) + 'K';
    } else {
      return number?.toString();
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
          {campaigns.length == 0 && !isError && (
            <div data-testid="no-data">No Data Found !</div>
          )}
          {campaigns.length > 0 && (
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
                {campaigns &&
                  campaigns.length > 0 &&
                  campaigns.map((user) => (
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
                      <td>{formatNumberToUSDK(user.Budget)} USD</td>
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
