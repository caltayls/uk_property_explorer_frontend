import { useEffect, useState } from 'react';
import './Table.css';


export default function Table(props) {
    const { summaryData , postData } = props;
    const [tableData, setTableData] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    
    console.log(postData.searchType);

    useEffect(() => {
        setTableData(summaryData);
    }, [summaryData]);
    let columnStrings;
    if (postData.searchType === 'price') {
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
            {
                postData.searchType==='price'
                ? <h1>What £{Number(postData.price).toLocaleString()} is most likely to buy in each area</h1>
                : <h1>Summary Statistics for a {postData.numOfBedrooms} bed {postData.propertyType}</h1> 
            } 
            <p>Statistics are based on 100 most recently added properties to Rightmove that match search criteria.</p>
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
                
                {tableData && tableData.map(row => (
                    <tr key={row.city}>
                        {Object.entries(row).map(entry => {
                            {if (postData.searchType === 'features') {
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
