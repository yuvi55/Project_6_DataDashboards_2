import React, { useState, useEffect } from "react";
import md5 from "blueimp-md5";
import { Link } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';


function Dashboard() {
  const publickey = 'b1cb39551462c02e72cf7011300cc810';
  const privatekey = '74d6dc2edc5050ac36918bd6f61f926fb8de092d';
  const ts = 2;
  const stringToHash = ts + privatekey + publickey;
  const hash = md5(stringToHash);
  console.log(hash)
  const baseUrl = `https://gateway.marvel.com:443/v1/public/comics?ts=${ts}&apikey=${publickey}&hash=${hash}`;

  const [data, setData] = useState([]);
  const [dataAll, setAllData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [priceRange, setPriceRange] = useState(2); // Initial slider value
  const [avgPrice, setavgPrice] = useState(0);
  const [avgPageCount, setavgPageCount] = useState(0);

  useEffect(() => {
    async function get_api_data() {
      let response = await fetch(baseUrl);
      const data = await response.json();
      let main_req = data.data.results;
      setAllData(main_req);
      filterData(); // Initial filtering
    }

    get_api_data();
  }, []);

  const filterData = () => {
    // Filter the data based on the filterText and priceRange
    const filter_data = dataAll.filter((item) =>
      item.title.toLowerCase().includes(filterText.toLowerCase()) &&
      item.prices[0].price >= priceRange - 1 && item.prices[0].price <= priceRange + 1
    );

    // Update the data state with the filtered results
    setData(filter_data);
    average_price_books(filter_data) ; 
    average_page_count(filter_data) ; 
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const updatePriceRange = (newValue) => {
    setPriceRange(newValue);
  };

  const average_price_books = (filter_data) =>{
    
    let avg_price = 0
    let sum = 0
    for(let i = 0 ; i < filter_data.length ; i ++){
        sum = sum + filter_data[i].prices[0].price
    }
    avg_price = sum/filter_data.length
    avg_price = Math.round(avg_price * 100)/100
    setavgPrice(avg_price)
  }

  const average_page_count = (filter_data) =>{
    
    let avg_page_count = 0
    let sum = 0
    for(let i = 0 ; i < filter_data.length ; i ++){
        sum = sum + filter_data[i].pageCount
    }
    avg_page_count = sum/filter_data.length
    avg_page_count = Math.round(avg_page_count * 100)/100
    setavgPageCount(avg_page_count)
  }

  return (
    <div>
      <h1>Marvel Comic Book Data</h1>
        <div className="stat_1">
            <h3>Count of Data Present</h3>
            <p>{dataAll.length}</p>
        </div>
        <div className="chart">
      <h3>Average Prices of Books Displayed</h3>
      <Bar
        data={{
          labels: ['Average Prices'],
          datasets: [
            {
              label: 'Average Prices',
              data: [avgPrice],
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        }}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>

    {/* Chart for Average Page Count */}
    <div className="chart">
      <h3>Average Page Count of Books Displayed</h3>
      <Bar
        data={{
          labels: ['Average Page Count'],
          datasets: [
            {
              label: 'Average Page Count',
              data: [avgPageCount],
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        }}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
      <div>
      <input
        type="text"
        placeholder="Filter by Title"
        value={filterText}
        onChange={handleFilterChange}
      />
      <button onClick={filterData}>Search</button>
        </div>  
      

      <div className="slidecontainer">
        <input
          type="range"
          min="1"
          max="10"
          value={priceRange}
          className="slider"
          onChange={(e) => updatePriceRange(parseInt(e.target.value))}
        />
        <div>Price Range: ${priceRange - 1} - ${priceRange + 1}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Title</th>
            <th>Page Count</th>
            <th>Price</th>
            <th>Description</th>
            <th>Image</th>
            <th>Link</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>{item.pageCount}</td>
              <td>{item.prices[0].price}</td>
              <td>{item.description}</td>
              <td>
                <img
                  className="images"
                  src={item.images[0]?.path + "." + item.images[0]?.extension}
                  alt="No Image found"
                />
              </td>
              <td>
                <Link to= {`/comics/${item.id}`}>Link for more</Link>
              </td>
              <td>
                {item.id}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
