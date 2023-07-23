import { useEffect, useState } from 'react';
import './Table.css';


export default function Table(props) {
    const { summaryData , price, searchType } = props;
    const [tableData, setTableData] = useState(summaryData);
    const [sortOrder, setSortOrder] = useState('asc');
    
    let columnStrings;
    if (searchType === 'price') {
        columnStrings = {
        city: 'City',
        bedrooms: 'Bedrooms',
        bathrooms: 'Bathrooms',
        propertySubType: 'Property Type',
        listingUpdateReason: 'Reason for listing'
        }
    } else {
        columnStrings = {
            city: 'City',
            mean: 'Mean',
            std: 'Standard Deviation',
            min: 'Minimum',
            '25%': '25%',
            '50%': '50%',
            '75%': '75%',
            max: 'Maximum',
        }
    }



    const tableSort = (column) => {

        const sortedData = [...tableData].sort((a, b) => {
          if (a[column] < b[column]) {
            return sortOrder === 'asc' ? -1 : 1;
          }
          if (a[column] > b[column]) {
            return sortOrder === 'asc' ? 1 : -1;
          }
          return 0;
        });
    
        setTableData(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      };

    const handleSort = ({ target }) => {
        const { className } = target;
        tableSort(className);
      };
 
 

    return (
        <>
        <div className="table-context">
            <h1>What £{price} is most likely to buy in each city</h1>
        </div>
        
        <table className="summary-table">
            <thead className="summary-header">
                <tr>
                    {Object.entries(columnStrings).map(arr => (
                        <th key={arr[0]}
                            className={arr[0]}
                            onClick={handleSort}
                        >
                            {arr[1]}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="summary-body">
                
                {tableData.map(row => (
                    <tr key={row.city}>
                        {Object.entries(row).map(entry => {
                            {if (searchType === 'features') {
                                return <td className={entry[0]}>{entry[1].toLocaleString()}</td> 
                         } else {
                            return <td className={entry[0]}>{entry[1]}</td>
                            }}
                        })}
                    </tr>

                       
                        ))}
                    
                
            </tbody>
        </table>
        </>
    )



};
