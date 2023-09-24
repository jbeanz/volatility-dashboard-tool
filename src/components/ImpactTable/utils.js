import styled from 'styled-components';

// Define a styled component for the table container
const TableContainer = styled.div({
    maxHeight: '300px',
    overflowY: 'auto',
});

// Define a styled component for the table
const Table = styled.table({
    width: '100%',
    borderCollapse: 'collapse',
});

// Define a styled component for table header (th) and table data cells (td)
const TableCell = styled.td({
    padding: '8px',
    border: '1px solid #ddd',
    textAlign: 'left',
});

// Define a styled component for table header cells (th)
const TableHeaderCell = styled.th({
    padding: '8px',
    border: '1px solid #ddd',
    textAlign: 'left',
    fontWeight: 'bold',
});

// Define a styled component for even rows (alternating row colors)
const TableRowEven = styled.tr({
    backgroundColor: '#f2f2f2',
});

// Define a styled component for table hover effect
const TableRowHover = styled.tr({
    '&:hover': {
        backgroundColor: '#ddd',
    },
});

export { TableContainer, Table, TableCell, TableHeaderCell, TableRowEven, TableRowHover };
