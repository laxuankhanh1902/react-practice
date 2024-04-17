import React, {useState, useMemo, useEffect} from 'react';
import {styled} from '@stitches/react';
import {Person, ColumnKey} from '../types';
import Pagination from './Pagination';

interface TableProps {
    data: Person[];
}

const StyledTable = styled('table', {
    width: '100%',
    borderCollapse: 'collapse',
    'th, td': {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'left',
    },
    '.highlight': {
        backgroundColor: '#3E3E0BFF',
    }
});

const ControlPanel = styled('div', {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    alignItems: 'center',
});

const Input = styled('input', {
    margin: '0 10px',
    padding: '5px',
});

const defaultColumns: ColumnKey[] = ['name', 'dob', 'email', 'verified', 'salary'];

const Table: React.FC<TableProps> = ({data}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortColumn, setSortColumn] = useState<ColumnKey | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(defaultColumns);
    const [jumpToRow, setJumpToRow] = useState<number | null>(null);
    const [filter, setFilter] = useState('');

    const filteredData = useMemo(() => {
        return data.filter(person =>
            visibleColumns.some(column => person[column].toString().toLowerCase().includes(filter.toLowerCase()))
        );
    }, [data, filter, visibleColumns]);

    const sortedData = useMemo(() => {
        if (!sortColumn) return filteredData;
        return [...filteredData].sort((a, b) => {
            if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
            if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortColumn, sortDirection]);

    useEffect(() => {
        if (jumpToRow !== null) {
            const page = Math.ceil(jumpToRow / rowsPerPage);
            setCurrentPage(page);
        }
    }, [jumpToRow, rowsPerPage]);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);

    const handleJumpToRow = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rowNumber = parseInt(event.target.value, 10);
        if (!isNaN(rowNumber) && rowNumber >= 1 && rowNumber <= data.length) {
            setJumpToRow(rowNumber - 1);
        } else {
            setJumpToRow(null);
        }
    };

    const toggleSort = (column: ColumnKey) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const handleColumnVisibilityChange = (column: ColumnKey, isChecked: boolean) => {
        setVisibleColumns(prev => isChecked
            ? [...prev, column]
            : prev.filter(c => c !== column)
        );
    };

    return (
        <div>
            <ControlPanel>
                <div>
                    <label>
                        Filter:
                        <Input type="text" value={filter} onChange={(e) => setFilter(e.target.value)}
                               placeholder="Filter data..."/>
                    </label>
                    {defaultColumns.map((column) => (
                        <label key={column}>
                            <input
                                type="checkbox"
                                checked={visibleColumns.includes(column)}
                                onChange={(e) => handleColumnVisibilityChange(column, e.target.checked)}
                            />
                            Show {column}
                        </label>
                    ))}
                </div>
            </ControlPanel>
            <StyledTable>
                <thead>
                <tr>
                    {visibleColumns.map(col => (
                        <th key={col} onClick={() => toggleSort(col)}>
                            {col.toUpperCase()} {sortColumn === col ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {currentRows.map((row, index) => (
                    <tr key={index} className={index + indexOfFirstRow === jumpToRow ? 'highlight' : ''}>
                        {visibleColumns.map(col => (
                            <td key={col}>
                                {col === 'verified' ? (row[col] ? 'Yes' : 'No') : row[col]}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </StyledTable>
            <ControlPanel>
                <div>
                    <label>
                        Rows per page:
                        <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                            {[5, 10, 15, 20, 50].map(number => (
                                <option key={number} value={number}>{number}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Jump to row:
                        <Input type="number" min="1" max={data.length} onChange={handleJumpToRow}/>
                    </label>
                </div>
                <Pagination
                    rowsPerPage={rowsPerPage}
                    totalRows={sortedData.length}
                    paginate={setCurrentPage}
                    currentPage={currentPage}
                />
            </ControlPanel>
        </div>
    );
};

export default Table;