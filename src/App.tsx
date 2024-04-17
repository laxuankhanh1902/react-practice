import React from 'react';
import Table from './components/Table';
import data from './assets/random-people-data.json';

const App: React.FC = () => {
    return (
        <div>
            <h1>People Data Table</h1>
            <Table data={data.ctRoot} />
        </div>
    );
};

export default App;
