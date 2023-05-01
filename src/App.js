import { Provider } from 'react-redux';
import {store} from './redux/store';
import CampaignTable from './components/CampaignTable/CampaignTable';
import './App.css';

function App() {

  return (
    <Provider store={store}>
    <div className="App">
      <CampaignTable/>
    </div>
    </Provider>
  );
}

export default App;
