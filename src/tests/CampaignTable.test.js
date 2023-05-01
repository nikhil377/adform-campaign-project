import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import CampaignTable from '../components/CampaignTable/CampaignTable';
import { fetchUsers } from '../redux/actions/FetchUser';
import { CampaignTableData } from '../data/CampaignTable';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('CampaignTable', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      users: [{ id: 1, name: 'John Doe' }],
      isLoading: false,
      error: null,
    });
  });

  it('renders the component', () => {
    render(
      <Provider store={store}>
        <CampaignTable />
      </Provider>
    );

    expect(screen.getByText('Start Date')).toBeInTheDocument();
    expect(screen.getByText('End Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Search:')).toBeInTheDocument();
  });

  it('dispatches fetchUsers action on mount', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <CampaignTable />
      </Provider>
    );

    expect(dispatchSpy).toHaveBeenCalledWith(fetchUsers());
  });

  it('filters the campaigns by name when search query is entered', () => {
    render(
      <Provider store={store}>
        <CampaignTable />
      </Provider>
    );

    const searchInput = screen.getByLabelText('Search:');
    userEvent.type(searchInput, 'Campaign 1');

    const campaignRows = screen.getAllByRole('row').slice(1);
    expect(campaignRows).toHaveLength(1);
    expect(campaignRows[0]).toHaveTextContent('Campaign 1');
  });

  it('filters the campaigns by start date and end date', () => {
    render(
      <Provider store={store}>
        <CampaignTable />
      </Provider>
    );

    const startDateInput = screen.getByLabelText('Start Date');
    const endDateInput = screen.getByLabelText('End Date');
    userEvent.type(startDateInput, '2022-01-01');
    userEvent.type(endDateInput, '2022-02-01');

    const campaignRows = screen.getAllByRole('row').slice(1);
    expect(campaignRows).toHaveLength(1);
    expect(campaignRows[0]).toHaveTextContent('Campaign 1');
  });

  it('disables the end date input when start date is not entered', () => {
    render(
      <Provider store={store}>
        <CampaignTable />
      </Provider>
    );

    const endDateInput = screen.getByLabelText('End Date');
    expect(endDateInput).toBeDisabled();
  });

  it('displays an error message when isError is true', () => {
    store = mockStore({
      users: [],
      isLoading: false,
      error: 'Failed to fetch users',
    });

    render(
      <Provider store={store}>
        <CampaignTable />
      </Provider>
    );

    expect(screen.getByText('Something went wrong !')).toBeInTheDocument();
  });
});