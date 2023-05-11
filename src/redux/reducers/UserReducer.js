import { CampaignTableData } from '../../data/CampaignTable';
  const initialState = {
    campaigns: [],
    isLoading: true,
    error: null,
    startDate: "",
    endDate: "",
    searchQuery: ""
  };
  

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

  const filterCampaigns = (campaignData, searchQuery, startDateFilter, endDateFilter) => {
    let filteredData = campaignData;
    
    if (searchQuery) {
      filteredData = filteredData.filter((campaign) =>
        campaign.campaign.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    if (startDateFilter && endDateFilter) {
      filteredData = filteredData.filter((data) =>
        getTimeForDate(data.startDate) >= getTimeForDate(startDateFilter) &&
        getTimeForDate(data.endDate) <= getTimeForDate(endDateFilter)
      );
    } else if (startDateFilter) {
      filteredData = filteredData.filter((data) =>
        getTimeForDate(data.startDate) >= getTimeForDate(startDateFilter)
      );
    } else if (endDateFilter) {
      filteredData = filteredData.filter((data) =>
        getTimeForDate(data.endDate) <= getTimeForDate(endDateFilter)
      );
    }
    
    return filteredData.map((data) => ({
      ...data,
      active: campaignFallsBetweenDates(data.startDate, data.endDate),
    }));
  };
  
  const convertAndMatchData = (users, searchQuery, startDateFilter, endDateFilter) => {
    if (!users || users.length === 0) return [];
  
    const campaignTableData = [...CampaignTableData];
    
    const filteredCampaignData = campaignTableData.reduce((acc, obj) => {
      for (let i = 0; i < users.length; i++) {
        if (obj.userId === users[i].id) {
          acc.push({
            ...obj,
            userName: users[i].name,
            campaign: `Campaign ${obj.userId}`,
            active: campaignFallsBetweenDates(
              obj.startDate,
              obj.endDate
            )
          });
        }
      }
      return acc;
    }, []);
  
    return filterCampaigns(filteredCampaignData, searchQuery, startDateFilter, endDateFilter);
  };

  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_USERS_SUCCESS':
        return {
          ...state,
          campaigns: convertAndMatchData(action.payload, action.searchData ,action.startDate ,action.endDate),
          isLoading: false,
          error: null
        };
      case 'FETCH_USERS_FAILURE':
        return {
          ...state,
          isLoading: false,
          error: action.payload
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  