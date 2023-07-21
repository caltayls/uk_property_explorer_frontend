import { useEffect, useState } from 'react';
import './Table.css';


export default function Table(props) {
    const { jsonSummary, price } = props;
    const [tableData, setTableData] = useState(jsonSummary);
    const [sortOrder, setSortOrder] = useState('asc');
    
    const[columnObj, setIsRotated] = useState( {
        city: false,
        bedrooms: false,
        bathrooms: false,
        propertySubType: false,
        listingUpdateReason: false
    });


    const columnStrings = {
        city: 'City',
        bedrooms: 'Bedrooms',
        bathrooms: 'Bathrooms',
        propertySubType: 'Property Type',
        listingUpdateReason: 'Reason for listing'
    };

   

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
                        <td className='city'>{row.city}</td>
                        <td>{row.bedrooms}</td>
                        <td>{row.bathrooms}</td>
                        <td>{row.propertySubType}</td>
                        <td>{row.listingUpdateReason}</td>
                    </tr>
                    )
                )}
            </tbody>
        </table>
        </>
    )



};
